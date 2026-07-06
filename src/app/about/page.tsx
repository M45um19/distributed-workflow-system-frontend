import AboutHero from "@/features/landing/components/about/AboutHero";
import AboutContent from "@/features/landing/components/about/AboutContent";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-bg-dark text-zinc-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-24">
        <AboutHero />
        <AboutContent />
      </div>
    </div>
  );
}
