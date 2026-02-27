import { TrustScoreChart } from "@/components/dashboard/trust-score-chart";

export default function TrustScoreCards() {
  return (
    <div className="relative w-full max-w-xl aspect-4/3 flex items-center justify-center">
      {/* Left card */}
      <div className="absolute -left-4 sm:-left-8 -rotate-6 translate-y-6 sm:translate-y-8 scale-90 sm:scale-95 opacity-80">
        <TrustScoreCard variant="muted" score={20} />
      </div>

      {/* Right card */}
      <div className="absolute -right-4 sm:-right-8 rotate-6 translate-y-6 sm:translate-y-8 scale-90 sm:scale-95 opacity-80">
        <TrustScoreCard variant="muted" score={58} />
      </div>

      {/* Center card */}
      <div className="relative z-10">
        <TrustScoreCard variant="primary" score={92} />
      </div>
    </div>
  );
}

type TrustScoreCardVariant = "primary" | "muted";

interface TrustScoreCardProps {
  variant?: TrustScoreCardVariant;
  score: number;
}

function TrustScoreCard({ variant = "primary", score }: TrustScoreCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={[
        "w-64 sm:w-72 md:w-80 rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.55)]",
        "backdrop-blur-sm flex flex-col justify-between",
        "px-5 sm:px-6 md:px-7 py-4 sm:py-4.5 md:py-5",
        isPrimary
          ? "bg-white/5 border-primary/40"
          : "bg-white/3 border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            Trust Score
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            Rental Applicant
          </p>
        </div>
        <div
          className={[
            "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
            isPrimary
              ? "bg-primary/15 text-primary border border-primary/40"
              : "bg-white/5 text-white/80 border border-white/10",
          ].join(" ")}
        >
          Manual Review
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto,1fr] gap-3 text-sm text-white/85">
        <span className="text-xs uppercase tracking-[0.18em] text-white/50">
          Score
        </span>
        <div className="flex items-center">
          <TrustScoreChart score={score} compact variant="landing" />
        </div>

        <span className="text-xs uppercase tracking-[0.18em] text-white/50">
          Signals
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Badge text="Employer Verified" />
          <Badge text="Previous Landlord" />
          <Badge text="Community Reference" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/60">
        <span>Report ID: CRD-2048</span>
        <span className="font-medium tracking-[0.20em] uppercase">Credara</span>
      </div>
    </div>
  );
}

interface BadgeProps {
  text: string;
}

function Badge({ text }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
      {text}
    </span>
  );
}
