import { z } from "zod";

export const ManualExpenseSchema = z.object({
  date: z.string().min(1),        // YYYY-MM-DD
  category: z.enum(["packaging","postage","software","travel","other"]),
  amountGBP: z.coerce.number().positive(),
  note: z.string().optional()
});

export type ManualExpenseInput = z.infer<typeof ManualExpenseSchema>;

export function toPence(n: number) { return Math.round(n * 100); }
