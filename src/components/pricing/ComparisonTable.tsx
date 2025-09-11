"use client";

import { Columns2, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const comparisonRows = [
  ["Transactions", "100", "Unlimited", "Unlimited"],
  ["CSV Imports", "1", "Unlimited", "Unlimited"],
  ["Marketplace sync (Etsy/eBay)", "—", "Included", "Included"],
  ["Exports (CSV/PDF)", "—", "Included", "Included"],
  ["Receipts & expenses", "—", "Included", "Included"],
  ["Role-based access", "—", "—", "Included"],
  ["Support", "Email", "Priority", "Priority"],
];

export default function ComparisonTable() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <Columns2 className="me-2 h-4 w-4" /> Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Compare plans
          </DialogTitle>
          <DialogDescription>
            See what’s included in each tier.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border">
          <div className="grid grid-cols-1 text-sm sm:grid-cols-4">
            <div className="bg-gray-50 p-3 font-medium">Feature</div>
            <div className="p-3 font-medium">Free</div>
            <div className="p-3 font-medium">Pro</div>
            <div className="p-3 font-medium">Business</div>

            {comparisonRows.map((row, i) => (
              <div key={i} className="contents">
                <div className="border-t bg-gray-50 p-3">{row[0]}</div>
                <div className="border-t p-3">{row[1]}</div>
                <div className="border-t p-3">{row[2]}</div>
                <div className="border-t p-3">{row[3]}</div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 border-t p-3 text-xs text-gray-600">
            <Info className="mt-0.5 h-4 w-4" /> Prices in GBP. VAT handled at
            checkout where applicable.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
