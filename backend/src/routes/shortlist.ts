import type { ServerRoute } from "@hapi/hapi";
import {
  shortlistController,
  getAllCarsController,
} from "../controllers/shortlistController";

const shortlistRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/shortlist",
    handler: shortlistController,
  },
  {
    method: "GET",
    path: "/api/cars",
    handler: getAllCarsController,
  },
];

export default shortlistRoutes;