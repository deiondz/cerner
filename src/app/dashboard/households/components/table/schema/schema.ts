import { z } from "zod";

export const householdSchema = z.object({
  houseId: z.string().uuid(),
  ownerNumber: z.string(),
  address: z.string(),
  wardId: z.string().uuid().nullable(),
  wardName: z.string().nullable(),
  status: z.string(),
  trackerId: z.number().nullable(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
});

export type Household = z.infer<typeof householdSchema>;

export const householdsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(householdSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});
