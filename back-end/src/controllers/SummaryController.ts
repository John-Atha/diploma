import { Driver } from "neo4j-driver";
import { SummaryService } from "../services/SummaryService";

export class SummaryController {
  service: SummaryService;

  constructor(driver: Driver) {
    this.service = new SummaryService(driver);
  }

  getSummary = async () => this.service.getSummary();
}
