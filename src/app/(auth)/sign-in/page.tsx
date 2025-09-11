import SignInForm from "@/components/auth/SignInForm";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  return (
    <div className="container max-w-md py-16 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <SignInForm />
    </div>
  );
}
