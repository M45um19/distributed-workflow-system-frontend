import { Suspense } from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-zinc-400 text-xs">Loading form...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
