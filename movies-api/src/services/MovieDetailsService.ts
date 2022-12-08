import type { Driver, Session } from "neo4j-driver";
import { Movie } from "../models/Movie";
import {
  flattenNumericFields,
  queryResultToClassObject,
} from "../utils/transforms";

export class MovieDetailsService {
  driver: Driver;
  id: string;

  constructor(driver: Driver, id: string) {
    this.driver = driver;
    this.id = id;
  }

  async getOne() {
    const session = this.driver.session();
    const neighbours = await this.getNeighboursData(session);
    const fields = await this.GetMovieDetails(session);
    await session.close();
    const data = { neighbours, fields };
    return data;
  }

  async GetMovieDetails(session: Session) {
    let query = `MATCH (m:Movie { id: $id })-[r:RATES]-(:User) return m, count(r) as ratings_count, avg(r.rating) as ratings_average;`;
    const params = { id: this.id };
    const results = await session.executeRead((tx) => tx.run(query, params));
    let item = null;
    if (results.records.length) {
      const record = results.records[0];
      const { m, ...rest_fields } = record.toObject();
      const movie = { ...m.properties, ...rest_fields };
      const item = new Movie({ ...movie });
      return flattenNumericFields(item);
    }
    return item;
  }

  async getNeighboursData(session: Session) {
    let query = `MATCH (m:Movie { id: $id })-[r]-(v) where not v:User return r, v;`;
    const params = { id: this.id };
    const results = await session.executeRead((tx) => tx.run(query, params));
    // console.log(results);
    const neighbours = results.records.map((result) => {
      const datum = result.toObject();
      const relProperties = datum.r.properties;
      const nodeProperties = {};
      Object.keys(datum.v.properties).forEach((key: string) => {
        const val = datum.v.properties[key];
        if (typeof val?.["low"] === "number")
          (nodeProperties as any)[key] = val["low"];
        else (nodeProperties as any)[key] = val;
      });
      let newDatum = {
        nodeType: !!relProperties.cast_id
          ? "Cast"
          : !!relProperties.credit_id
          ? "Crew"
          : datum.v.labels[0],
        ...relProperties,
        ...nodeProperties,
      };
      return newDatum;
    });
    return neighbours;
  }
}
