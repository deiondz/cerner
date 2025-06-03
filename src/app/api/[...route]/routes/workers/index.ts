import { Hono } from "hono";

// ** import api
import getWorker from "./get-worker";
import addWorker from "./add-worker";
import deleteWorker from "./delete-worker";
import updateWorker from "./update-worker";

// ** create router
export const worker_routes = new Hono();

// Mount API routes - each route handler defines its own path structure
worker_routes.route("/", getWorker);
worker_routes.route("/add", addWorker);
worker_routes.route("/:id", deleteWorker);
worker_routes.route("/:id", updateWorker);
