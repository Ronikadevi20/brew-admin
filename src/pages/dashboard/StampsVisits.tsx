import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Stamp, Users, Gift, UserCheck, Clock, TrendingUp } from "lucide-react";

const visitsPerHourData = [
  { hour: "8am", visits: 15 },
  { hour: "9am", visits: 28 },
  { hour: "10am", visits: 42 },
  { hour: "11am", visits: 55 },
  { hour: "12pm", visits: 48 },
  { hour: "1pm", visits: 52 },
  { hour: "2pm", visits: 38 },
  { hour: "3pm", visits: 45 },
  { hour: "4pm", visits: 58 },
  { hour: "5pm", visits: 72 },
  { hour: "6pm", visits: 65 },
  { hour: "7pm", visits: 48 },
  { hour: "8pm", visits: 32 },
];

const stampsByDrinkData = [
  { name: "Latte", value: 245, color: "hsl(20, 35%, 40%)" },
  { name: "Cappuccino", value: 189, color: "hsl(28, 60%, 55%)" },
  { name: "Americano", value: 156, color: "hsl(35, 38%, 65%)" },
  { name: "Espresso", value: 98, color: "hsl(8, 31%, 33%)" },
  { name: "Cold Brew", value: 134, color: "hsl(36, 47%, 81%)" },
];

const customerTypeData = [
  { name: "Returning", value: 68, color: "hsl(20, 35%, 40%)" },
  { name: "New", value: 32, color: "hsl(28, 60%, 55%)" },
];

const funnelData = [
  { stage: "Started Card", users: 1000 },
  { stage: "3 Stamps", users: 780 },
  { stage: "6 Stamps", users: 520 },
  { stage: "9 Stamps", users: 340 },
  { stage: "Redeemed", users: 245 },
];

const tableData = [
  { date: "Dec 10", visits: 156, stamps: 234, redemptions: 12, uniqueUsers: 98, peakHour: "5:00 PM" },
  { date: "Dec 9", visits: 189, stamps: 278, redemptions: 15, uniqueUsers: 112, peakHour: "5:30 PM" },
  { date: "Dec 8", visits: 178, stamps: 256, redemptions: 14, uniqueUsers: 105, peakHour: "4:00 PM" },
  { date: "Dec 7", visits: 145, stamps: 212, redemptions: 11, uniqueUsers: 89, peakHour: "5:00 PM" },
  { date: "Dec 6", visits: 167, stamps: 245, redemptions: 13, uniqueUsers: 102, peakHour: "6:00 PM" },
  { date: "Dec 5", visits: 134, stamps: 198, redemptions: 10, uniqueUsers: 78, peakHour: "4:30 PM" },
  { date: "Dec 4", visits: 156, stamps: 223, redemptions: 12, uniqueUsers: 95, peakHour: "5:00 PM" },
];

export default function StampsVisits() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Stamps & Visits</h1>
            <p className="text-muted-foreground mt-1">Track customer loyalty and engagement</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Stamps"
            value="6,892"
            change={{ value: 12, type: "increase" }}
            icon={Stamp}
            className="animate-slide-up opacity-0 stagger-1"
          />
          <MetricCard
            title="Avg per User"
            value="4.2"
            change={{ value: 8, type: "increase" }}
            icon={TrendingUp}
            className="animate-slide-up opacity-0 stagger-2"
          />
          <MetricCard
            title="Free Drink Redemptions"
            value="87"
            change={{ value: 15, type: "increase" }}
            icon={Gift}
            className="animate-slide-up opacity-0 stagger-3"
          />
          <MetricCard
            title="Unique Visitors"
            value="1,645"
            change={{ value: 5, type: "increase" }}
            icon={UserCheck}
            className="animate-slide-up opacity-0 stagger-4"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visits per Hour */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-mocha" />
                Visits per Hour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={visitsPerHourData}>
                  <defs>
                    <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
                  <XAxis dataKey="hour" stroke="hsl(20, 20%, 45%)" fontSize={11} />
                  <YAxis stroke="hsl(20, 20%, 45%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(35, 25%, 88%)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(28, 60%, 55%)"
                    strokeWidth={3}
                    fill="url(#visitGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stamps by Drink */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stamp className="w-5 h-5 text-mocha" />
                Stamps by Drink Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stampsByDrinkData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stampsByDrinkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(35, 25%, 88%)",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Type */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-mocha" />
                Returning vs New Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {customerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-serif font-bold text-foreground">68%</p>
                      <p className="text-xs text-muted-foreground">Returning</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {customerTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stamp Card Funnel */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-mocha" />
                Stamp Card Completion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((stage, index) => {
                  const percentage = (stage.users / funnelData[0].users) * 100;
                  return (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{stage.stage}</span>
                        <span className="text-muted-foreground">{stage.users} users</span>
                      </div>
                      <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: `hsl(20, 35%, ${45 + index * 8}%)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Daily Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total Visits</TableHead>
                  <TableHead className="text-right">Total Stamps</TableHead>
                  <TableHead className="text-right">Redemptions</TableHead>
                  <TableHead className="text-right">Unique Users</TableHead>
                  <TableHead className="text-right">Peak Hour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.date} className="hover:bg-secondary/50">
                    <TableCell className="font-medium">{row.date}</TableCell>
                    <TableCell className="text-right">{row.visits}</TableCell>
                    <TableCell className="text-right">{row.stamps}</TableCell>
                    <TableCell className="text-right">{row.redemptions}</TableCell>
                    <TableCell className="text-right">{row.uniqueUsers}</TableCell>
                    <TableCell className="text-right text-mocha font-medium">{row.peakHour}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
