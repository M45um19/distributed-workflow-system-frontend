import { Layers } from "lucide-react";

export default function FeaturesHero() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold uppercase tracking-wider text-primary shadow-[0_0_15px_rgba(255,1,79,0.1)]">
        <Layers className="w-3.5 h-3.5" />
        Core Capabilities
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        Resilient Features For <br />
        <span className="bg-gradient-to-r from-white via-zinc-200 to-primary bg-clip-text text-transparent">
          Distributed Teams
        </span>
      </h1>
      <p className="text-zinc-400 text-base max-w-xl mx-auto">
        Deep dive into our core architectural features, engineered for zero-data-loss execution and low latency.
      </p>
    </div>
  );
}
