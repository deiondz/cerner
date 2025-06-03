import { Hono } from "hono";

// ** import router

import { worker_routes } from "./workers";

export const router = new Hono();

router.route("/workers", worker_routes);
