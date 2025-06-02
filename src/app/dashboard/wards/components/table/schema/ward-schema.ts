import { z } from "zod";

export const wardSchema = z.object({
  wardId: z.string(),
  wardName: z.string(),
  supervisorId: z.string().nullable(),
  supervisorName: z.string().nullable(),
  workerCount: z.number(),
  householdCount: z.number(),
  createdAt: z.string(),
});

export type Ward = z.infer<typeof wardSchema>;

export const wardsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(wardSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});
