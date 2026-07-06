import { Activity } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="py-20 border-t border-zinc-900 bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-zinc-950/80 border border-primary/30 p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(255,1,79,0.15)] min-h-[300px] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,1,79,0.08),transparent)]" />
            <div>
              <Activity className="w-8 h-8 text-primary mb-6" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                Designed <br />For Teams.
              </h2>
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm mb-6">
                A feature-rich, high-performance workspace tool built to streamline your tasks, project flows, and notifications without any hidden costs.
              </p>
              <div className="text-xs uppercase tracking-widest text-primary font-semibold tracking-wider">
                100% Free Workspace Platform
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl glass-panel hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Workspaces</div>
              <div className="text-3xl font-extrabold text-white">Flexible Boards</div>
              <p className="text-zinc-400 text-xs mt-2">Create project cards, add checklists, write descriptions, and assign tasks with ease.</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Live Alerts</div>
              <div className="text-3xl font-extrabold text-primary">Instant Updates</div>
              <p className="text-zinc-400 text-xs mt-2">All tasks and actions trigger immediate notification updates for members on the board.</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Secure Sharing</div>
              <div className="text-3xl font-extrabold text-white">Direct Invitations</div>
              <p className="text-zinc-400 text-xs mt-2">Invite team members with secure workspace tokens and organize collaborative projects.</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Notifications</div>
              <div className="text-3xl font-extrabold text-white">Unified Alerts</div>
              <p className="text-zinc-400 text-xs mt-2">Get instant in-app alerts and keep track of updates, comments, and project statuses.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
