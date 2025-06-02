// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Response schema
const deleteWardResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type DeleteWardResponse = z.infer<typeof deleteWardResponseSchema>;

/**
 * Delete a ward by ID
 * @param wardId - The ID of the ward to delete
 * @returns Promise<DeleteWardResponse> - The response from the API
 * @throws Error if the API request fails
 */
export async function deleteWard(wardId: string): Promise<DeleteWardResponse> {
  try {
    // Make API request
    const response = await fetch(`${API_BASE_URL}/wards/${wardId}`, {
      method: "DELETE",
    });

    // Parse response
    const data = (await response.json()) as unknown;

    // Validate response
    const validatedResponse = deleteWardResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to delete ward");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
