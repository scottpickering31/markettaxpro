"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";

type RenameMarketplaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // current value shown in the input
  marketplaceName: string;

  // called with the new name when user confirms
  onConfirm: (newName: string) => Promise<void> | void;

  // used to avoid duplicates (case-insensitive)
  existingNames?: string[];

  // optional loading flag while server action runs
  isLoading?: boolean;
};

export default function RenameMarketplaceDialog({
  open,
  onOpenChange,
  marketplaceName,
  onConfirm,
  existingNames = [],
  isLoading = false,
}: RenameMarketplaceDialogProps) {
  const [value, setValue] = useState(marketplaceName ?? "");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setValue(marketplaceName ?? "");
      // focus after a tick so the dialog has mounted
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open, marketplaceName]);

  const trimmed = value.trim();
  const original = (marketplaceName ?? "").trim();
  const lowerSet = React.useMemo(
    () => new Set(existingNames.map((n) => n.trim().toLowerCase()).filter(Boolean)),
    [existingNames]
  );

  const isSame = trimmed.toLowerCase() === original.toLowerCase();
  const isEmpty = trimmed.length === 0;
  const isDuplicate =
    trimmed.length > 0 &&
    trimmed.toLowerCase() !== original.toLowerCase() &&
    lowerSet.has(trimmed.toLowerCase());

  const nameError =
    isEmpty
      ? "Enter a marketplace name."
      : isDuplicate
      ? "A marketplace with this name already exists. Choose a different name."
      : null;

  const canSubmit = !isEmpty && !isDuplicate && !isSame && !busy && !isLoading;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    try {
      setBusy(true);
      await onConfirm(trimmed);
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Rename marketplace</DialogTitle>
          <DialogDescription>
            Update how this marketplace appears in your sidebar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rename-marketplace">Marketplace name</Label>
          <Input
            id="rename-marketplace"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="My marketplace"
            aria-invalid={!!nameError || undefined}
            className={cn(nameError && "border-destructive focus-visible:ring-destructive")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
          {nameError ? (
            <p className="text-xs text-destructive">{nameError}</p>
          ) : null}
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
            onClick={handleConfirm}
            disabled={!canSubmit}
          >
            {busy || isLoading ? "Saving…" : "Save name"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
