import { Terminal } from "lucide-react";

export default function HowItWorksHero() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold uppercase tracking-wider text-primary shadow-[0_0_15px_rgba(255,1,79,0.1)]">
        <Terminal className="w-3.5 h-3.5" />
        Walkthrough Guide
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        How FlowSync Works <br />
        <span className="bg-gradient-to-r from-white via-zinc-200 to-primary bg-clip-text text-transparent">
          Five Steps to Team Alignment
        </span>
      </h1>
      <p className="text-zinc-400 text-base max-w-xl mx-auto">
        A clean, high-performance platform to coordinate projects, checklists, and active member notifications completely free.
      </p>
    </div>
  );
}
