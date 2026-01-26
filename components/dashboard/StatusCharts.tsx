/**
 * StatusCharts Component
 * Visualizes admin status metrics using charts
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminStatus } from "@/lib/api/admins";

export interface StatusChartsProps {
  data: AdminStatus;
  loading?: boolean;
}

export function StatusCharts({ data, loading = false }: StatusChartsProps) {
  // Return loading state if no data
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credits Overview</CardTitle>
          <CardDescription>Your credit allocation and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data from admin status
  const chartData = [
    {
      name: "Allocated",
      value: data.allocated_credits || 0,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Available",
      value: data.available_credits || 0,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Active Ads",
      value: data.activeAds?.total ?? 0,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const chartConfig = {
    value: {
      label: "Value",
    },
    allocated: {
      label: "Allocated Credits",
      color: "hsl(var(--chart-1))",
    },
    available: {
      label: "Available Credits",
      color: "hsl(var(--chart-2))",
    },
    activeAds: {
      label: "Active Ads",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits Overview</CardTitle>
        <CardDescription>Your credit allocation and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="text-xs fill-foreground"
              stroke="currentColor"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs fill-foreground"
              stroke="currentColor"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
