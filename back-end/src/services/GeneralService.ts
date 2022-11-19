import type { Session } from "neo4j-driver";
import { MovieBrief } from "../models/Movie";
import { paginateQuery, sortQuery } from "../utils/preProcessQuery";

export class GeneralService {
  session: Session;
  node: string;
  itemConstructor: any;
  keyProperty: string;

  constructor(
    session: Session,
    node: string,
    itemConstructor: any,
    keyProperty: string
  ) {
    this.session = session;
    this.node = node;
    this.itemConstructor = itemConstructor;
    this.keyProperty = keyProperty;
  }

  async getAll(
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) {
    const initQuery = `MATCH (n:${this.node}) return n;`;
    const { sortedQuery, params } = sortQuery({
      query: initQuery,
      sortBy,
      order,
      resultNodeName: "n",
    });
    const paginated = paginateQuery({
      query: sortedQuery,
      pageSize,
      pageIndex,
    });
    console.log("QUERY:", paginated, params);
    const results = await this.session.run(paginated, params);
    const items = results.records.map((result) => {
      const datum = result.toObject().n.properties;
      if (!!datum.id?.["low"]) datum.id = datum.id["low"];
      if (!!datum.gender?.["low"]) datum.gender = datum.gender["low"];
      const item = new this.itemConstructor({ ...datum });
      return item;
    });
    return items;
  }

  async getOneByKey(value: string | number) {
    const query = `MATCH (n:${this.node}) where n.${this.keyProperty}=$value return n;`;
    const params = { value };
    console.log("QUERY:", query, params);
    const results = await this.session.run(query, params);
    let item = null;
    if (results.records.length) {
      const datum = results.records[0].toObject().n.properties;
      if (!!datum.id?.["low"]) datum.id = datum.id["low"];
      if (!!datum.gender?.["low"]) datum.gender = datum.gender["low"];
      item = new this.itemConstructor({ ...datum });
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
    const paginated = paginateQuery({ query: sortedQuery, pageSize, pageIndex });
    console.log("QUERY:", paginated, params);
    const results = await this.session.run(paginated, params);
    const movies = results.records.map((result) => {
      const movie = result.toObject().m.properties;
      const item = new MovieBrief({ ...movie });
      return item;
    });
    return movies;
  }
}
