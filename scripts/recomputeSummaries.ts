/**
 * Optional local script to recompute summaries for a user.
 * Run with: tsx scripts/recomputeSummaries.ts <userId>
 */
import "dotenv/config";
import { recomputeYearSummary } from "@/lib/db/queries";
import { currentTaxYear } from "@/lib/dates";

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: tsx scripts/recomputeSummaries.ts <userId>");
  process.exit(1);
}

(async () => {
  const year = currentTaxYear();
  const res = await recomputeYearSummary(userId, year);
  console.log("Updated summary:", res);
})();
