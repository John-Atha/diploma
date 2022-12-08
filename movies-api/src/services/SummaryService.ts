import type { Driver } from "neo4j-driver";

export class SummaryService {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async getSummary() {
    const query =
      "MATCH (n) RETURN count(labels(n)) as count, labels(n) as labels;";
    const session = this.driver.session();
    console.log("QUERY:", query);
    const result = await session.executeRead((tx) => tx.run(query));
    await session.close();
    const data: any = {};
    result.records.forEach((record) => {
      const {
        count: { low: counter },
        labels,
      } = record.toObject();
      data[labels[0]] = counter;
    });
    return data;
  }
}
