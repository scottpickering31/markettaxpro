// app/pricing/page.tsx (Server Component)
import { Check } from "lucide-react";
import BillingToggle from "@/components/pricing/BillingToggle";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import FAQ from "@/components/pricing/FaqQuestions";
import { Button } from "@/components/ui/button";

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
        "1 monthly CSV import",
        "VAT tracker",
        "Email support",
      ],
      featured: false,
      buttonTitle: "Use for free",
      buttonVariant: "ghost",
    },
    {
      name: "Pro",
      badge: "Most popular",
      prices: { monthly: 9, yearly: 84 },
      per: billing === "yearly" ? "/ year" : "/ month",
      blurb: "For active sellers - (Everything from Free, plus):",
      features: [
        "Unlimited transactions",
        "Etsy & eBay sync",
        "CSV + PDF exports",
        "Expenses & receipts",
        "Priority support",
      ],
      featured: true,
      buttonTitle: "Get started",
      buttonVariant: "default",
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
      <section className="mx-auto max-w-6xl px-20 py-10 items-center">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
                <div className="flex flex-row relative h-40">
                  <ul className="mt-4 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="absolute bottom-0 right-0"
                    variant={p.buttonVariant as "default" | "ghost"}
                  >
                    {p.buttonTitle}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
