// components/notifications/MarketplaceDialog.tsx
"use client";

import * as React from "react";
import { useEffect, useState, useCallback, FormEvent, useMemo } from "react";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addMarketplaceAction } from "@/app/(protected)/marketplaces/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  marketplaces: {
    id: string;
    name: string;
    description: string;
    label: string;
  }[];
  existingConnectionNames: string[];
  onConnect?: (args: {
    id: string;
    marketplaceId: string;
    marketplaceName: string;
  }) => void;
};
const COMING_SOON = new Set(["shopify", "amazon-handmade"]);
type DialogStep = "select" | "details";

export function MarketplaceDialog({
  open,
  onOpenChange,
  marketplaces,
  existingConnectionNames,
  onConnect,
}: Props) {
  const router = useRouter();

  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(
    null
  );
  const [step, setStep] = useState<DialogStep>("select");
  const [marketplaceName, setMarketplaceName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const normalizedExistingNames = useMemo(
    () =>
      new Set(
        existingConnectionNames
          .map((n) => n.trim().toLowerCase())
          .filter(Boolean)
      ),
    [existingConnectionNames]
  );

  const selectedMarketplaceDetails = useMemo(
    () => marketplaces.find((m) => m.id === selectedMarketplace) ?? null,
    [marketplaces, selectedMarketplace]
  );

  const trimmed = marketplaceName.trim();
  const isDuplicate =
    trimmed.length > 0 && normalizedExistingNames.has(trimmed.toLowerCase());
  const nameError =
    step === "details"
      ? trimmed.length === 0
        ? "Enter a marketplace name."
        : isDuplicate
        ? "A marketplace with this name already exists. Choose a different name."
        : null
      : null;
  const canSubmit =
    step === "details" && trimmed.length > 0 && !isDuplicate && !submitting;

  useEffect(() => {
    if (!open) {
      setStep("select");
      setSelectedMarketplace(null);
      setMarketplaceName("");
      setSubmitErr(null);
      return;
    }
    const firstEnabled = marketplaces.find((m) => !COMING_SOON.has(m.id));
    setSelectedMarketplace(firstEnabled?.id ?? null);
    setMarketplaceName(firstEnabled?.label ?? firstEnabled?.name ?? "");
  }, [open, marketplaces]);

  useEffect(() => {
    if (!open || step !== "select") return;
    if (!selectedMarketplace) {
      setMarketplaceName("");
      return;
    }
    const selected = marketplaces.find((m) => m.id === selectedMarketplace);
    setMarketplaceName(selected?.label ?? selected?.name ?? "");
  }, [open, step, selectedMarketplace, marketplaces]);

  const handleProceedToDetails = useCallback(() => {
    if (!selectedMarketplace || COMING_SOON.has(selectedMarketplace)) return;
    const fallback =
      selectedMarketplaceDetails?.label ??
      selectedMarketplaceDetails?.name ??
      "";
    setMarketplaceName((curr) => curr || fallback);
    setStep("details");
  }, [selectedMarketplace, selectedMarketplaceDetails]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        step !== "details" ||
        !selectedMarketplace ||
        COMING_SOON.has(selectedMarketplace)
      )
        return;

      const fallback =
        selectedMarketplaceDetails?.label ??
        selectedMarketplaceDetails?.name ??
        "";
      const finalName = (marketplaceName || fallback).trim();
      if (!finalName || normalizedExistingNames.has(finalName.toLowerCase()))
        return;

      setSubmitting(true);
      setSubmitErr(null);
      try {
        // 1) write to DB (server action)
        const res = await addMarketplaceAction({
          marketplaceName: finalName,
          platform: selectedMarketplace, // your marketplace id (etsy/ebay/etc)
        });

        // Optimistic UI in parent with real DB id
        onConnect?.({
          id: res.id,
          marketplaceId: selectedMarketplace,
          marketplaceName: finalName,
        });

        toast.success("Marketplace connected", {
          description: `${finalName} has been added to your account.`,
        });

        // 3) close & refresh
        onOpenChange(false);
        router.refresh();
      } catch (err: any) {
        setSubmitErr(err?.message ?? "Failed to add marketplace");
      } finally {
        setSubmitting(false);
      }
    },
    [
      step,
      selectedMarketplace,
      selectedMarketplaceDetails,
      marketplaceName,
      normalizedExistingNames,
      onOpenChange,
      router,
      onConnect,
    ]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Connect a marketplace</DialogTitle>
            <DialogDescription>
              Choose the marketplace you want to sync. You can connect
              additional marketplaces at any time.
            </DialogDescription>
          </DialogHeader>

          {marketplaces.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              All supported marketplaces are already connected. Stay tuned for
              new integrations!
            </div>
          ) : step === "select" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p className="text-sm font-medium">Marketplace</p>
                <div className="grid gap-2">
                  {marketplaces.map((m) => {
                    const isComingSoon = COMING_SOON.has(m.id);
                    const isActive =
                      m.id === selectedMarketplace && !isComingSoon;

                    return (
                      <button
                        key={m.id}
                        type="button"
                        disabled={isComingSoon}
                        onClick={() => {
                          if (!isComingSoon) setSelectedMarketplace(m.id);
                        }}
                        className={cn(
                          "flex w-full items-start justify-between gap-4 rounded-lg border p-4 text-left transition-colors",
                          isActive
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary",
                          isComingSoon &&
                            "cursor-not-allowed opacity-60 hover:border-border"
                        )}
                        aria-disabled={isComingSoon}
                      >
                        <span>
                          <span className="font-medium flex items-center gap-2">
                            {m.label}
                            {isComingSoon && (
                              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Coming soon
                              </span>
                            )}
                          </span>
                          <span className="block text-sm text-muted-foreground">
                            {m.description}
                          </span>
                        </span>

                        {/* Selection check only when selectable */}
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border",
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted text-transparent",
                            isComingSoon && "invisible"
                          )}
                          aria-hidden="true"
                        >
                          <Check className="h-4 w-4" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p className="text-sm font-medium">Marketplace details</p>
                <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                  <p className="font-medium">
                    {selectedMarketplaceDetails?.label ??
                      selectedMarketplaceDetails?.name}
                  </p>
                  <p className="text-muted-foreground">
                    Customize how this marketplace appears in your sidebar.
                  </p>
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="marketplace-name"
                  >
                    Marketplace name
                  </label>
                  <Input
                    id="marketplace-name"
                    value={marketplaceName}
                    onChange={(event) => setMarketplaceName(event.target.value)}
                    placeholder={
                      selectedMarketplaceDetails?.label ?? "My marketplace"
                    }
                    className={cn(
                      nameError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    aria-invalid={nameError ? true : undefined}
                    autoFocus
                  />
                  {nameError ? (
                    <p
                      id="marketplace-name-error"
                      className="text-xs text-destructive"
                    >
                      {nameError}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {step === "details" && submitErr ? (
            <p className="text-xs text-destructive">{submitErr}</p>
          ) : null}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            {step === "details" ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("select")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  Add Marketplace
                </Button>
              </>
            ) : (
              <Button
                type="button"
                disabled={
                  !selectedMarketplace || COMING_SOON.has(selectedMarketplace)
                }
                onClick={handleProceedToDetails}
              >
                Connect marketplace
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
