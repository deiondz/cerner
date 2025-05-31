import { type Config } from "drizzle-kit";

import { env } from "~/env";

console.log(env.DATABASE_URL);
export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
