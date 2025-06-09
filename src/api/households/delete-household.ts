// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Response schema
const deleteHouseholdResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type DeleteHouseholdResponse = z.infer<
  typeof deleteHouseholdResponseSchema
>;

/**
 * Delete a household by ID
 * @param houseId - The ID of the household to delete
 * @returns Promise<DeleteHouseholdResponse> - The response from the API
 * @throws Error if the API request fails
 */
export async function deleteHousehold(
  houseId: string,
): Promise<DeleteHouseholdResponse> {
  try {
    // Make API request
    const response = await fetch(`${API_BASE_URL}/households/${houseId}`, {
      method: "DELETE",
    });

    // Parse response
    const data = (await response.json()) as unknown;

    // Validate response
    const validatedResponse = deleteHouseholdResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to delete household");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
