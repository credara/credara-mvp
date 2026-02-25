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
  children?: React.ReactNode;
}

export function TrustScoreChart({ score, children }: TrustScoreChartProps) {
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

  return (
    <Card className="flex flex-col border shadow-none border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trust Score</CardTitle>
        <CardDescription>
          Your current trustworthiness assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-[#f0ede8] last:fill-[#f7f5f3]"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="score"
              background={{ fill: "#f7f5f3" }}
              cornerRadius={10}
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
                          className="fill-[#37322F] text-4xl font-bold"
                        >
                          {score}
                        </tspan>
                        {riskLevel != null && (
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-[#605A57] text-sm font-medium"
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
      </CardContent>
      {children != null ? (
        <CardContent className="pt-0">{children}</CardContent>
      ) : null}
    </Card>
  );
}
