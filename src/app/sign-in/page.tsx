"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Sending magic link…");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/callback` },
    });
    setStatus(
      error
        ? `Error: ${error.message}`
        : "Check your email for the sign-in link."
    );
  }

  return (
    <div className="container max-w-md py-16 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form onSubmit={sendMagicLink} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="border rounded px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="px-3 py-2 rounded bg-gray-900 text-white">
          Send magic link
        </button>
      </form>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
