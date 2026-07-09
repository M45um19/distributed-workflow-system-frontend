"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAcceptInvite } from "@/features/workspace/hooks/use-workspace";
import { Loader2, MailCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import axios from "axios";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { isLoading: isUserLoading, isAuthenticated } = useAuth();
  const acceptInviteMutation = useAcceptInvite();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const acceptTriggered = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // If auth state is still loading, wait
    if (isUserLoading) return;

    // If no token is provided, set error
    if (!token) {
      setErrorMsg("No invitation token was provided. Please check your invitation link.");
      return;
    }

    // If not authenticated, redirect to login page with this page as redirect target
    if (!isAuthenticated) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // If authenticated and not already triggered, accept the invite
    if (isAuthenticated && !acceptTriggered.current) {
      acceptTriggered.current = true;
      acceptInviteMutation.mutate(
        { token },
        {
          onSuccess: (response) => {
            const workspaceId =
              response.data?.workspace_id ||
              response.data?.workspace?.id ||
              response.data?.id;

            if (workspaceId) {
              router.push(`/dashboard/workspace/${workspaceId}`);
            } else {
              router.push("/dashboard");
            }
          },
          onError: (err) => {
            const msg = axios.isAxiosError(err)
              ? err.response?.data?.message || err.message
              : err instanceof Error
              ? err.message
              : "Failed to accept the workspace invitation.";
            setErrorMsg(msg);
          },
        }
      );
    }
  }, [mounted, isUserLoading, isAuthenticated, token, router, acceptInviteMutation]);

  const isLoading = isUserLoading || acceptInviteMutation.isPending;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="glass-panel-glow rounded-2xl p-8 shadow-xl text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Workspace Invitation
            </h2>
            <p className="text-xs text-zinc-400">
              FlowSync Collaborative Workflow Systems
            </p>
          </div>

          {/* Loading State */}
          {isLoading && !errorMsg && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm text-zinc-300 font-medium">
                {!isAuthenticated ? "Verifying authentication..." : "Accepting workspace invitation..."}
              </p>
            </div>
          )}

          {/* Error State */}
          {errorMsg && (
            <div className="space-y-6 py-4">
              <div className="mx-auto inline-flex items-center justify-center p-3.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-500">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Acceptance Failed</h3>
                <p className="text-sm text-zinc-400 px-4 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="w-full bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-300 text-xs font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Success Redirecting State */}
          {acceptInviteMutation.isSuccess && !errorMsg && (
            <div className="space-y-6 py-6">
              <div className="mx-auto inline-flex items-center justify-center p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 animate-bounce">
                <MailCheck className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Invitation Accepted!</h3>
                <p className="text-sm text-zinc-400">
                  Redirecting you to the workspace dashboard...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
