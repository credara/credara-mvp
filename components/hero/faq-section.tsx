"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Credara and who can use it?",
    answer:
      "Credara is a trustworthiness assessment service for landlords, property managers, and fintech platforms in emerging markets like Nigeria. We generate detailed Credara Trust Scores to support rental and lending decisions with verified applicant information.",
  },
  {
    question: "How does the verification process work?",
    answer:
      "Our expert team conducts manual, high-touch verification of applicant information including income verification, reference checks, and background research. This comprehensive approach ensures accurate Trust Scores for informed decision-making.",
  },
  {
    question: "How long does it take to get a Trust Score?",
    answer:
      "Verification timelines depend on information availability and complexity. We work diligently to provide comprehensive assessments while maintaining accuracy. Contact our team for specific timelines based on your needs.",
  },
  {
    question: "What information is included in the Trust Score?",
    answer:
      "The Credara Trust Score incorporates verified income, employment history, financial reliability, references, and other relevant factors. The score helps landlords and lenders make confident decisions about rental and lending applications.",
  },
  {
    question: "Is my data secure with Credara?",
    answer:
      "Absolutely. We implement enterprise-grade security measures and handle all applicant data with strict confidentiality. All verification is conducted with proper consent and regulatory compliance.",
  },
  {
    question: "How do I get started with Credara?",
    answer:
      "Contact our team to discuss your verification needs. For individual assessments or bulk verification programs, we'll work with you to establish a process that fits your business requirements.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="w-full border-b border-border bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <h2 className="w-full flex flex-col justify-center text-secondary font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="w-full text-muted-foreground text-base font-normal leading-7 font-sans">
            Learn about Credara's verification process
            <br className="hidden md:block" />
            and how Trust Scores work
          </p>
        </div>

        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <div
                  key={index}
                  className="w-full border-b border-border overflow-hidden last:border-b-0"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-muted/50 transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 text-secondary text-base font-medium leading-6 font-sans">
                      {item.question}
                    </span>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-muted-foreground text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
