// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Input validation schema
const updateWardSchema = z.object({
  wardId: z.string().uuid("Invalid ward ID"),
  wardName: z.string().min(1, "Ward name is required").max(255),
  supervisorId: z.string().uuid("Invalid supervisor ID").optional(),
});

// Response schema
const updateWardResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      wardId: z.string().uuid(),
      wardName: z.string(),
      supervisorId: z.string().uuid().nullable(),
    })
    .optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type UpdateWardResponse = z.infer<typeof updateWardResponseSchema>;

// Raw response type from API
interface RawWardResponse {
  success: boolean;
  data?: {
    wardId: string;
    wardName: string;
    supervisorId: string | null;
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
export async function updateWard(
  wardData: z.infer<typeof updateWardSchema>,
): Promise<UpdateWardResponse> {
  try {
    // Validate input data
    const validatedData = updateWardSchema.parse(wardData);

    // Make API request
    const response = await fetch(`${API_BASE_URL}/wards/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // Parse response
    const data = (await response.json()) as RawWardResponse;

    // Validate response
    const validatedResponse = updateWardResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to update ward");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
