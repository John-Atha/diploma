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
import { RatingsService } from "../services/RatingsService";
import { getRequestUserByRequest } from "../utils/getRequestUser";

interface RatingsRouterProps {
  driver: Driver;
}

const isRatingValid = (ratingObject: any) => {
  const { userId, movieId, rating } = ratingObject;
  if (!userId || !movieId) return false;
  if (
    typeof userId !== "number" ||
    typeof movieId !== "number" ||
    typeof rating !== "number"
  )
    return false;
  if (rating < 0 || rating > 5) return false;
  return true;
};

export const RatingsRouter = ({ driver }: RatingsRouterProps) => {
  const router = express.Router();
  const ratingsService = new RatingsService(driver);

  router.get("/users/:username", async (req, res) => {
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
    const data = await ratingsService.getAllRatingsOfUser(
      req.params.username,
      pageSize,
      pageIndex,
      sortBy,
      order
    );
    const response = new PaginationResponse(data, pageIndex, pageSize);
    res.send(response);
  });

  router.put("/", async (req, res) => {
    const user = getRequestUserByRequest(req);
    const { userId, movieId, rating } = req.body;
    if (!isRatingValid(req.body)) return res.status(400).send();
    if ((user as any).id != userId) return res.status(401).send();
    try {
      const resp = await ratingsService.updateRating(
        req.body.userId,
        req.body.movieId,
        req.body.rating
      );
      res.send(resp);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

  router.post("/", async (req, res) => {
    const user = getRequestUserByRequest(req);
    const { userId, movieId, rating } = req.body;
    if (!isRatingValid(req.body)) return res.status(400).send();
    if ((user as any)?.id != userId) return res.status(401).send();
    try {
      const resp = await ratingsService.createRating(
        req.body.userId,
        req.body.movieId,
        req.body.rating
      );
      return res.send(resp);
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  });

  router.delete("/users/:userId/movies/:movieId", async (req, res) => {
    const user = getRequestUserByRequest(req);
    if ((user as any)?.id != req.params.userId) return res.status(401).send();
    try {
      const resp = await ratingsService.deleteRating(
        req.body.userId,
        req.body.movieId
      );
      res.send(resp);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  return router;
};
