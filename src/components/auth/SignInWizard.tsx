// components/auth/SignInWizard.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { oauth } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";
import {
  checkHasLocalPassword,
  finalizeLocalPassword,
} from "@/app/(auth)/actions.localPassword";
import Google from "../../../public/google.svg";
import Apple from "../../../public/apple.svg";
import Microsoft from "../../../public/microsoft.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

type Step = "email" | "password" | "otp";
type Mode = "login" | "create";

const supabase = createClient();

// sessionStorage helpers to survive remounts
const PW_KEY = "mkt-auth-pw";
function loadPassword() {
  try {
    return sessionStorage.getItem(PW_KEY) ?? "";
  } catch {
    return "";
  }
}
function savePassword(pw: string) {
  try {
    if (pw) sessionStorage.setItem(PW_KEY, pw);
  } catch {}
}
function clearPassword() {
  try {
    sessionStorage.removeItem(PW_KEY);
  } catch {}
}

export default function SignInWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [mode, setMode] = useState<Mode>("create");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  // hydrate persisted password on mount
  useEffect(() => {
    setPassword((p) => p || loadPassword());
  }, []);

  useEffect(() => {
    if (password) savePassword(password);
  }, [password]);

  // keep URL nice (optional – no server redirects)
  const reflectUrl = (s: Step) => {
    const q = new URLSearchParams({ step: s, email });
    // don't navigate away; replace shallowly so refresh preserves state
    window.history.replaceState(null, "", `/sign-in?${q.toString()}`);
  };

  const providers = useMemo(
    () => [
      { id: "google" as const, name: "Google", Icon: Google },
      { id: "azure" as const, name: "Microsoft", Icon: Microsoft },
      { id: "apple" as const, name: "Apple", Icon: Apple },
    ],
    []
  );

  // --- Handlers ---

  async function handleEmailContinue(e: React.FormEvent) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;

    startTransition(async () => {
      try {
        const exists = await checkHasLocalPassword(normalized);
        setMode(exists ? "login" : "create");
        setStep("password");
        reflectUrl("password");
      } catch (err: any) {
        toast.error("Couldn’t check account", {
          description: err?.message ?? "Try again.",
        });
      }
    });
  }

  async function handlePasswordContinue(e: React.FormEvent) {
    e.preventDefault();
    const pw = password || loadPassword();
    if (pw.length < 8) {
      toast.error("Password too short", {
        description: "Use at least 8 characters.",
      });
      return;
    }

    if (mode === "login") {
      // Returning user → sign in directly with Supabase
      startTransition(async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: pw,
        });
        if (error) {
          toast.error("Login failed", { description: error.message });
          return;
        }
        clearPassword();
        router.replace("/"); // ✅ only redirect after success
      });
    } else {
      // New user → send OTP, then go to OTP step
      startTransition(async () => {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        if (error) {
          toast.error("Could not send code", { description: error.message });
          return;
        }
        setStep("otp");
        reflectUrl("otp");
        toast("Code sent", { description: `Sent to ${email}` });
      });
    }
  }

  async function handleVerify(e?: React.FormEvent) {
    e?.preventDefault();
    const pw = password || loadPassword();
    if (pw.length < 8) {
      toast.error("Password missing", {
        description: "Please go back and enter a valid password.",
      });
      return;
    }
    if (code.length !== 6) return;

    startTransition(async () => {
      // 1) Verify OTP → creates a session
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (error) {
        toast.error("Invalid code", { description: error.message });
        return;
      }

      // 2) Set Supabase password + store peppered hash in DB (server action)
      try {
        await finalizeLocalPassword(pw);
      } catch (err: any) {
        toast.error("Couldn’t finalize password", {
          description: err?.message ?? "Try again.",
        });
        return;
      } finally {
        clearPassword();
      }

      // 3) Redirect after success
      router.replace("/");
    });
  }

  // --- Steps ---

  const EmailStep = (
    <form onSubmit={handleEmailContinue} className="space-y-4">
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
        {isPending ? "Checking…" : "Continue"}
      </Button>
    </form>
  );

  const PasswordStep = (
    <form onSubmit={handlePasswordContinue} className="space-y-4">
      <Input
        type="password"
        name="password"
        placeholder={
          mode === "login" ? "Enter your password" : "Create a password"
        }
        required
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
      />
      <div className="flex gap-2 ">
        <Button
          type="button"
          variant="outline"
          className="w-1/3 cursor-pointer"
          onClick={() => {
            setStep("email");
            reflectUrl("email");
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-2/3 cursor-pointer"
          disabled={isPending || password.length < 8}
        >
          {isPending
            ? mode === "login"
              ? "Signing in…"
              : "Sending code…"
            : mode === "login"
            ? "Sign in"
            : "Continue"}
        </Button>
      </div>
      {mode === "create" && (
        <p className="text-xs text-muted-foreground">
          We’ll send a 6-digit code to{" "}
          <span className="font-medium">{email}</span>.
        </p>
      )}
    </form>
  );

  const OtpStep = (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <InputOTP
          autoFocus
          value={code}
          onChange={setCode}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          aria-label="6-digit verification code"
          onComplete={() => void handleVerify()}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium">{email}</span>.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-1/3"
          onClick={() => {
            setStep("password");
            reflectUrl("password");
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-2/3"
          disabled={code.length !== 6 || isPending}
        >
          {isPending ? "Verifying…" : "Verify"}
        </Button>
      </div>

      <Button
        type="button"
        variant="link"
        className="p-0 h-auto"
        onClick={async () => {
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error)
            toast.error("Could not resend code", {
              description: error.message,
            });
          else toast("Code resent", { description: `Sent to ${email}` });
        }}
      >
        Resend code
      </Button>
    </form>
  );

  return (
    <aside className="mx-auto w-full max-w-sm p-6 sm:p-10 mt-10">
      {/* Brand */}
      <div className="mb-12 flex w-full items-center justify-center gap-3">
        <img
          src="/logo-150x150.png"
          alt="Market Tax Pro"
          width={50}
          height={50}
        />
        <div className="text-4xl font-semibold">Market Tax Pro</div>
      </div>

      <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Sign up or Login with
      </h2>

      {/* Providers */}
      <div className="grid gap-5 mb-6">
        {providers.map(({ id, name, Icon }) => (
          <Button
            key={id}
            type="button"
            variant="outline"
            className="justify-start h-12 cursor-pointer"
            onClick={() => startTransition(() => oauth(id))}
            disabled={isPending}
          >
            <Icon className="mr-2 h-4 w-4" />
            {name}
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Steps */}
      {step === "email" && (
        <>
          <h1 className="mb-4 text-sm font-medium text-muted-foreground">
            Email
          </h1>
          {EmailStep}
        </>
      )}

      {step === "password" && (
        <>
          <h1 className="mb-1 text-sm font-medium text-muted-foreground">
            {mode === "login" ? "Password" : "Create a password"}
          </h1>
          <p className="mb-3 text-xs text-muted-foreground">
            {mode === "login"
              ? "Enter your password to sign in."
              : "We’ll verify your email next, then set your password."}
          </p>
          {PasswordStep}
        </>
      )}

      {step === "otp" && (
        <>
          <h1 className="mb-4 text-sm font-medium text-muted-foreground">
            Verification code
          </h1>
          {OtpStep}
        </>
      )}
    </aside>
  );
}
