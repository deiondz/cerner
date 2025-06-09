import { Hono } from "hono";

// ** import api
import getHousehold from "./get-household";
import addHousehold from "./add-household";
import deleteHousehold from "./delete-household";
import updateHousehold from "./update-household";

// ** create router
export const household_routes = new Hono();

// Mount API routes - each route handler defines its own path structure
household_routes.route("/", getHousehold);
household_routes.route("/add", addHousehold);
household_routes.route("/:id", deleteHousehold);
household_routes.route("/:id", updateHousehold);
