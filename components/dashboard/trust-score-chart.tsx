"use client";

import {
  Label,
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
import { IndividualUser } from "@/lib/types/users";

interface TrustScoreChartProps {
  score: number;
  riskLevel: IndividualUser["riskLevel"];
}

export function TrustScoreChart({ score, riskLevel }: TrustScoreChartProps) {
  const getRiskColor = (level: IndividualUser["riskLevel"]) => {
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

  const getRiskLabel = (level: IndividualUser["riskLevel"]) => {
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

  const chartData = [
    {
      score: score,
      fill: getRiskColor(riskLevel ?? "LOW"),
    },
  ];

  const chartConfig = {
    score: {
      label: "Trust Score",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border border-[rgba(55,50,47,0.12)]">
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
            endAngle={180}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-[#f0ede8] last:fill-[#f7f5f3]"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="score" background cornerRadius={10} />
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
    </Card>
  );
}
