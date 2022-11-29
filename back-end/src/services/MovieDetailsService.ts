import type { Driver } from "neo4j-driver";

export class MovieDetailsService {
  driver: Driver;
  id: string;

  constructor(driver: Driver, id: string) {
    this.driver = driver;
    this.id = id;
  }

  async getOne() {
    const session = this.driver.session();
    let query = `MATCH (m:Movie { id: $id })-[r]-(v) where not v:User return r, v;`;

    const params = { id: this.id };
    const results = await session.executeRead((tx) => tx.run(query, params));
    // console.log(results);
    const data = results.records.map((result) => {
      const datum = result.toObject();
      const relProperties = datum.r.propetries;
      const nodeProperties = {};
      Object.keys(datum.v.properties).forEach((key: string) => {
        const val = datum.v.properties[key];
        if (typeof val?.["low"] === "number")
          (nodeProperties as any)[key] = val["low"];
        else (nodeProperties as any)[key] = val;
      });
      let newDatum = {
        nodeType: datum.v.labels[0],
        ...relProperties,
        ...nodeProperties,
      };
      return newDatum;
    });
    return data;
  }
}
