"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function SignInClient({
  justSent,
  error,
  children,
}: {
  justSent?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (justSent) {
      toast("Magic link sent ✉️", {
        description: "Check your inbox for the sign-in link.",
      });
    } else if (error) {
      toast.error("Could not send link", { description: error });
    }
  }, [justSent, error]);

  return <>{children}</>;
}
