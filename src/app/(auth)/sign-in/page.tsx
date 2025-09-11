// app/(auth)/sign-in/page.tsx  (Server Component)
import SignInForm from "@/components/auth/SignInForm";
export default function SignInPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[420px_1fr]">
      {/* Left: the sidebar */}
      <div className="border-r bg-background">
        <SignInForm />
      </div>

      {/* Right: hero/artwork area (replace with your own) */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0" />
        {/* placeholder gradient/image */}
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
      </div>
    </div>
  );
}
