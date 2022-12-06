import type { Driver } from "neo4j-driver";
import { paginateQuery, sortQuery } from "../utils/preProcessQuery";
import { Neo4jRecordToRatingObject } from "../utils/transforms";

export class RatingsService {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async getAllRatingsOfUser(
    username: string,
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) {
    const initQuery = `MATCH (u:User { username: $username })-[r:RATES]-(m:Movie)-[r2:RATES]-(:User) return u, r, m, count(r2) as ratings_count, avg(r2.rating) as ratings_average;`;
    const { sortedQuery, params } = sortQuery({
      query: initQuery,
      sortBy,
      order,
      resultNodeName: "r",
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
    (params as any)["username"] = username;
    console.log("QUERY:", paginated, params);
    const results = await session.executeRead((tx) =>
      tx.run(paginated, params)
    );
    const ratings = results.records.map((record) =>
      Neo4jRecordToRatingObject(record)
    );
    await session.close();
    return ratings;
  }

  async checkRatingByUserAndMovieExists(userId: number, movieId: number) {
    const query = `MATCH (u:User { id: $userId })-[r:RATES]-(m:Movie {id: $movieId }) return u, r, m`;
    const params = { userId, movieId: `${movieId}` };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    const results = await session.executeRead((tx) => tx.run(query, params));
    const exists = !!results.records.length;
    return exists;
  }

  async updateRating(userId: number, movieId: number, rating: number) {
    const ratingsExists = await this.checkRatingByUserAndMovieExists(
      userId,
      movieId
    );
    if (!ratingsExists)
      throw "Rating by this user to this movie does not exist";
    const datetime = new Date().getTime();
    const query = `MATCH (u:User { id: $userId })-[r:RATES]-(m:Movie {id: $movieId }) SET r.rating=$rating, u.datetime=$datetime return u, r, m`;
    const params = { userId, movieId: `${movieId}`, rating, datetime };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    const results = await session.executeWrite((tx) => tx.run(query, params));
    // console.log(results);
    const rating_ = Neo4jRecordToRatingObject(results.records[0]);
    return rating_;
  }

  async createRating(userId: number, movieId: number, rating: number) {
    const ratingsExists = await this.checkRatingByUserAndMovieExists(
      userId,
      movieId
    );
    if (ratingsExists) throw "Rating by this user to this movie already exists";
    const datetime = new Date().getTime()/1000;
    const query = `MATCH (u:User { id: $userId }), (m:Movie {id: $movieId }) CREATE (u)-[r:RATES { rating: $rating, datetime: $datetime }]->(m) return u, r, m`;
    const params = { userId, movieId: `${movieId}`, rating, datetime };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    const results = await session.executeWrite((tx) => tx.run(query, params));
    const rating_ = Neo4jRecordToRatingObject(results.records[0]);
    console.log(rating_);
    return rating_;
  }

  async deleteRating(userId: number, movieId: number) {
    const query = `MATCH (u:User { id: $userId })-[r:RATES]-(m:Movie {id: $movieId }) delete r`;
    const params = { userId, movieId: `${movieId}` };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    await session.executeWrite((tx) => tx.run(query, params));
    return "Deleted successfully";
  }
}
