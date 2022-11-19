import { Session } from "neo4j-driver";
import { GeneralService } from "../services/GeneralService";

export class GeneralController {
  service: GeneralService;

  constructor(
    session: Session,
    node: string,
    nodeClass: any,
    keyProperty: string
  ) {
    this.service = new GeneralService(session, node, nodeClass, keyProperty);
  }

  getAll = async (
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) => this.service.getAll(pageSize, pageIndex, sortBy, order);

  getOneByKey = async (value: string | number) =>
    this.service.getOneByKey(value);

  getRelatedMovies = async (
    value: string | number,
    pageSize: number,
    pageIndex: number,
    sortBy?: string,
    order?: "asc" | "desc"
  ) => this.service.getRelatedMovies(value, pageSize, pageIndex, sortBy, order);
}
