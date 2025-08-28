import { z } from "zod";

export const CogsSchema = z.object({
  method: z.enum(["per_item", "batch", "percent_of_sale"]),
  amountGBP: z.coerce.number().positive(),
  orderId: z.string().optional(),
  sku: z.string().optional(),
  notes: z.string().optional(),
});

export type CogsInput = z.infer<typeof CogsSchema>;
export function toPence(n: number) {
  return Math.round(n * 100);
}
