// components/notifications/MarketplaceDialog.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
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
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  marketplaces: {
    id: string;          // e.g. "ebay" | "etsy"
    name: string;        // not used now, but kept for compatibility
    description: string;
    label: string;       // pretty label ("eBay Store")
  }[];
};

const COMING_SOON = new Set(["shopify", "amazon-handmade"]);

export function MarketplaceDialog({
  open,
  onOpenChange,
  marketplaces,
}: Props) {
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // pick first non–coming-soon when opened
  useEffect(() => {
    if (!open) {
      setSelectedMarketplace(null);
      setRedirecting(false);
      return;
    }
    const firstEnabled = marketplaces.find((m) => !COMING_SOON.has(m.id));
    setSelectedMarketplace(firstEnabled?.id ?? null);
  }, [open, marketplaces]);

  const selected = useMemo(
    () => marketplaces.find((m) => m.id === selectedMarketplace) ?? null,
    [marketplaces, selectedMarketplace]
  );

  const handleConnect = useCallback(() => {
    if (!selectedMarketplace || COMING_SOON.has(selectedMarketplace)) return;

    // IMPORTANT: start OAuth by navigating to your API route.
    // Do NOT import route handlers into client components.
    // You can include which platform the user picked as a query param.
    setRedirecting(true);
    const url = `/api/${selectedMarketplace}/start`; // e.g. /api/ebay/start or /api/etsy/start
    // If you prefer a single route, use `/api/oauth/start?platform=${selectedMarketplace}`
    window.location.assign(url);
  }, [selectedMarketplace]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Connect a marketplace</DialogTitle>
          <DialogDescription>
            Choose the marketplace you want to sync. You can connect additional marketplaces at any time.
          </DialogDescription>
        </DialogHeader>

        {marketplaces.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            All supported marketplaces are already connected. Stay tuned for new integrations!
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <p className="text-sm font-medium">Marketplace</p>
              <div className="grid gap-2">
                {marketplaces.map((m) => {
                  const isComingSoon = COMING_SOON.has(m.id);
                  const isActive = m.id === selectedMarketplace && !isComingSoon;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      disabled={isComingSoon || redirecting}
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
        )}

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={redirecting}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleConnect}
            disabled={!selected || redirecting}
          >
            {redirecting ? "Redirecting…" : "Connect marketplace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
