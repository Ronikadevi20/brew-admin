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
import type { ChartData, BDLVisibilityData, PeakHoursHeatmapData, DashboardPeriod } from "@/types/analytics.types";

// Re-export types for consumers
export type { ChartData, BDLVisibilityData, PeakHoursHeatmapData };

const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 75%)",
};

// Visits Line Chart
interface VisitsLineChartProps {
  data?: ChartData | null;
  period?: DashboardPeriod;
  className?: string;
}

export function VisitsLineChart({ data, period = "today", className }: VisitsLineChartProps) {
  // Transform data for Recharts
  const chartData = useMemo(() => {
    if (!data || !data.labels || data.labels.length === 0) {
      // Return sample data if no data provided
      return [
        { name: "Mon", visits: 0 },
        { name: "Tue", visits: 0 },
        { name: "Wed", visits: 0 },
        { name: "Thu", visits: 0 },
        { name: "Fri", visits: 0 },
        { name: "Sat", visits: 0 },
        { name: "Sun", visits: 0 },
      ];
    }
    return data.labels.map((label, index) => ({
      name: label,
      visits: data.data[index] || 0,
    }));
  }, [data]);

  const getTitle = () => {
    switch (period) {
      case "today":
        return "Hourly Visits";
      case "week":
        return "Daily Visits";
      case "month":
        return "Weekly Visits";
      default:
        return "Visits Over Time";
    }
  };

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
            <XAxis dataKey="name" stroke="hsl(20, 20%, 45%)" fontSize={12} />
            <YAxis stroke="hsl(20, 20%, 45%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 25%, 88%)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke={chartColors.primary}
              strokeWidth={3}
              dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: chartColors.secondary }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Stamps Bar Chart
interface StampsBarChartProps {
  data?: ChartData | null;
  period?: DashboardPeriod;
  className?: string;
}

export function StampsBarChart({ data, period = "today", className }: StampsBarChartProps) {
  // Transform data for Recharts
  const chartData = useMemo(() => {
    if (!data || !data.labels || data.labels.length === 0) {
      // Return sample data if no data provided
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
      case "today":
        return "Stamps Collected Per Hour";
      case "week":
        return "Stamps Collected Per Day";
      case "month":
        return "Stamps Collected Per Week";
      default:
        return "Stamps Collected";
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

// BDL Visibility Pie Chart
interface BDLVisibilityPieChartProps {
  data?: BDLVisibilityData | null;
  className?: string;
}

export function BDLVisibilityPieChart({ data, className }: BDLVisibilityPieChartProps) {
  // Transform data for Recharts
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

// Peak Hours Heatmap
interface PeakHoursHeatmapProps {
  data?: PeakHoursHeatmapData | null;
  className?: string;
}

export function PeakHoursHeatmap({ data, className }: PeakHoursHeatmapProps) {
  // Transform data for display
  const heatmapData = useMemo(() => {
    if (!data || !data.hours || data.hours.length === 0 || !data.data || data.data.length === 0) {
      // Return default data showing business hours
      return [
        { hour: "8am", intensity: 0 },
        { hour: "9am", intensity: 0 },
        { hour: "10am", intensity: 0 },
        { hour: "11am", intensity: 0 },
        { hour: "12pm", intensity: 0 },
        { hour: "1pm", intensity: 0 },
        { hour: "2pm", intensity: 0 },
        { hour: "3pm", intensity: 0 },
        { hour: "4pm", intensity: 0 },
        { hour: "5pm", intensity: 0 },
        { hour: "6pm", intensity: 0 },
        { hour: "7pm", intensity: 0 },
        { hour: "8pm", intensity: 0 },
        { hour: "9pm", intensity: 0 },
        { hour: "10pm", intensity: 0 },
      ];
    }

    // Sum up all days for each hour to get total intensity
    const hourlyTotals: number[] = [];
    const numHours = data.hours.length;
    
    for (let h = 0; h < numHours; h++) {
      let total = 0;
      for (let d = 0; d < data.data.length; d++) {
        total += data.data[d]?.[h] || 0;
      }
      hourlyTotals.push(total);
    }

    // Calculate max for normalization
    const maxTotal = Math.max(...hourlyTotals, 1);

    // Filter to business hours (6am - 10pm) and format
    return data.hours
      .map((hour, index) => ({
        hour,
        intensity: Math.round((hourlyTotals[index] / maxTotal) * 100),
        visits: hourlyTotals[index],
      }))
      .filter((_, index) => index >= 6 && index <= 22);
  }, [data]);

  return (
    <Card className={`hover:shadow-coffee-xl transition-shadow duration-300 ${className || ""}`}>
      <CardHeader>
        <CardTitle>Peak Hours Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        {heatmapData.every(item => item.intensity === 0) ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No visit data available for peak hours
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {heatmapData.map((item) => (
              <div
                key={item.hour}
                className="flex flex-col items-center"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-110"
                  style={{
                    backgroundColor: `hsl(20, 35%, ${100 - item.intensity * 0.6}%)`,
                    color: item.intensity > 50 ? "hsl(40, 33%, 97%)" : "hsl(8, 31%, 23%)",
                  }}
                  title={`${item.visits} visits`}
                >
                  {item.intensity}%
                </div>
                <span className="text-xs text-muted-foreground mt-1">{item.hour}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}