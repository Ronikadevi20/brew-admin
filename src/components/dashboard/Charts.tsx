import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ChartData,
  BDLVisibilityData,
  PeakHoursHeatmapData,
  DashboardPeriod,
  RepeatRateTrendPoint,
  VisitGapBucket,
  LoyaltyProgressStage,
} from "@/types/analytics.types";

// Re-export types for consumers
export type { ChartData, BDLVisibilityData, PeakHoursHeatmapData };

const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 75%)",
};

// Stamps Bar Chart
interface StampsBarChartProps {
  data?: ChartData | null;
  period?: DashboardPeriod;
  className?: string;
}

export function StampsBarChart({ data, period = "today", className }: StampsBarChartProps) {
  const chartData = useMemo(() => {
    if (!data || !data.labels || data.labels.length === 0) {
      return [
        { hour: "8am", stamps: 0 },
        { hour: "10am", stamps: 0 },
        { hour: "12pm", stamps: 0 },
        { hour: "2pm", stamps: 0 },
        { hour: "4pm", stamps: 0 },
        { hour: "6pm", stamps: 0 },
        { hour: "8pm", stamps: 0 },
      ];
    }
    return data.labels.map((label, index) => ({
      hour: label,
      stamps: data.data[index] || 0,
    }));
  }, [data]);

  const getTitle = () => {
    switch (period) {
      case "today": return "Stamps Collected Per Hour";
      case "week": return "Stamps Collected Per Day";
      case "month": return "Stamps Collected Per Week";
      default: return "Stamps Collected";
    }
  };

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
            <XAxis dataKey="hour" stroke="hsl(20, 20%, 45%)" fontSize={11} />
            <YAxis stroke="hsl(20, 20%, 45%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 25%, 88%)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="stamps" fill={chartColors.secondary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// BDL Visibility Pie Chart (kept for potential re-use)
interface BDLVisibilityPieChartProps {
  data?: BDLVisibilityData | null;
  className?: string;
}

export function BDLVisibilityPieChart({ data, className }: BDLVisibilityPieChartProps) {
  const chartData = useMemo(() => {
    if (!data) {
      return [
        { name: "Public", value: 0, color: "hsl(20, 35%, 40%)" },
        { name: "Friends-only", value: 0, color: "hsl(28, 60%, 55%)" },
        { name: "Private", value: 0, color: "hsl(35, 38%, 75%)" },
      ];
    }
    return [
      { name: "Public", value: data.public, color: "hsl(20, 35%, 40%)" },
      { name: "Friends-only", value: data.friends, color: "hsl(28, 60%, 55%)" },
      { name: "Private", value: data.private, color: "hsl(35, 38%, 75%)" },
    ];
  }, [data]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>BDL Post Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No BDL posts in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(35, 25%, 88%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// Repeat Rate Trend Chart
interface RepeatRateTrendChartProps {
  data?: RepeatRateTrendPoint[] | null;
  period?: DashboardPeriod;
  className?: string;
}

export function RepeatRateTrendChart({ data, period = "week", className }: RepeatRateTrendChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((point) => ({
      date: point.date,
      repeatRate: point.repeatRate,
      total: point.totalCustomers,
      returning: point.returningCustomers,
    }));
  }, [data]);

  const getTitle = () => {
    switch (period) {
      case "today": return "Repeat Rate — Today";
      case "week": return "Repeat Rate — Last 7 Days";
      case "month": return "Repeat Rate — Last 30 Days";
      default: return "Repeat Rate Trend";
    }
  };

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <p className="text-sm text-muted-foreground">% of customers returning over time</p>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No visit data available for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
              <XAxis dataKey="date" stroke="hsl(20, 20%, 45%)" fontSize={11} />
              <YAxis
                stroke="hsl(20, 20%, 45%)"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(35, 25%, 88%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "repeatRate") return [`${value}%`, "Repeat Rate"];
                  if (name === "total") return [value, "Total Customers"];
                  if (name === "returning") return [value, "Returning"];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="repeatRate"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: chartColors.secondary }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// Visit Gap Distribution Chart
interface VisitGapDistributionChartProps {
  data?: VisitGapBucket[] | null;
  className?: string;
}

export function VisitGapDistributionChart({ data, className }: VisitGapDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { bucket: "1–3 days", customers: 0 },
        { bucket: "4–7 days", customers: 0 },
        { bucket: "8–14 days", customers: 0 },
        { bucket: "15–30 days", customers: 0 },
        { bucket: "30+ days", customers: 0 },
      ];
    }
    return data;
  }, [data]);

  const isEmpty = chartData.every((b) => b.customers === 0);

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>Visit Gap Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">How long customers take to come back</p>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No returning customer data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
              <XAxis dataKey="bucket" stroke="hsl(20, 20%, 45%)" fontSize={11} />
              <YAxis stroke="hsl(20, 20%, 45%)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(35, 25%, 88%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [value, "Customers"]}
              />
              <Bar dataKey="customers" fill={chartColors.primary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// Loyalty Progress Distribution Chart (horizontal bar)
interface LoyaltyProgressDistributionChartProps {
  data?: LoyaltyProgressStage[] | null;
  className?: string;
}

export function LoyaltyProgressDistributionChart({ data, className }: LoyaltyProgressDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { stage: "0 stamps", customers: 0 },
        { stage: "1–2 stamps", customers: 0 },
        { stage: "3–5 stamps", customers: 0 },
        { stage: "6–8 stamps", customers: 0 },
        { stage: "9 stamps", customers: 0 },
        { stage: "Completed", customers: 0 },
      ];
    }
    return [...data].reverse(); // Reverse so "Completed" appears at top
  }, [data]);

  const isEmpty = chartData.every((s) => s.customers === 0);

  const barColors = [
    "hsl(20, 35%, 40%)",
    "hsl(22, 40%, 46%)",
    "hsl(25, 48%, 52%)",
    "hsl(28, 55%, 58%)",
    "hsl(30, 60%, 64%)",
    "hsl(35, 38%, 75%)",
  ];

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>Loyalty Progress Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Where customers are in their stamp journey</p>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No loyalty card data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" horizontal={false} />
              <XAxis type="number" stroke="hsl(20, 20%, 45%)" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="stage" stroke="hsl(20, 20%, 45%)" fontSize={11} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(35, 25%, 88%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [value, "Customers"]}
              />
              <Bar dataKey="customers" radius={[0, 6, 6, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
