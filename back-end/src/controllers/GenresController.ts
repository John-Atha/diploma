import express, { Router } from "express";
import { Session } from "neo4j-driver";
import { Genre } from "../models/Genre";
import { GeneralService } from "../services/GeneralService";


export class GenresController {
    genresService: GeneralService;

    constructor(session: Session) {
        this.genresService = new GeneralService(session, "Genre", Genre, "name");
    }

    getAll = async (pageSize: number, pageIndex: number) => this.genresService.getAll(pageSize, pageIndex);
    getOneByKey = async (value: string|number) => this.genresService.getOneByKey(value);

}