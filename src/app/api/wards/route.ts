import { type NextRequest, NextResponse } from "next/server";
import { db } from "src/server/db/index";
import { wards } from "src/server/db/schema";

// Types for request bodies
interface CreateWardPayload {
  ward_code: string;
  name: string;
  supervisor_id?: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as CreateWardPayload;
    if (!body.ward_code || !body.name) {
      return NextResponse.json(
        { error: "ward_code and name are required" },
        { status: 400 },
      );
    }
    await db.insert(wards).values({
      wardCode: body.ward_code,
      name: body.name,
      supervisorId: body.supervisor_id ?? null,
    });
    return NextResponse.json({ message: "Ward created" }, { status: 201 });
  } catch (err) {
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
