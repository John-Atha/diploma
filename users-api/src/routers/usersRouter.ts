import express from "express";
import type { Driver } from "neo4j-driver";
import { User } from "../models/User";
import { UsersService } from "../services/UsersService";
import {
  getOrderingParams,
  getPaginationParams,
} from "../utils/preProcessQuery";
import { notFound, PaginationResponse } from "../utils/responses";
import jwt_decode from "jwt-decode";
import axios from "axios";

interface UsersRouterProps {
  driver: Driver;
}

export const UsersRouter = ({ driver }: UsersRouterProps) => {
  const router = express.Router();
  const usersService = new UsersService(driver);

  router.get("/", async (req, res) => {
    let pageSize = undefined;
    let pageIndex = undefined;
    try {
      ({ pageIndex, pageSize } = getPaginationParams(req.query));
    } catch (err) {
      return res.status(400).send(err);
    }
    let sortBy = undefined;
    let order = undefined;
    try {
      ({ sortBy, order } = getOrderingParams(req.query));
    } catch (err) {
      return res.status(400).send(err);
    }
    const data = await usersService.getAll(pageSize, pageIndex, sortBy, order);
    const response = new PaginationResponse(data, pageIndex, pageSize);
    res.send(response);
  });

  router.get("/logged", async (req, res) => {
    const { headers } = req;
    const bearer = headers["authorization"];
    try {
      const user = await usersService.logged(bearer as string);
      res.send(user);
    } catch (err) {
      res.status(401).send(err);
    }
  });

  router.get("/:username", async (req, res) => {
    const { username } = req.params;
    const user = await usersService.getByUsername(username);
    if (!user) res.send(notFound("User", username));
    else res.send(user);
  });

  router.put("/:id", async (req, res) => {
    const { headers } = req;
    const bearer = headers["authorization"];
    try {
      await usersService.logged(bearer as string);
      const { id } = jwt_decode(bearer as string) as any;
      const { id: params_id } = req.params;
      if (id != params_id) res.status(400).send("Bad request");
      const user = await usersService.update(req.body, id);
      res.send(user);
    } catch (err) {
      res.status(401).send(err);
    }
  });

  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await usersService.createUser(username, password);
      res.send(user);
      // send an async get request to the model-api on http://127.0.0.1:5000/refresh
      // to refresh the in-memory dataset to include the new user
      // and to update the model's weight matrix with a new column for the new user
      // TODO: add the url of the model-api to the .env file
      try {
        await axios.post("http://127.0.0.1:5000/refresh");
      }
      catch (err) {
        console.log(err);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const response = await usersService.login(username, password);
      res.send(response);
    } catch (err) {
      res.status(401).send(err);
    }
  });

  return router;
};
