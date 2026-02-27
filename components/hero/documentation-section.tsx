"use client";

import type React from "react";

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-secondary/10 overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-border">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center flex justify-center flex-col text-secondary text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  );
}

const cards = [
  {
    title: "Comprehensive Verification",
    description:
      "Our expert team conducts in-depth manual\nverification of applicant information.",
  },
  {
    title: "Trust Score Generation",
    description:
      "Get detailed Credara Trust Scores that\nincorporate multiple verification layers.",
  },
  {
    title: "Emerging Market Focus",
    description:
      "Specialized assessment tailored for Nigeria\nand other emerging market dynamics.",
  },
];

export default function DocumentationSection() {
  return (
    <section className="w-full border-b border-border bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-primary outline-offset-[-0.58px] rounded-full"></div>
            }
            text="Platform Features"
          />
          <h2 className="self-stretch text-center flex justify-center flex-col text-secondary text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            How Credara Works
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-base font-normal leading-7 font-sans">
            A transparent process for trustworthiness assessment
            <br />
            backed by our expert verification team
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-11">
        <div className="flex flex-col md:flex-row relative justify-center items-stretch gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-1 min-w-0 overflow-hidden flex flex-col justify-start items-start border border-border bg-card rounded-lg shadow-sm"
            >
              <div className="px-6 py-5 w-full flex flex-col gap-2">
                <h3 className="self-stretch flex justify-center flex-col text-secondary text-sm font-semibold leading-6 font-sans">
                  {card.title}
                </h3>
                <p className="self-stretch text-muted-foreground text-[13px] font-normal leading-[22px] font-sans whitespace-pre-line">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
