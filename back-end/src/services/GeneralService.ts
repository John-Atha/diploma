import type { Session } from "neo4j-driver";
import { MovieBrief } from "../models/Movie";
import { paginate } from "../utils/paginate";

export class GeneralService {
    session: Session;
    node: string;
    itemConstructor: any;
    keyProperty: string;

    constructor(session: Session, node: string, itemConstructor: any, keyProperty: string) {
        this.session = session;
        this.node = node;
        this.itemConstructor = itemConstructor;
        this.keyProperty = keyProperty;
    }

    async getAll(pageSize: number, pageIndex: number) {
        const initQuery = `MATCH (n:${this.node}) return n;`;
        const paginated = paginate({ query: initQuery, pageSize, pageIndex });
        console.log("QUERY:", paginated);
        const results = await this.session.run(paginated);
        const items = results.records.map((result) => {
            const datum = result.toObject().n.properties;
            if (!!datum.id)
                datum.id = datum.id["low"];
            if (!!datum.gender)
                datum.gender = datum.gender["low"];
            const item = new this.itemConstructor({ ...datum });
            return item;
        })
        return items;
    }

    async getOneByKey(value: string|number) {
        const query = `MATCH (n:${this.node}) where n.${this.keyProperty}=${value} return n;`;
        console.log("QUERY:", query);
        const results = await this.session.run(query);
        let item = null;
        if (results.records.length) {
            const datum = results.records[0].toObject().n.properties;
            if (!!datum.id)
                datum.id = datum.id["low"];
            if (!!datum.gender)
                datum.gender = datum.gender["low"];
            item = new this.itemConstructor({ ...datum });
        }
        return item;
    }

    async getRelatedMovies(value: string|number, pageSize: number, pageIndex: number) {
        const initQuery =`MATCH (m:Movie)-[r]-(n:${this.node}) where n.${this.keyProperty}=${value} return m;`;
        const paginated = paginate({ query: initQuery, pageSize, pageIndex });
        console.log("QUERY:", paginated);
        const results = await this.session.run(paginated);
        const movies = results.records.map((result) => {
            const movie = result.toObject().m.properties;
            const item = new MovieBrief({ ...movie });
            return item;
        })
        return movies;
    }

}