import HowItWorksHero from "@/features/landing/components/how-it-works/HowItWorksHero";
import HowItWorksInteractive from "@/features/landing/components/how-it-works/HowItWorksInteractive";

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-bg-dark text-zinc-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[20%] left-[5%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-16">
        <HowItWorksHero />
        <HowItWorksInteractive />
      </div>
    </div>
  );
}
