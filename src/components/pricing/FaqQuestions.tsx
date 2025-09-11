"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade any time. Changes prorate automatically.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes. Pro starts with a free trial — no credit card required to begin.",
  },
  {
    q: "What happens if I hit the VAT threshold?",
    a: "You’ll get proactive alerts as you approach £90,000 in 12-month turnover, with guidance to stay compliant.",
  },
];

export default function FaqQuestions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="me-2 h-4 w-4" /> FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pricing FAQ</DialogTitle>
          <DialogDescription>
            Common questions about plans & billing.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border bg-white p-4">
              <div className="font-medium">{f.q}</div>
              <p className="mt-1 text-sm text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
