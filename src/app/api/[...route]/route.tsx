import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

export const dynamic = "force-dynamic";

// ** Routes
import { router } from "./routes";

const app = new Hono().basePath("/api");
app.use("*", cors());

// Mount API routes directly at the root
app.route("/", router);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    version: process.env.npm_package_version,
  });
});

// Root API endpoint with documentation
app.get("/doc", (c) => {
  return c.json({
    success: true,
    message: "API is running",
    endpoints: {
      wards: "/api/wards - Get wards with expense aggregations and filtering",
    },
    examples: {
      search_wards: "/api/wards?search=ward",
      date_filter: "/api/wards?from_date=2023-01-01&to_date=2023-01-31",
      pagination: "/api/wards?page=1&limit=10",
      sorting: "/api/wards?sort_by=total_expenses&sort_order=desc",
    },
  });
});

// Export Vercel handlers
export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
