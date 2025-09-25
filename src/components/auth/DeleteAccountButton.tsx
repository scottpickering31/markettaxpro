"use client";

import { Button } from "../ui/button";
import { useTransition } from "react";
import { deleteAccount } from "@/app/(auth)/actions";
import { toast } from "sonner";

export default function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="destructive"
      disabled={isPending}
      className="cursor-pointer"
      onClick={() =>
        startTransition(async () => {
          try {
            if (
              !confirm("This will permanently delete your account. Continue?")
            )
              return;
            await deleteAccount();
          } catch (e: any) {
            toast.error("Couldn’t delete account", {
              description: e?.message ?? "Try again.",
            });
          }
        })
      }
    >
      {isPending ? "Deleting…" : "Delete account"}
    </Button>
  );
}
