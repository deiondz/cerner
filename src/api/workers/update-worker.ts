// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Input validation schema
const updateWorkerSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  workerName: z.string().min(1, "Worker name is required").max(255),
  contactNumber: z.string().min(1, "Contact number is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.boolean().optional(),
});

// Response schema
const updateWorkerResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      workerId: z.string().uuid(),
      workerName: z.string(),
      wardId: z.string().uuid().nullable(),
    })
    .optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type UpdateWorkerResponse = z.infer<typeof updateWorkerResponseSchema>;

// Raw response type from API
interface RawWorkerResponse {
  success: boolean;
  data?: {
    workerId: string;
    workerName: string;
    wardName: string | null;
    contactNumber: string;
  };
  error?: string;
  details?: unknown[];
}

/**
 * Add a new ward to the system
 * @param workerData - The worker data to update
 * @returns Promise<UpdateWorkerResponse> - The response from the API
 * @throws Error if the API request fails
 */
export async function updateWorker(
  workerData: z.infer<typeof updateWorkerSchema>,
): Promise<UpdateWorkerResponse> {
  try {
    // Validate input data
    const validatedData = updateWorkerSchema.parse(workerData);

    // Make API request
    const response = await fetch(
      `${API_BASE_URL}/workers/${validatedData.workerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      },
    );

    // Parse response
    const data = (await response.json()) as RawWorkerResponse;

    // Validate response
    const validatedResponse = updateWorkerResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to update worker");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
