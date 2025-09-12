"use client";

import {
  Apple,
  Chrome as Google,
  PanelsTopLeft as Microsoft,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState, useTransition } from "react";
import { sendMagicLink, oauth } from "@/app/(auth)/actions";

type ProviderId = "google" | "apple" | "azure";

type ProviderSpec = {
  name: string;
  icon: LucideIcon;
};

const SignInProviders: Record<ProviderId, ProviderSpec> = {
  google: { name: "Google", icon: Google },
  apple: { name: "Apple", icon: Apple },
  azure: { name: "Microsoft", icon: Microsoft },
};

const PROVIDER_ORDER: ProviderId[] = ["google", "azure", "apple"];

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <aside className="mx-auto w-full max-w-sm p-6 sm:p-8">
      {/* Brand */}
      <div className="mb-6 flex w-full items-center justify-center gap-3">
        <Image
          src="/logo-150x150.png"
          alt="Market Tax Pro"
          width={50}
          height={50}
        />
        <div className="text-xl font-semibold">Market Tax Pro</div>
      </div>

      <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Sign in
      </h2>

      {/* Providers */}
      <div className="grid gap-3">
        {PROVIDER_ORDER.map((id) => {
          const { name, icon: Icon } = SignInProviders[id];
          return (
            <Button
              key={id}
              type="button"
              variant="outline"
              className="justify-start cursor-pointer"
              onClick={() => startTransition(() => oauth(id))}
              disabled={isPending}
            >
              <Icon className="mr-2 h-4 w-4" />
              Continue with {name}
            </Button>
          );
        })}
      </div>

      {/* OR divider */}
      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Email magic link */}
      <form
        action={(fd) => {
          setStatus(null);
          startTransition(() => sendMagicLink(fd));
        }}
        className="space-y-3"
      >
        <Input
          type="email"
          name="email"
          placeholder="name@host.com"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Sending…" : "Continue"}
        </Button>

        {status && <p className="text-xs text-muted-foreground">{status}</p>}
      </form>
    </aside>
  );
}
