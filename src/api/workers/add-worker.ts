// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Input validation schema
const addWorkerSchema = z.object({
  workerName: z.string().min(1, "Worker name is required").max(255),
  contactNumber: z.string().min(1, "Contact number is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.boolean().optional(),
});

// Response schema
const addWorkerResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      workerId: z.string().uuid(),
      workerName: z.string(),
      contactNumber: z.string(),
      wardId: z.string().uuid().nullable(),
      status: z.boolean().optional(),
    })
    .optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type AddWorkerResponse = z.infer<typeof addWorkerResponseSchema>;

// Raw response type from API
interface RawWorkerResponse {
  success: boolean;
  data?: {
    workerId: string;
    workerName: string;
    wardId: string | null;
  };
  error?: string;
  details?: unknown[];
}

/**
 * Add a new ward to the system
 * @param wardData - The ward data to add
 * @returns Promise<AddWardResponse> - The response from the API
 * @throws Error if the API request fails
 */
export async function addWorker(
  workerData: z.infer<typeof addWorkerSchema>,
): Promise<AddWorkerResponse> {
  try {
    // Validate input data
    const validatedData = addWorkerSchema.parse(workerData);

    // Make API request
    const response = await fetch(`${API_BASE_URL}/workers/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // Parse response
    const data = (await response.json()) as RawWorkerResponse;

    // Validate response
    const validatedResponse = addWorkerResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to add worker");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
