import { HeroSection } from "@/components/features/landing/HeroSection";
import { AboutSection } from "@/components/features/landing/AboutSection";
import { FeaturesSection } from "@/components/features/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/features/landing/HowItWorksSection";
import { FinalCtaSection } from "@/components/features/landing/FinalCtaSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FinalCtaSection />
    </>
  );
}
