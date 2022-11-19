import express from "express";
import type { Session } from "neo4j-driver";
import { GeneralController } from "../controllers/GeneralController";
import { getPaginationParams } from "../utils/paginate";
import { queryParamHandle } from "../utils/queryParams";
import { notFound, PaginationResponse } from "../utils/responses";

interface GeneralRouterProps {
  session: Session;
  model: any;
  keyProperty: string;
  forceKeyAsString?: boolean;
  objectName: string;
}

export const generalRouter = ({
  session,
  model,
  keyProperty,
  forceKeyAsString,
  objectName,
}: GeneralRouterProps) => {
  const router = express.Router();
  const controller = new GeneralController(
    session,
    objectName,
    model,
    keyProperty
  );

  router.get("/", async (req, res) => {
    let pageSize = undefined;
    let pageIndex = undefined;
    try {
      ({ pageIndex, pageSize } = getPaginationParams(req.query));
    } catch (err) {
      return res.status(400).send(err);
    }
    const data = await controller.getAll(pageSize, pageIndex);
    const response = new PaginationResponse(data, pageIndex, pageSize);
    res.send(response);
  });

  router.get(`/:${keyProperty}`, async (req, res) => {
    const name = queryParamHandle(req.params[keyProperty], forceKeyAsString);
    const datum = await controller.getOneByKey(name);
    if (!datum) res.status(400).send(notFound(objectName, name));
    else res.send(datum);
  });

  router.get(`/:${keyProperty}/movies`, async (req, res) => {
    let pageSize = undefined;
    let pageIndex = undefined;
    try {
      ({ pageIndex, pageSize } = getPaginationParams(req.query));
    } catch (err) {
      return res.status(400).send(err);
    }
    const name = queryParamHandle(req.params[keyProperty], forceKeyAsString);
    const datum = await controller.getOneByKey(name);
    if (!datum) return res.status(400).send(notFound(objectName, name));
    const movies = await controller.getRelatedMovies(
      name,
      pageSize,
      pageIndex
    );
    const response = new PaginationResponse(movies, pageIndex, pageSize);
    res.send(response);
  });

  return router;
};
