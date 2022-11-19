import express from "express";
import type { Session } from "neo4j-driver";
import { GeneralController } from "../controllers/GeneralController";
import { getPaginationParams } from "../utils/paginate";
import { notFound, PaginationResponse } from "../utils/responses";

interface GeneralRouterProps {
  session: Session;
  model: any;
  keyProperty: string;
  objectName: string;
}

export const generalRouter = ({
  session,
  model,
  keyProperty,
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
    const name = req.params[keyProperty];
    const genre = await controller.getOneByKey(`"${name}"`);
    if (!genre) res.status(400).send(notFound(objectName, name));
    else res.send(genre);
  });

  return router;
};
