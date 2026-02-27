"use client";

import DocumentationSection from "@/components/hero/documentation-section";
import CTASection from "@/components/hero/cta-section";
import FooterSection from "@/components/hero/footer-section";
import FAQSection from "@/components/hero/faq-section";
import LandingHeader from "@/components/hero/landing-header";
import LandingHero from "@/components/hero/landing-hero";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a0e17] text-white overflow-x-hidden flex flex-col">
      <div
        className="relative flex flex-col min-h-dvh"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 2px, transparent 0)
          `,
          backgroundSize: "24px 24px", // Reduced from 48px for closer dots
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col min-h-dvh">
          <LandingHeader />
          <LandingHero />
        </div>
      </div>

      <DocumentationSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
