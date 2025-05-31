import { type NextRequest, NextResponse } from "next/server";
import { db } from "src/server/db/index";
import { wards } from "src/server/db/schema";
import { type InferModel } from "drizzle-orm";

// Types for request bodies
interface CreateWardPayload {
  name: string;
  supervisor_id?: string;
}

type WardInsert = InferModel<typeof wards, "insert">;

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as CreateWardPayload;
    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const insertData: WardInsert = {
      name: body.name,
    };

    if (body.supervisor_id && body.supervisor_id.trim() !== "") {
      insertData.supervisorId = body.supervisor_id;
    }

    await db.insert(wards).values(insertData);
    return NextResponse.json({ message: "Ward created" }, { status: 201 });
  } catch (err) {
    console.error("Error creating ward:", err);
    const error = err instanceof Error ? err : new Error("Unknown error");
    return NextResponse.json(
      { error: "Failed to create ward", details: error.message },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    const allWards = await db.select().from(wards);
    return NextResponse.json(allWards, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch wards", details: error.message },
      { status: 500 },
    );
  }
};
