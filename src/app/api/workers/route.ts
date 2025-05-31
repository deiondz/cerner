import { NextResponse } from "next/server";
import { db } from "src/server/db/index";
import { workers } from "src/server/db/schema";

export const GET = async () => {
  try {
    const allWorkers = await db.select().from(workers);
    return NextResponse.json(allWorkers, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch workers", details: error.message },
      { status: 500 },
    );
  }
};
