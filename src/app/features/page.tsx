import FeaturesHero from "@/features/landing/components/features/FeaturesHero";
import FeaturesList from "@/features/landing/components/features/FeaturesList";

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-bg-dark text-zinc-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-20">
        <FeaturesHero />
        <FeaturesList />
      </div>
    </div>
  );
}
