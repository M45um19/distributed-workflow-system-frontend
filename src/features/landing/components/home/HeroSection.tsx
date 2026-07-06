import Link from "next/link";
import { Zap, Server, Cpu, Bell } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold uppercase tracking-wider text-primary shadow-[0_0_15px_rgba(255,1,79,0.1)]">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              Next-Gen Project Management
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Orchestrate Workflows <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-primary bg-clip-text text-transparent">
                With Absolute Ease
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              FlowSync is a beautiful, intuitive workspace platform designed to coordinate team tasks, project planning, and live updates. Create projects, collaborate instantly, and keep your team aligned—100% free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto text-center bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(255,1,79,0.3)] hover:shadow-[0_0_35px_rgba(255,1,79,0.5)] transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <a
                href="#simulator"
                className="w-full sm:w-auto text-center border border-zinc-700 hover:border-primary text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 bg-zinc-900/40 backdrop-blur hover:bg-zinc-900/60"
              >
                Try Interactive Demo
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0 border-t border-zinc-800/80">
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Free to Use</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Unlimited</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Workspaces</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Real-Time</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Live Alerts</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl pointer-events-none" />
            <div className="glass-panel-glow rounded-2xl p-6 relative z-10 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800/85 pb-4">
                <div className="flex gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600/40 border border-rose-600" />
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-600/40 border border-yellow-600" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600/40 border border-emerald-600" />
                </div>
                <span className="text-xs text-zinc-500 font-mono">workspace.status == active</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-primary/40 transition-colors duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary tracking-wide uppercase px-2 py-0.5 rounded bg-primary/10">Live Alerts</span>
                    <span className="text-xs text-zinc-500">Active Now</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Create Shared Project Workspaces</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Invite team members with a single click, organize tasks onto visual boards, and keep everyone aligned with instant notification alerts.
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-900">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">FS</div>
                      <span className="text-xs text-zinc-500">FlowSync Workspace</span>
                    </div>
                    <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">ACTIVE</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-3">
                  <div className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Active Pipeline</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col items-center flex-1">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <Server className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-1">Workspace</span>
                    </div>
                    <div className="h-[2px] bg-gradient-to-r from-zinc-800 via-primary to-zinc-800 flex-1 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-primary/30">
                        <Cpu className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] text-primary mt-1">Alerts Dispatcher</span>
                    </div>
                    <div className="h-[2px] bg-zinc-800 flex-1" />
                    <div className="flex flex-col items-center flex-1">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <Bell className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-1">Live Alerts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
