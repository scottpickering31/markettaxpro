"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DeleteMarketplaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Required for the confirmation phrase
  marketplaceName?: string;

  // Called when the user confirms deletion
  onConfirm: () => Promise<void> | void;

  // Optional: show async progress
  isLoading?: boolean;
};

export default function DeleteMarketplaceDialog({
  open,
  onOpenChange,
  marketplaceName,
  onConfirm,
  isLoading = false,
}: DeleteMarketplaceDialogProps) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const requiredPhrase =
    marketplaceName && marketplaceName.trim().length > 0
      ? `DELETE ${marketplaceName}`.toUpperCase()
      : null;

  const normalized = value.trim().toUpperCase();
  const isMatch = !!requiredPhrase && normalized === requiredPhrase;

  const handleConfirm = async () => {
    if (!isMatch || busy || isLoading) return;
    try {
      setBusy(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Delete marketplace</DialogTitle>
          <DialogDescription>
            This action is <span className="font-semibold">permanent</span> and cannot be undone.
            {marketplaceName ? (
              <>
                {" "}You are about to delete: <span className="font-semibold">{marketplaceName}</span>.
              </>
            ) : (
              <>
                {" "}A marketplace name is required to confirm deletion.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            To confirm, type{" "}
            <span className="font-medium">
              {requiredPhrase ? `"${requiredPhrase}"` : `"DELETE &lt;marketplace&gt;"`}
            </span>.
          </p>

          <div className="space-y-2">
            <Label htmlFor="confirmText">Confirmation</Label>
            <Input
              id="confirmText"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={requiredPhrase ?? "DELETE <marketplace>"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isMatch && !busy && !isLoading) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              aria-invalid={!isMatch && value.length > 0}
              disabled={!requiredPhrase}
            />
            {!isMatch && value.length > 0 ? (
              <p className="text-xs text-destructive">Text does not match.</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isMatch || busy || isLoading}
          >
            {busy || isLoading ? "Deleting…" : "Delete marketplace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
