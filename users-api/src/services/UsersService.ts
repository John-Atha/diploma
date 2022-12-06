import type { Driver } from "neo4j-driver";
import { User, UserWithPassword } from "../models/User";
import { paginateQuery, sortQuery } from "../utils/preProcessQuery";
import { queryResultToClassObject } from "../utils/transforms";
import neo4j from "neo4j-driver";
import Bcrypt from "bcrypt";
import JsonWebToken from "jsonwebtoken";
import { getRequestUser } from "../utils/getRequestUser";

const isUsernameValid = (username: string) => {
  return username?.length > 5;
};
const isPasswordValid = (password: string) => {
  return password?.length > 5;
};

interface UpdateUserProps {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UsersService {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async getAll(
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) {
    const initQuery = `MATCH (u:User) return u;`;
    const { sortedQuery, params } = sortQuery({
      query: initQuery,
      sortBy,
      order,
      resultNodeName: "u",
    });
    const paginated =
      pageSize !== -1
        ? paginateQuery({
            query: sortedQuery,
            pageSize,
            pageIndex,
          })
        : sortedQuery;
    const session = this.driver.session();
    console.log("QUERY:", paginated, params);
    const results = await session.executeRead((tx) =>
      tx.run(paginated, params)
    );
    const users = results.records.map((record) =>
      queryResultToClassObject(record, User)
    );
    await session.close();
    return users;
  }

  async getByUsername(username: string, includePassword: boolean = false) {
    const query = `MATCH (u:User) where u.username=$username return u;`;
    const params = { username };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    const results = await session.executeRead((tx) => tx.run(query, params));
    if (!results.records.length) return null;

    const user = queryResultToClassObject(
      results.records[0],
      includePassword ? UserWithPassword : User
    );
    await session.close();
    return user;
  }

  async getById(id: number, includePassword: boolean = false) {
    const query = `MATCH (u:User) where u.id=$id return u;`;
    const params = { id: neo4j.int(id) };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    const results = await session.executeRead((tx) => tx.run(query, params));
    if (!results.records.length) return null;
    const user = queryResultToClassObject(
      results.records[0],
      includePassword ? UserWithPassword : User
    );
    await session.close();
    return user;
  }

  async createUser(username: string, password: string) {
    if (username.length < 5)
      throw "Username must be at least 5 characters long";
    const existingUser = await this.getByUsername(username);
    if (existingUser) {
      throw "User with this username already exists";
    }
    const hashedPassword = Bcrypt.hashSync(password, 10);
    const maxDatasetUserId = await this.getMaxDatasetUserId();
    const user = {
      id: maxDatasetUserId + 1,
      username,
      hashedPassword,
    };
    const query = `CREATE (u:User { username: $username, id: $id, hashedPassword: $hashedPassword });`;
    const params = { ...user, id: neo4j.int(user.id) };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    await session.executeWrite((tx) => tx.run(query, params));
    const token = JsonWebToken.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY || "placeholder421%$#^Secret1241Key"
    );
    const { hashedPassword: p, ...userData } = user;
    return { ...userData, access: token };
  }

  async login(username: string, password: string) {
    const user = await this.getByUsername(username, true);
    console.log(user);
    if (!user) throw "Invalid credentials";
    const isPasswordCorrect = Bcrypt.compareSync(
      password || "",
      user.hashedPassword
    );
    if (!isPasswordCorrect) throw "Invalid credentials";
    const token = JsonWebToken.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY || "placeholder421%$#^Secret1241Key"
    );
    return { access: token, username: user.username, id: user.id };
  }

  async logged(token: string) {
    const requestUser = getRequestUser(token);
    if (!requestUser) throw "Unauthorized";
    const { id } = requestUser as any;
    const user = await this.getById(id);
    return user;
  }

  async update(
    { username, currentPassword, newPassword }: UpdateUserProps,
    id: number
  ) {
    const user = await this.getById(id, true);
    if (!user) throw "User not found";
    if (username?.length) {
      const sameUsernameUser = await this.getByUsername(username);
      if (sameUsernameUser && sameUsernameUser.id !== id)
        throw "Username is already in use";
      if (!isUsernameValid(username))
        throw "Username must be at least 5 characters long";
      else user.username = username;
    }
    if (currentPassword?.length) {
      const isPasswordCorrect = Bcrypt.compareSync(
        currentPassword || "",
        user.hashedPassword
      );
      if (!isPasswordCorrect) throw "Current password you provided is invalid";
      else {
        if (!isPasswordValid(newPassword as string))
          throw "New Password must be at least 5 characters long";
        user.hashedPassword = Bcrypt.hashSync(newPassword as string, 10);
      }
    }
    const session = this.driver.session();
    const query = `MATCH (u:User { id: $id }) SET u.username = $username, u.hashedPassword = $hashedPassword return u`;
    const params = user;
    await session.executeWrite((tx) => tx.run(query, params));
    const { hashedPassword: p, ...userData } = user;
    return userData;
  }

  async getMaxDatasetUserId() {
    const query = `MATCH (u:User) return max(u.id) as id`;
    const session = this.driver.session();
    console.log("QUERY:", query);
    const results = await session.executeRead((tx) => tx.run(query));
    const {
      id: { low: id },
    } = results.records?.[0].toObject();
    return id;
  }
}
