// app/pricing/BillingToggle.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BillingToggle({ billing }: { billing: "monthly" | "yearly" }) {
  const router = useRouter();
  const search = useSearchParams();

  const setBilling = (value: "monthly" | "yearly") => {
    const params = new URLSearchParams(search?.toString());
    if (value === "monthly") params.delete("billing");
    else params.set("billing", "yearly");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="inline-flex items-center gap-3 rounded-full border bg-white/70 px-2 py-2 shadow-sm backdrop-blur">
      <button
        onClick={() => setBilling("monthly")}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition ${
          billing === "monthly" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-pressed={billing === "monthly"}
      >
        Monthly
      </button>
      <button
        onClick={() => setBilling("yearly")}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition ${
          billing === "yearly" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-pressed={billing === "yearly"}
      >
        Yearly <span className="ms-1 text-xs opacity-80">(save ~30%)</span>
      </button>
    </div>
  );
}
