// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Response schema
const deleteWorkerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type DeleteWorkerResponse = z.infer<typeof deleteWorkerResponseSchema>;

/**
 * Delete a ward by ID
 * @param workerId - The ID of the worker to delete
 * @returns Promise<DeleteWorkerResponse> - The response from the API
 * @throws Error if the API request fails
 */
export async function deleteWorker(
  workerId: string,
): Promise<DeleteWorkerResponse> {
  try {
    // Make API request
    const response = await fetch(`${API_BASE_URL}/workers/${workerId}`, {
      method: "DELETE",
    });

    // Parse response
    const data = (await response.json()) as unknown;

    // Validate response
    const validatedResponse = deleteWorkerResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to delete worker");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
