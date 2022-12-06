import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import BodyParser from "body-parser";
import neo4j from "neo4j-driver";
import { UsersRouter } from "./routers/usersRouter";
import { RatingsRouter } from "./routers/ratingsRouter";

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

const usersRouter = UsersRouter({
  driver,
});

const ratingsRouter = RatingsRouter({
  driver,
});

app.use("/users", usersRouter);
app.use("/ratings", ratingsRouter);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
