/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Hono } from "hono";

// ** import api
import getWard from "./get-wards";
import addWard from "./add-ward";
import deleteWard from "./delete-ward";

// ** create router
export const ward_routes = new Hono();

// Mount API routes - each route handler defines its own path structure
ward_routes.route("/", getWard);
ward_routes.route("/add", addWard);
ward_routes.route("/:id", deleteWard);
