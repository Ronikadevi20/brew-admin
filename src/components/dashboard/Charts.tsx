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

// Sample data
const visitsData = [
  { name: "Mon", visits: 45 },
  { name: "Tue", visits: 52 },
  { name: "Wed", visits: 78 },
  { name: "Thu", visits: 65 },
  { name: "Fri", visits: 89 },
  { name: "Sat", visits: 112 },
  { name: "Sun", visits: 98 },
];

const stampsData = [
  { hour: "8am", stamps: 12 },
  { hour: "9am", stamps: 28 },
  { hour: "10am", stamps: 35 },
  { hour: "11am", stamps: 42 },
  { hour: "12pm", stamps: 38 },
  { hour: "1pm", stamps: 45 },
  { hour: "2pm", stamps: 32 },
  { hour: "3pm", stamps: 48 },
  { hour: "4pm", stamps: 55 },
  { hour: "5pm", stamps: 62 },
  { hour: "6pm", stamps: 45 },
  { hour: "7pm", stamps: 38 },
  { hour: "8pm", stamps: 28 },
];

const bdlVisibilityData = [
  { name: "Public", value: 45, color: "hsl(20, 35%, 40%)" },
  { name: "Friends-only", value: 35, color: "hsl(28, 60%, 55%)" },
  { name: "Private", value: 20, color: "hsl(35, 38%, 75%)" },
];

const peakHoursData = [
  { hour: "8am", intensity: 20 },
  { hour: "9am", intensity: 45 },
  { hour: "10am", intensity: 75 },
  { hour: "11am", intensity: 85 },
  { hour: "12pm", intensity: 70 },
  { hour: "1pm", intensity: 65 },
  { hour: "2pm", intensity: 50 },
  { hour: "3pm", intensity: 60 },
  { hour: "4pm", intensity: 80 },
  { hour: "5pm", intensity: 95 },
  { hour: "6pm", intensity: 90 },
  { hour: "7pm", intensity: 75 },
  { hour: "8pm", intensity: 55 },
  { hour: "9pm", intensity: 35 },
  { hour: "10pm", intensity: 15 },
];

const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 75%)",
};

export function VisitsLineChart() {
  return (
    <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Visits Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visitsData}>
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

export function StampsBarChart() {
  return (
    <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Stamps Collected Per Hour</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stampsData}>
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

export function BDLVisibilityPieChart() {
  return (
    <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>BDL Post Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={bdlVisibilityData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {bdlVisibilityData.map((entry, index) => (
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
      </CardContent>
    </Card>
  );
}

export function PeakHoursHeatmap() {
  return (
    <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Peak Hours Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {peakHoursData.map((item) => (
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
              >
                {item.intensity}%
              </div>
              <span className="text-xs text-muted-foreground mt-1">{item.hour}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
