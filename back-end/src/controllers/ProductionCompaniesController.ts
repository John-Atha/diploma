import express, { Router } from "express";
import { Session } from "neo4j-driver";
import { Genre } from "../models/Genre";
import { GeneralService } from "../services/GeneralService";


export class ProductionCompaniesController {
    productionCompaniesService: GeneralService;

    constructor(session: Session) {
        this.productionCompaniesService = new GeneralService(session, "ProductionCompany", Genre, "name");
    }

    getAll = async (pageSize: number, pageIndex: number) => this.productionCompaniesService.getAll(pageSize, pageIndex);
    getOneByKey = async (value: string|number) => this.productionCompaniesService.getOneByKey(value);

}