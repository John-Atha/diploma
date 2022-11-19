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
const genresRouter = generalRouter({
  session,
  model: Genre,
  keyProperty: "name",
  objectName: "Genre",
});
const productionCompaniesRouter = generalRouter({
  session,
  model: ProductionCompany,
  keyProperty: "name",
  objectName: "ProductionCompany",
});
const productionCountriesRouter = generalRouter({
  session,
  model: ProductionCountry,
  keyProperty: "iso_3166_1",
  objectName: "ProductionCountry",
});
const languagesRouter = generalRouter({
  session,
  model: Language,
  keyProperty: "iso_639_1",
  objectName: "Language",
});
const keywordsRouter = generalRouter({
  session,
  model: Keyword,
  keyProperty: "name",
  objectName: "Keyword",
});
const peopleRouter = generalRouter({
  session,
  model: Person,
  keyProperty: "id",
  objectName: "Person",
});
const moviesRouter = generalRouter({
  session,
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

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
