import type { Session } from "neo4j-driver";
import { paginate } from "../utils/paginate";

class MoviesService {
    session: Session;

    constructor(session: Session) {
        this.session = session;
    }

    async getAll() {
        const initQuery = `MATCH (m:Movie) return m;`;
        const paginated = paginate({ query: initQuery });
        const movies = await this.session.run(paginated);
        console.log(movies);
    }

}