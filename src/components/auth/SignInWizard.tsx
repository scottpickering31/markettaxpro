"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { beginPasswordFlow, sendEmailOtp, oauth } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";
import { setLocalPassword } from "@/app/(auth)/actions.setPassword";
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
const supabase = createClient();

// sessionStorage helpers for password persistence across remounts
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

export default function SignInWizard({
  initialStep,
  initialEmail,
}: {
  initialStep: Step;
  initialEmail: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  // hydrate error toast (once per mount)
  useEffect(() => {
    const err = sp.get("error");
    if (err)
      toast.error("Sign-in error", { description: err, id: "signin-error" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hydrate password from sessionStorage on mount/remount
  useEffect(() => {
    setPassword((prev) => prev || loadPassword());
  }, []);

  // keep password persisted as user types
  useEffect(() => {
    if (password) savePassword(password);
  }, [password]);

  // keep step & email in URL so refresh preserves context
  const go = (nextStep: Step) => {
    const q = new URLSearchParams({ step: nextStep, email });
    router.replace(`/sign-in?${q.toString()}`);
    setStep(nextStep);
  };

  // Providers list
  const providers = useMemo(
    () => [
      { id: "google" as const, name: "Google", Icon: Google },
      { id: "azure" as const, name: "Microsoft", Icon: Microsoft },
      { id: "apple" as const, name: "Apple", Icon: Apple },
    ],
    []
  );

  const handleVerify = async () => {
    // ensure code + password present (password might have been lost without storage)
    const pw = password || loadPassword();
    if (pw.length < 8) {
      toast.error("Password missing", {
        description: "Please go back and enter a password (min 8 chars).",
      });
      return;
    }
    if (code.length !== 6) return;

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      toast.error("Invalid code", { description: error.message });
      return;
    }

    // ✅ Session set. Save password server-side (action will redirect on success)
    const fd = new FormData();
    fd.set("password", pw);

    startTransition(async () => {
      try {
        await setLocalPassword(fd); // server action redirects to "/"
      } finally {
        clearPassword(); // clean up secret
      }
    });
  };

  // Step UIs
  const EmailStep = (
    <form
      action={(fd) => startTransition(() => beginPasswordFlow(fd))}
      className="space-y-4"
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
        {isPending ? "Continue…" : "Continue"}
      </Button>
    </form>
  );

  const PasswordStep = (
    <form
      action={(fd) => {
        // ensure the action receives email too
        fd.set("email", email);
        // make sure we persist before navigation/remount
        savePassword(password);
        startTransition(() => sendEmailOtp(fd));
      }}
      className="space-y-4"
    >
      <Input
        type="password"
        name="password"
        placeholder="Enter password"
        required
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-1/3"
          onClick={() => go("email")}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-2/3"
          disabled={isPending || password.length < 8}
        >
          {isPending ? "Sending code…" : "Continue"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We’ll send a 6-digit code to{" "}
        <span className="font-medium">{email}</span>.
      </p>
    </form>
  );

  const OtpStep = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleVerify();
      }}
      className="space-y-4"
    >
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
          onClick={() => go("password")}
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
          <h1 className="mb-4 text-sm font-medium text-muted-foreground">
            Password
          </h1>
        </>
      )}
      {step === "password" && PasswordStep}

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
