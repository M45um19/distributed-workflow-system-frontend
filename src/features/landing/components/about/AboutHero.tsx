import { Award } from "lucide-react";

export default function AboutHero() {
  return (
    <div className="space-y-24">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold uppercase tracking-wider text-primary shadow-[0_0_15px_rgba(255,1,79,0.1)]">
          <Award className="w-3.5 h-3.5" />
          Our Vision & Journey
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Designed for Teams. <br />
          <span className="bg-gradient-to-r from-white via-zinc-200 to-primary bg-clip-text text-transparent">
            Built for Simplicity.
          </span>
        </h1>
        <p className="text-zinc-400 text-base max-w-xl mx-auto">
          Discover how FlowSync helps teams collaborate, organize projects, and stay organized.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">The FlowSync Mission</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Traditional task management boards are simple, but they often restrict you with paid tiers, user limits, or complex setups. Keeping teams aligned across multiple projects and cards can become cluttered and expensive, distracting you from actual work.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We built FlowSync to solve this problem. FlowSync brings your team together in a beautiful, unified workspace. Your tasks, checklists, and comments sync instantly across everyone&apos;s screens, keeping everyone aligned without interruptions—all completely free.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl glass-panel text-center">
            <span className="text-3xl font-extrabold text-primary">100%</span>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Free Platform</p>
          </div>
          <div className="p-6 rounded-xl glass-panel text-center">
            <span className="text-3xl font-extrabold text-white">Unlimited</span>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Members</p>
          </div>
          <div className="p-6 rounded-xl glass-panel text-center">
            <span className="text-3xl font-extrabold text-white">Instant</span>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Updates</p>
          </div>
          <div className="p-6 rounded-xl glass-panel text-center">
            <span className="text-3xl font-extrabold text-primary">Easy</span>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Sharing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
