import { Target, Eye, Users } from "lucide-react";

export default function AboutContent() {
  const values = [
    {
      icon: Target,
      title: "Workspace Backups",
      desc: "Our platform ensures your team's workspace is always accessible, saving changes automatically as you work.",
    },
    {
      icon: Eye,
      title: "Workspace Insights",
      desc: "Simple visual dashboards let teams see progress, blockages, and milestones at a glance.",
    },
    {
      icon: Users,
      title: "Cohesive Collaboration",
      desc: "Instant workspace invitations, live notifications, and nested comments keep your team aligned.",
    }
  ];

  const team = [
    {
      name: "Jane Cooper",
      role: "Lead Product Designer",
      specialty: "Interactive Design",
      bio: "Focuses on creating intuitive workspaces, interactive visual cards, and gorgeous user-friendly layouts."
    },
    {
      name: "Alex Rivera",
      role: "Product Planner",
      specialty: "User Experience",
      bio: "Focuses on creating responsive designs, sharing capabilities, and fluid animations for teams."
    }
  ];

  return (
    <div className="space-y-24">
      <div className="border-t border-zinc-900 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Core Values</h2>
          <p className="text-sm text-zinc-400">
            We build our workspace around three simple, powerful principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="p-6 rounded-xl glass-panel-glow hover:border-primary/30 transition-colors duration-300 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{val.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet the Creators</h2>
          <p className="text-sm text-zinc-400">
            The minds building the ultimate collaboration platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="glass-panel rounded-xl p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <span className="text-[9px] uppercase font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded">
                    {member.specialty}
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-500">{member.role}</p>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pt-4 border-t border-zinc-900">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
