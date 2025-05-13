
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PriorityDistributionProps {
  data: { name: string; count: number }[];
}

const COLORS = {
  Critical: "#ea384c",
  Medium: "#fcae1e",
  Low: "#4ade80",
  None: "#8E9196"
};

const config = {
  critical: { color: COLORS.Critical },
  medium: { color: COLORS.Medium },
  low: { color: COLORS.Low },
  none: { color: COLORS.None },
};

const PriorityDistribution = ({ data }: PriorityDistributionProps) => {
  // Filter out any categories with count=0
  const chartData = data.filter(item => item.count > 0);
  
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  nameKey="name"
                  dataKey="count"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  fill="#8884d8"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#8E9196"} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent>
                          <div className="flex flex-col">
                            <span className="font-medium">{payload[0].name}</span>
                            <span className="text-sm text-muted-foreground">
                              {payload[0].value} tasks
                            </span>
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityDistribution;
