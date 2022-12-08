import type { Driver, Session } from "neo4j-driver";
import { Genre } from "../models/Genre";
import { Keyword } from "../models/Keyword";
import { Language } from "../models/Language";
import { Movie, MovieBrief } from "../models/Movie";
import { Person } from "../models/Person";
import { ProductionCompany } from "../models/ProductionCompany";
import { ProductionCountry } from "../models/ProductionCountry";
import { queryResultToClassObject } from "../utils/transforms";

export class SearchService {
  driver: Driver;
  itemClass: any;
  indexName: string;
  key: string;

  constructor(driver: Driver, entity: string, key: string) {
    const configs = {
      Movies: {
        itemClass: MovieBrief,
        indexName: "MoviesSearch",
      },
      Genres: {
        itemClass: Genre,
        indexName: "GenresSearch",
      },
      Keywords: {
        itemClass: Keyword,
        indexName: "KeywordsSearch",
      },
      Languages: {
        itemClass: Language,
        indexName: "LanguagesSearch",
      },
      Productioncompanies: {
        itemClass: ProductionCompany,
        indexName: "ProductionCompaniesSearch",
      },
      Productioncountries: {
        itemClass: ProductionCountry,
        indexName: "ProductionCountriesSearch",
      },
      People: {
        itemClass: Person,
        indexName: "PeopleSearch",
      },
    };

    this.driver = driver;
    this.indexName = (configs as any)[entity].indexName;
    this.itemClass = (configs as any)[entity].itemClass;
    this.key = key;
  }

  async Search() {
    const session = this.driver.session();
    let query = `CALL db.index.fulltext.queryNodes("${this.indexName}", $queryKey) YIELD node, score
        RETURN node, score;`;
    let params = { queryKey: this.key };
    console.log("QUERY:", query, params);
    const results = await session.executeRead((tx) => tx.run(query, params));
    const items = results.records.map((record) =>
      queryResultToClassObject(record, this.itemClass)
    );
    await session.close();
    return items;
  }
}
