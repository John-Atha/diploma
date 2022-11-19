import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import BodyParser from "body-parser";
import neo4j from "neo4j-driver";
import { GenresController } from "./controllers/GenresController";
import { notFound, PaginationResponse } from "./utils/responses";
import { getPaginationParams } from "./utils/paginate";
import { ProductionCompaniesController } from "./controllers/ProductionCompaniesController";

dotenv.config();
if (!process.env.PORT) process.exit(1);
const PORT = parseInt(process.env.PORT, 10);
const app = express();
app.use(helmet());
app.use(cors());
app.use(BodyParser.json());
const server = http.createServer(app);

const neo4jUrl = process.env.NEO4J_URL || "";
const neo4jUsername = process.env.NEO4J_USERNAME || "neo4j";
const neo4jPassword = process.env.NEO4J_PASSWORD || "password";

const driver = neo4j.driver(
  neo4jUrl,
  neo4j.auth.basic(neo4jUsername, neo4jPassword)
);
const session = driver.session();

const router = express.Router();

const genresController = new GenresController(session);
const productionCompaniesController = new ProductionCompaniesController(session);

router.get("/genres", async (req, res) => {
    let pageSize = undefined;
    let pageIndex = undefined;
    try {
        ({ pageIndex, pageSize } = getPaginationParams(req.query));
    }
    catch (err) {
        return res.status(400).send(err);
    }
    const data = await genresController.getAll(pageSize, pageIndex);
    const response = new PaginationResponse(data, pageIndex, pageSize);
    res.send(response);
});

router.get("/genres/:name", async (req, res) => {
    const name = req.params.name;
    const genre = await genresController.getOneByKey(`"${name}"`);
    if (!genre)
        res.status(400).send(notFound("Genre", name));
    else
        res.send(genre);
});


router.get("/productionCompanies", async (req, res) => {
    let pageSize = undefined;
    let pageIndex = undefined;
    try {
        ({ pageIndex, pageSize } = getPaginationParams(req.query));
    }
    catch (err) {
        return res.status(400).send(err);
    }
    const data = await productionCompaniesController.getAll(pageSize, pageIndex);
    const response = new PaginationResponse(data, pageIndex, pageSize);
    res.send(response);
});

router.get("/productionCompanies/:name", async (req, res) => {
    const name = req.params.name;
    const company = await productionCompaniesController.getOneByKey(`"${name}"`);
    if (!company)
        res.status(400).send(notFound("Production Company", name));
    else
        res.send(company);
});





app.use("/", router);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
