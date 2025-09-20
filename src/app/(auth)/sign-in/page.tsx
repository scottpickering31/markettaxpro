// app/(auth)/sign-in/page.tsx
import SignInWizard from "@/components/auth/SignInWizard";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[420px_1fr]">
      <div className="border-r bg-background">
        <SignInWizard />
      </div>
      <div className="relative hidden md:block">
        <div className="absolute inset-0" />
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
      </div>
    </div>
  );
}
