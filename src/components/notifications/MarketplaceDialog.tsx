"use client";

import * as React from "react";
import { Check } from "lucide-react";

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

type MarketplaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marketplaces: {
    id: string;
    name: string;
    description: string;
  }[];
  onConnect: (marketplaceId: string) => void;
};

export function MarketplaceDialog({
  open,
  onOpenChange,
  marketplaces,
  onConnect,
}: MarketplaceDialogProps) {
  const [selectedMarketplace, setSelectedMarketplace] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (marketplaces.length === 0) {
      setSelectedMarketplace(null);
      return;
    }

    setSelectedMarketplace((current) => {
      if (current && marketplaces.some((marketplace) => marketplace.id === current)) {
        return current;
      }

      return marketplaces[0].id;
    });
  }, [open, marketplaces]);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedMarketplace) {
        return;
      }

      onConnect(selectedMarketplace);
      onOpenChange(false);
    },
    [onConnect, onOpenChange, selectedMarketplace]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
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
                  {marketplaces.map((marketplace) => {
                    const isActive = marketplace.id === selectedMarketplace;

                    return (
                      <button
                        key={marketplace.id}
                        type="button"
                        onClick={() => setSelectedMarketplace(marketplace.id)}
                        className={cn(
                          "flex w-full items-start justify-between gap-4 rounded-lg border p-4 text-left transition-colors",
                          isActive
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary"
                        )}
                      >
                        <span>
                          <span className="font-medium">{marketplace.name}</span>
                          <span className="block text-sm text-muted-foreground">
                            {marketplace.description}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border",
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted text-transparent"
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!selectedMarketplace}>
              Connect marketplace
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
