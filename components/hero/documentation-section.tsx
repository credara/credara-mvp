"use client";

import type React from "react";

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
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
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-[#37322F] outline-offset-[-0.58px] rounded-full"></div>
            }
            text="Platform Features"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            How Credara Works
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            A transparent process for trustworthiness assessment
            <br />
            backed by our expert verification team
          </div>
        </div>
      </div>

      <div className="self-stretch px-4 md:px-9 py-8 md:py-11 overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full -rotate-45 origin-top-left outline outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row relative justify-center items-stretch gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-1 min-w-0 overflow-hidden flex flex-col justify-start items-start border border-[rgba(2,6,23,0.08)] bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
            >
              <div className="px-6 py-5 w-full flex flex-col gap-2">
                <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm font-semibold leading-6 font-sans">
                  {card.title}
                </div>
                <div className="self-stretch text-[#605A57] text-[13px] font-normal leading-[22px] font-sans whitespace-pre-line">
                  {card.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
