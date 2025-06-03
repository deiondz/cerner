import { z } from "zod";

export const workerSchema = z.object({
  workerId: z.string(),
  workerName: z.string(),
  contactNumber: z.string(),
  status: z.boolean(),
  dateCreated: z.string(),
  wardName: z.string().nullable(),
});

export type Worker = z.infer<typeof workerSchema>;

export const workersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(workerSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});
