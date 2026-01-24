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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
          <CardDescription>Visual representation of your admin metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Overview</CardTitle>
        <CardDescription>Visual representation of your admin metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
