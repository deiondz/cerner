import { type NextRequest, NextResponse } from "next/server";
import { db } from "src/server/db/index";
import { wards } from "src/server/db/schema";
import { eq } from "drizzle-orm";

// Types for request bodies
interface UpdateWardPayload {
  name?: string;
  supervisor_id?: string;
}

export const GET = async (
  _req: NextRequest,
  { params }: { params: { ward_code: string } },
) => {
  try {
    const { ward_code } = params;
    if (!ward_code) {
      return NextResponse.json(
        { error: "ward_code is required" },
        { status: 400 },
      );
    }
    const ward = await db
      .select()
      .from(wards)
      .where(eq(wards.wardCode, ward_code))
      .limit(1);
    if (!ward.length) {
      return NextResponse.json({ error: "Ward not found" }, { status: 404 });
    }
    return NextResponse.json(ward[0], { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch ward", details: error.message },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { ward_code: string } },
) => {
  try {
    const { ward_code } = params;
    if (!ward_code) {
      return NextResponse.json(
        { error: "ward_code is required" },
        { status: 400 },
      );
    }
    const body = (await req.json()) as UpdateWardPayload;
    if (!body.name && !body.supervisor_id) {
      return NextResponse.json(
        { error: "At least one of name or supervisor_id must be provided" },
        { status: 400 },
      );
    }
    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.supervisor_id) updateData.supervisorId = body.supervisor_id;
    const result = await db
      .update(wards)
      .set(updateData)
      .where(eq(wards.wardCode, ward_code))
      .returning();
    if (!result.length) {
      return NextResponse.json(
        { error: "Ward not found or not updated" },
        { status: 404 },
      );
    }
    return NextResponse.json(result[0], { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return NextResponse.json(
      { error: "Failed to update ward", details: error.message },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { ward_code: string } },
) => {
  try {
    const { ward_code } = params;
    if (!ward_code) {
      return NextResponse.json(
        { error: "ward_code is required" },
        { status: 400 },
      );
    }
    const result = await db
      .delete(wards)
      .where(eq(wards.wardCode, ward_code))
      .returning();
    if (!result.length) {
      return NextResponse.json(
        { error: "Ward not found or not deleted" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Ward deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return NextResponse.json(
      { error: "Failed to delete ward", details: error.message },
      { status: 500 },
    );
  }
};
