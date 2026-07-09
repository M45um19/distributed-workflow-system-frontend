import { Suspense } from "react";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-zinc-400 text-xs">Loading form...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
