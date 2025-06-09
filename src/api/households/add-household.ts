// ** Import 3rd Party Libs
import { z } from "zod";

const API_BASE_URL = "/api";

// Input validation schema
const addHouseholdSchema = z.object({
  ownerNumber: z.string().min(1, "Owner number is required").max(255),
  address: z.string().min(1, "Address is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.string().min(1, "Status is required").max(255),
  trackerId: z.number().optional(),
});

// Response schema
const addHouseholdResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      houseId: z.string().uuid(),
      ownerNumber: z.string(),
      address: z.string(),
      wardId: z.string().uuid().nullable(),
      status: z.string(),
      trackerId: z.number().nullable(),
      dateCreated: z.string(),
      dateUpdated: z.string(),
    })
    .optional(),
  error: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type AddHouseholdResponse = z.infer<typeof addHouseholdResponseSchema>;

// Raw response type from API
interface RawHouseholdResponse {
  success: boolean;
  data?: {
    houseId: string;
    ownerNumber: string;
    address: string;
    wardId: string | null;
    status: string;
    trackerId: number | null;
    dateCreated: string;
    dateUpdated: string;
  };
  error?: string;
  details?: unknown[];
}

/**
 * Add a new household to the system
 * @param householdData - The household data to add
 * @returns Promise<AddHouseholdResponse> - The response from the API
 * @throws Error if the API request fails
 */
export async function addHousehold(
  householdData: z.infer<typeof addHouseholdSchema>,
): Promise<AddHouseholdResponse> {
  try {
    // Validate input data
    const validatedData = addHouseholdSchema.parse(householdData);

    // Make API request
    const response = await fetch(`${API_BASE_URL}/households/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // Parse response
    const data = (await response.json()) as RawHouseholdResponse;

    // Validate response
    const validatedResponse = addHouseholdResponseSchema.parse(data);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(validatedResponse.error ?? "Failed to add household");
    }

    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from server");
    }
    throw error;
  }
}
