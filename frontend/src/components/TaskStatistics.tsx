import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent
} from "@/components/ui/chart";

interface TaskStatisticsProps {
  data: { name: string; count: number }[];
}

const config = {
  todo: { color: "#9b87f5" },
  inProgress: { color: "#7E69AB" },
  done: { color: "#6E59A5" },
  backlog: { color: "#ea384c" }
};

const TaskStatistics = ({ data }: TaskStatisticsProps) => {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.count,
    fill: getColumnColor(item.name)
  }));

  function getColumnColor(columnName: string): string {
    switch (columnName) {
      case "To Do":
        return config.todo.color;
      case "In Progress":
        return config.inProgress.color;
      case "Done":
        return config.done.color;
      case "Backlog":
        return config.backlog.color;
      default:
        return "#8E9196";
    }
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[200px] w-full">
          <ChartContainer config={config} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {payload[0].payload.name}
                            </span>
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
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskStatistics;
