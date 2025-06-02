import { Hono } from "hono";

// ** import router
import { ward_routes } from "./wards"; // ** import user_routes

export const router = new Hono();

router.route("/wards", ward_routes);
