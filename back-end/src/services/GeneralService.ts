import type { Driver } from "neo4j-driver";
import { MovieBrief } from "../models/Movie";
import { paginateQuery, sortQuery } from "../utils/preProcessQuery";
import { queryResultToClassObject } from "../utils/transforms";

export class GeneralService {
  driver: Driver;
  node: string;
  itemClass: any;
  keyProperty: string;

  constructor(driver: Driver, node: string, itemClass: any, keyProperty: string) {
    this.driver = driver;
    this.node = node;
    this.itemClass = itemClass;
    this.keyProperty = keyProperty;
  }

  async getAll(
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) {
    let initQuery = `MATCH (n:${this.node}) return n;`;
    if (this.node !== "Movie") {
      initQuery = `MATCH (n:${this.node})-[r]-(m:Movie) return n, count(m) as movies_count;`;
    }
    const { sortedQuery, params } = sortQuery({
      query: initQuery,
      sortBy,
      order,
      resultNodeName: "n",
    });
    const paginated = pageSize!==-1 ? paginateQuery({
      query: sortedQuery,
      pageSize,
      pageIndex,
    }) : sortedQuery;
    const session = this.driver.session();
    console.log("QUERY:", paginated, params);
    const results = await session.executeRead((tx) =>
      tx.run(paginated, params)
    );
    const items = results.records.map((record) =>
      queryResultToClassObject(record, this.itemClass)
    );
    await session.close();
    return items;
  }

  async getOneByKey(value: string | number) {
    const session = this.driver.session();
    let query = `MATCH (n:${this.node}) where n.${this.keyProperty}=$value return n;`;
    if (this.node !== "Movie") {
      query = `MATCH (n:${this.node})-[r]-(m:Movie) where n.${this.keyProperty}=$value return n, count(m) as movies_count;`;
    }
    const params = { value };
    console.log("QUERY:", query, params);
    const results = await session.executeRead((tx) => tx.run(query, params));
    await session.close();
    let item = null;
    if (results.records.length) {
      const record = results.records[0];
      item = queryResultToClassObject(record, this.itemClass);
    }
    return item;
  }

  async getRelatedMovies(
    value: string | number,
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) {
    const session = this.driver.session();
    const initQuery = `MATCH (m:Movie)-[r]-(n:${this.node}) where n.${this.keyProperty}=$value return m;`;
    let params = { value };
    const { sortedQuery, params: sortingParams } = sortQuery({
      query: initQuery,
      sortBy,
      order,
      resultNodeName: "m",
    });
    params = {
      ...params,
      ...sortingParams,
    };
    const paginated = paginateQuery({
      query: sortedQuery,
      pageSize,
      pageIndex,
    });
    console.log("QUERY:", paginated, params);
    const results = await session.executeRead((tx) =>
      tx.run(paginated, params)
    );
    await session.close();
    const movies = results.records.map((result) => {
      const movie = result.toObject().m.properties;
      const item = new MovieBrief({ ...movie });
      return item;
    });
    return movies;
  }
}
