"use client";

import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { scoreToRiskLevel, type RiskLevel } from "@/lib/trust-score";

interface TrustScoreChartProps {
  score: number;
  compact?: boolean;
  children?: React.ReactNode;
  variant?: "default" | "landing";
}

export function TrustScoreChart({
  score,
  compact = false,
  children,
  variant = "default",
}: TrustScoreChartProps) {
  const riskLevel = scoreToRiskLevel(score);

  const getRiskColor = (level: RiskLevel | null) => {
    switch (level) {
      case "LOW":
        return "#10b981";
      case "MEDIUM":
        return "#f59e0b";
      case "HIGH":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getRiskLabel = (level: RiskLevel | null) => {
    switch (level) {
      case "LOW":
        return "Low Risk";
      case "MEDIUM":
        return "Medium Risk";
      case "HIGH":
        return "High Risk";
      default:
        return " ";
    }
  };

  const chartData = [{ score, fill: getRiskColor(riskLevel) }];

  const chartConfig = {
    score: { label: "Trust Score" },
  } satisfies ChartConfig;

  const isLanding = variant === "landing";

  const size =
    compact || isLanding
      ? {
          maxH: isLanding ? "170px" : "110px",
          innerR: isLanding ? 46 : 36,
          outerR: isLanding ? 74 : 56,
        }
      : { maxH: "300px", innerR: 80, outerR: 140 };
  const polarRadius =
    compact || isLanding ? [size.innerR + 4, size.innerR] : [86, 74];
  const textSize =
    compact || isLanding ? (isLanding ? "text-3xl" : "text-2xl") : "text-4xl";
  const subTextOffset = compact || isLanding ? (isLanding ? 20 : 16) : 24;

  const chart = (
    <ChartContainer
      config={chartConfig}
      className={`mx-auto aspect-square [&_.recharts-sector]:stroke-none! ${
        isLanding
          ? "[&_.recharts-polar-grid_circle]:fill-[#111827] [&_.recharts-radial-bar-background-sector]:fill-[#020617]"
          : "[&_.recharts-polar-grid_circle]:fill-[#e8e6e1]"
      } ${
        compact || isLanding
          ? "max-h-[170px] min-h-[120px] w-full min-w-[120px]"
          : "max-h-[300px]"
      }`}
    >
      <RadialBarChart
        data={chartData}
        startAngle={180}
        endAngle={0}
        innerRadius={size.innerR}
        outerRadius={size.outerR}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className={
            isLanding
              ? "first:fill-[#0b1120] last:fill-[#020617]"
              : "first:fill-[#f0ede8] last:fill-[#f7f5f3]"
          }
          polarRadius={polarRadius}
        />
        <RadialBar
          dataKey="score"
          background={{ fill: isLanding ? "#020617" : "#f7f5f3" }}
          cornerRadius={10}
          stroke="none"
        />
        <PolarRadiusAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          tickLine={false}
          axisLine={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={`font-bold ${textSize} ${
                        isLanding ? "fill-white" : "fill-[#37322F]"
                      }`}
                    >
                      {score}
                    </tspan>
                    {riskLevel != null && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + subTextOffset}
                        className={`text-xs font-medium ${
                          isLanding ? "fill-[#d1d5db]" : "fill-[#605A57]"
                        }`}
                      >
                        {getRiskLabel(riskLevel)}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );

  if (isLanding) {
    return <div className="flex-1 flex items-center">{chart}</div>;
  }

  return (
    <Card
      className={`flex flex-col border shadow-none border-border ${
        compact ? "py-1 px-2" : ""
      }`}
    >
      {!compact && (
        <CardHeader className="items-center pb-0">
          <CardTitle>Trust Score</CardTitle>
          <CardDescription>
            Your current trustworthiness assessment
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={compact ? "flex-1 p-0 pb-1" : "flex-1 pb-0"}>
        {chart}
      </CardContent>
      {children != null && !compact ? (
        <CardContent className="pt-0">{children}</CardContent>
      ) : null}
    </Card>
  );
}
