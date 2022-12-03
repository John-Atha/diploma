import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import BodyParser from "body-parser";
import neo4j from "neo4j-driver";
import { Genre } from "./models/Genre";
import { ProductionCompany } from "./models/ProductionCompany";
import { ProductionCountry } from "./models/ProductionCountry";
import { Language } from "./models/Language";
import { Keyword } from "./models/Keyword";
import { generalRouter } from "./routers/generalRouter";
import { Person } from "./models/Person";
import { MovieBrief } from "./models/Movie";
import { SummaryController } from "./controllers/SummaryController";
import { MovieDetailsService } from "./services/MovieDetailsService";
import { SearchService } from "./services/SearchService";

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

const router = express.Router();
const genresRouter = generalRouter({
  driver,
  model: Genre,
  keyProperty: "name",
  objectName: "Genre",
});
const productionCompaniesRouter = generalRouter({
  driver,
  model: ProductionCompany,
  keyProperty: "name",
  objectName: "ProductionCompany",
});
const productionCountriesRouter = generalRouter({
  driver,
  model: ProductionCountry,
  keyProperty: "iso_3166_1",
  objectName: "ProductionCountry",
});
const languagesRouter = generalRouter({
  driver,
  model: Language,
  keyProperty: "iso_639_1",
  objectName: "Language",
});
const keywordsRouter = generalRouter({
  driver,
  model: Keyword,
  keyProperty: "name",
  objectName: "Keyword",
});
const peopleRouter = generalRouter({
  driver,
  model: Person,
  keyProperty: "id",
  objectName: "Person",
});
const moviesRouter = generalRouter({
  driver,
  model: MovieBrief,
  keyProperty: "id",
  objectName: "Movie",
  forceKeyAsString: true,
});

app.use("/", router);
app.use("/genres", genresRouter);
app.use("/productionCompanies", productionCompaniesRouter);
app.use("/productionCountries", productionCountriesRouter);
app.use("/languages", languagesRouter);
app.use("/keywords", keywordsRouter);
app.use("/people", peopleRouter);
app.use("/movies", moviesRouter);

router.get("/summary", async (req, res) => {
  const controller = new SummaryController(driver);
  const data = await controller.getSummary();
  res.send(data);
});
router.get("/movies/:id", async (req, res) => {
  const service = new MovieDetailsService(driver, req.params.id);
  const data = await service.getOne();
  res.send({ data });
});
router.get("/search/:entity/:key", async (req, res) => {
  const entities = [
    "movies",
    "genres",
    "keywords",
    "people",
    "languages",
    "productioncompanies",
    "productioncountries",
  ];
  const { entity, key } = req.params;
  if (!entities.includes(entity.toLowerCase()))
    res.status(400).send(`Entity ${entity} does not exist`);
  const entityUpper = entity
    .charAt(0)
    .toUpperCase()
    .concat(entity.slice(1).toLowerCase());
  const service = new SearchService(driver, entityUpper, key);
  const data = await service.Search();
  res.send({ data });
});
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
