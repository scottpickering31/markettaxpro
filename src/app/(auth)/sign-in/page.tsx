// app/(auth)/sign-in/page.tsx
import SignInForm from "@/components/auth/SignInForm";
import SignInClient from "./sign-in-client";

type Search = { sent?: string; error?: string };

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<Search>;
}) {
  const sp = (await searchParams) ?? {};
  const justSent = sp.sent === "1";
  const error = sp.error;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[420px_1fr]">
      <div className="border-r bg-background">
        <SignInClient justSent={justSent} error={error}>
          <SignInForm />
        </SignInClient>
      </div>

      <div className="relative hidden md:block">
        <div className="absolute inset-0" />
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
      </div>
    </div>
  );
}
