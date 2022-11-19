import type { Session } from "neo4j-driver";
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
            item = new this.itemConstructor({ ...datum });
        }
        return item;
    }

}