import { Hono } from "hono";

// ** import router

import { worker_routes } from "./workers";
import { ward_routes } from "./wards";
export const router = new Hono();

router.route("/workers", worker_routes);
router.route("/wards", ward_routes);
