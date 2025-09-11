"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Apple,
  Chrome as Google,
  PanelsTopLeft as Microsoft,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type Props = {
  title?: string;
  note?: string;
  redirectTo?: string;
};

// --- Provider map + order -----------------------------------
type ProviderId = "google" | "apple" | "azure";

type ProviderSpec = {
  name: string;
  icon: LucideIcon;
};

const SignInProviders: Record<ProviderId, ProviderSpec> = {
  google: { name: "Google", icon: Google },
  apple: { name: "Apple", icon: Apple },
  azure: { name: "Microsoft", icon: Microsoft }, // Supabase uses "azure" for Microsoft
};

// Change the order however you like:
const PROVIDER_ORDER: ProviderId[] = ["apple", "google", "azure"];
// ------------------------------------------------------------

export default function SignInForm({
  title = "Sign up or Login with",
  note = "Please verify you are a human and submit",
  redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
}: Props) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const oauth = async (provider: ProviderId) => {
    await supabase.auth.signInWithOAuth({
      provider, // "google" | "apple" | "azure"
      options: { redirectTo },
    });
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending magic link…");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    setStatus(
      error
        ? `Error: ${error.message}`
        : "Check your email for the sign-in link."
    );
  };

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
        {title}
      </h2>

      {/* Provider buttons via map */}
      <div className="grid gap-3">
        {PROVIDER_ORDER.map((id) => {
          const { name, icon: Icon } = SignInProviders[id];
          return (
            <Button
              key={id}
              variant="outline"
              className="justify-start cursor-pointer"
              onClick={() => oauth(id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {name}
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

      {/* Warning + CAPTCHA placeholder */}
      {/* <div className="mb-4 rounded-lg border bg-card p-3 text-sm">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600" />
          <div>
            <div className="font-medium">Warning</div>
            <div className="text-muted-foreground">{note}</div>
          </div>
        </div>
      </div> */}

      {/* Email + captcha placeholder */}
      <form onSubmit={sendMagicLink} className="space-y-3">
        <Input
          type="email"
          placeholder="name@host.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />

        {/* <div className="flex h-16 items-center justify-center rounded-md border bg-muted/40 text-xs text-muted-foreground">
            Verify you are human (CAPTCHA)
          </div> */}

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending…" : "Continue"}
        </Button>
        {status && <p className="text-xs text-muted-foreground">{status}</p>}
      </form>
    </aside>
  );
}
