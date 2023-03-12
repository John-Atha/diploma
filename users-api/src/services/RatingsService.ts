import type { Driver } from "neo4j-driver";
import { paginateQuery, sortQuery } from "../utils/preProcessQuery";
import { Neo4jRecordToRatingObject } from "../utils/transforms";
import axios from "axios";
import { MovieBrief } from "../models/Movie";

export class RatingsService {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async getAllRatingsOfUserBrief(username: string) {
    const query = `MATCH (u:User { username: $username })-[r:RATES]-(m:Movie) return r, m`;
    const session = this.driver.session();
    const params = { username };
    console.log("QUERY:", query, params);
    const results = await session.executeRead((tx) => tx.run(query, params));
    const ratings = results.records.map((record) =>
      Neo4jRecordToRatingObject(record, false)
    );
    await session.close();
    return { existingRatings: ratings };
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
      Neo4jRecordToRatingObject(record, true)
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
    await session.close();
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
    try {
      const results = await session.executeWrite((tx) => tx.run(query, params));
      await session.close();
      const rating_ = Neo4jRecordToRatingObject(results.records[0], true);
      return rating_;
    } catch (err) {
      await session.close();
      console.log(err);
      throw err;
    }
  }

  async createRating(userId: number, movieId: number, rating: number) {
    const ratingsExists = await this.checkRatingByUserAndMovieExists(
      userId,
      movieId
    );
    if (ratingsExists) throw "Rating by this user to this movie already exists";
    const datetime = new Date().getTime() / 1000;
    const query = `MATCH (u:User { id: $userId }), (m:Movie {id: $movieId }) CREATE (u)-[r:RATES { rating: $rating, datetime: $datetime }]->(m) return u, r, m`;
    const params = { userId, movieId: `${movieId}`, rating, datetime };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    const results = await session.executeWrite((tx) => tx.run(query, params));
    await session.close();
    const rating_ = Neo4jRecordToRatingObject(results.records[0], true);
    return rating_;
  }

  async deleteRating(userId: number, movieId: number) {
    const query = `MATCH (u:User { id: $userId })-[r:RATES]-(m:Movie {id: $movieId }) delete r`;
    const params = { userId, movieId: `${movieId}` };
    const session = this.driver.session();
    console.log("QUERY:", query, params);
    await session.executeWrite((tx) => tx.run(query, params));
    await session.close();
    return "Deleted successfully";
  }

  async getMoviesByIds(movieIds: string[]) {
    const query = `MATCH (m:Movie)-[r:RATES]-(:User) where m.id in $movieIds return r, m, count(r) as ratings_count, avg(r.rating) as ratings_average;`;
    const params = { movieIds };
    console.log("QUERY:", query, params);
    const session = this.driver.session();
    const results = await session.executeRead((tx) => tx.run(query, params));
    const movies: any = {};
    results.records.forEach((record) => {
      const { m, ratings_count, ratings_average } = record.toObject();
      const movie = new MovieBrief({
        ...m.properties,
        ratings_count:
          ratings_count?.low !== undefined ? ratings_count?.low : ratings_count,
        ratings_average,
      });
      movies[m.properties.id] = movie;
    });
    await session.close();
    return movies;
  }

  async getUserPredictions(userId: number) {
    const modelApiBaseUrl = process.env.MODEL_API_URL || "";
    return axios
      .get(`${modelApiBaseUrl}/users/${userId}/predict`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getUserRecommendations(userId: number, limit: number) {
    const modelApiBaseUrl = process.env.MODEL_API_URL || "";
    try {
      const response = await axios.get(
        `${modelApiBaseUrl}/users/${userId}/recommend/${limit}`
      );
      const { recommendations } = response.data;
      const moviesIds = recommendations.map(({ movie_id }: any) => movie_id);
      const moviesData = await this.getMoviesByIds(moviesIds);
      const result: any = [];
      moviesIds.forEach((movie_id: string) => {
        result.push({
          // predicted_rating: normalizedRecommendations[movie_id],
          ...moviesData[movie_id],
        })
      })
      return result;
    } catch (err) {
      throw err;
    }
  }
}
