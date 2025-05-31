import { type InferModel } from "drizzle-orm";
import { wards } from "src/server/db/schema";
import { db } from "src/server/db/index";

type WardInsert = InferModel<typeof wards, "insert">;
type Ward = InferModel<typeof wards, "select">;

interface CreateWardPayload {
  name: string;
  supervisor_id?: string;
}

export async function createWard(data: CreateWardPayload): Promise<Ward> {
  if (!data.name) {
    throw new Error("name is required");
  }

  const insertData: WardInsert = {
    name: data.name,
  };

  if (data.supervisor_id && data.supervisor_id.trim() !== "") {
    insertData.supervisorId = data.supervisor_id;
  }

  try {
    const result = await db.insert(wards).values(insertData).returning();
    if (!result[0]) {
      throw new Error("Failed to create ward - no result returned");
    }
    return result[0];
  } catch (err) {
    console.error("Error creating ward:", err);
    throw new Error("Failed to create ward");
  }
}

export async function getWards(): Promise<Ward[]> {
  try {
    return await db.select().from(wards);
  } catch (err) {
    console.error("Error fetching wards:", err);
    throw new Error("Failed to fetch wards");
  }
}
