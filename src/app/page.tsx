import HeroSection from "@/features/landing/components/home/HeroSection";
import StatsSection from "@/features/landing/components/home/StatsSection";
import SimulatorSection from "@/features/landing/components/home/SimulatorSection";
import BottomGrid from "@/features/landing/components/home/BottomGrid";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-bg-dark overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <HeroSection />
      <StatsSection />
      <SimulatorSection />
      <BottomGrid />
    </div>
  );
}
