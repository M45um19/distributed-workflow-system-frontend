"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex">
      {/* Left Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-grow pl-64 min-h-screen flex flex-col">
        <main className="flex-grow p-8 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
