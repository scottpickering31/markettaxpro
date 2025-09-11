// app/pricing/page.tsx (Server Component)
import { Check } from "lucide-react";
import BillingToggle from "@/components/pricing/BillingToggle";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import FAQ from "@/components/pricing/FaqQuestions";

type Billing = "monthly" | "yearly";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const billingParam = (searchParams?.billing as string) ?? "monthly";
  const billing: Billing = billingParam === "yearly" ? "yearly" : "monthly";

  const plans = [
    {
      name: "Free",
      badge: "Get started",
      prices: { monthly: 0, yearly: 0 },
      per: "/ forever",
      blurb: "For trying things out",
      features: [
        "Up to 100 transactions",
        "1 CSV import",
        "VAT tracker",
        "Email support",
      ],
      featured: false,
    },
    {
      name: "Pro",
      badge: "Most popular",
      prices: { monthly: 9, yearly: 84 },
      per: billing === "yearly" ? "/ year" : "/ month",
      blurb: "For active sellers",
      features: [
        "Unlimited transactions",
        "Etsy & eBay sync",
        "CSV + PDF exports",
        "Expenses & receipts",
        "Priority support",
      ],
      featured: true,
    },
    {
      name: "Business",
      badge: "For teams",
      prices: { monthly: 19, yearly: 180 },
      per: billing === "yearly" ? "/ year" : "/ month",
      blurb: "For multi-shop or accountant-led",
      features: [
        "Everything in Pro",
        "Up to 5 connected shops",
        "Role-based access",
        "Advanced analytics",
        "Dedicated support window",
      ],
      featured: false,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-12 text-center">
        <h1 className="text-4xl tracking-tight sm:text-5xl">
          Simple pricing that{" "}
          <span className="mt-4 block font-bold underline underline-offset-6 sm:text-6xl">
            Grows with your Shop
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Start free, then upgrade when you’re ready. No hidden fees.
        </p>

        {/* Controls row — all client components */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <FAQ />
          <BillingToggle billing={billing} />
          <ComparisonTable />
        </div>
      </section>

      {/* Plans — server-rendered, reacts to ?billing= */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => {
            const price =
              billing === "yearly" ? p.prices.yearly : p.prices.monthly;
            return (
              <div
                key={p.name}
                className={`relative rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow ${
                  p.featured ? "ring-2 ring-blue-600" : ""
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-4 rounded-full border bg-white px-2.5 py-1 text-xs font-medium shadow-sm">
                    {p.badge}
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      £{price}
                      <span className="ms-1 text-sm font-normal text-gray-600">
                        {p.per}
                      </span>
                    </div>
                    {p.name === "Pro" && billing === "yearly" && (
                      <div className="text-xs text-green-700">
                        £7/mo effective
                      </div>
                    )}
                    {p.name === "Business" && billing === "yearly" && (
                      <div className="text-xs text-green-700">
                        £15/mo effective
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{p.blurb}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
