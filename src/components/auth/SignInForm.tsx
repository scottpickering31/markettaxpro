"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/callback`;

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending magic link…");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    console.log("[SIGNIN] redirectTo:", redirectTo);

    setLoading(false);
    setStatus(
      error
        ? `Error: ${error.message}`
        : "Check your email for the sign-in link."
    );
  }

  return (
    <form onSubmit={sendMagicLink} className="space-y-3">
      <label className="block">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="border rounded px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="px-3 py-2 rounded bg-gray-900 text-white disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send magic link"}
      </button>

      {status && <p className="text-sm">{status}</p>}
    </form>
  );
}
