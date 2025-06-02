// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Input validation schema
const addWardSchema = z.object({
  wardName: z.string().min(1, "Ward name is required").max(255),
  supervisorId: z.string().uuid("Invalid supervisor ID").optional(),
});

// Response schema
const addWardResponseSchema = z.object({
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

export type AddWardResponse = z.infer<typeof addWardResponseSchema>;

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
export async function addWard(
  wardData: z.infer<typeof addWardSchema>,
): Promise<AddWardResponse> {
  try {
    // Validate input data
    const validatedData = addWardSchema.parse(wardData);

    // Make API request
    const response = await fetch(`${API_BASE_URL}/wards/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // Parse response
    const data = (await response.json()) as RawWardResponse;

    // Validate response
    const validatedResponse = addWardResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to add ward");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
