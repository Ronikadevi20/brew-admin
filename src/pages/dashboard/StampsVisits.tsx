import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Stamp, Users, Gift, UserCheck, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { analyticsService } from "@/services/analytics.service";
import type {
  DashboardPeriod,
  DashboardMetrics,
  ChartData,
  StampCardFunnelData,
  CustomerTypeData,
  DailyStatistics,
  StampsByDrinkData,
} from "@/types/analytics.types";

// Chart colors
const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 65%)",
  quaternary: "hsl(8, 31%, 33%)",
  quinary: "hsl(36, 47%, 81%)",
};

// Pie chart colors for drinks
const drinkColors = [
  "hsl(20, 35%, 40%)",
  "hsl(28, 60%, 55%)",
  "hsl(35, 38%, 65%)",
  "hsl(8, 31%, 33%)",
  "hsl(36, 47%, 81%)",
];

// Default values
const defaultMetrics: DashboardMetrics = {
  visits: 0,
  stamps: 0,
  bdlPosts: 0,
  newUsers: 0,
  peakHour: "N/A",
  avgFrequency: 0,
  redemptions: 0,
  avgStampsPerUser: 0,
  uniqueVisitors: 0,
  changes: {
    visits: 0,
    stamps: 0,
    bdlPosts: 0,
    newUsers: 0,
    avgFrequency: 0,
    redemptions: 0,
    avgStampsPerUser: 0,
  },
};

const defaultCustomerType: CustomerTypeData = {
  returning: 0,
  new: 0,
  returningPercentage: 0,
  newPercentage: 0,
};

export default function StampsVisits() {
  const [period, setPeriod] = useState<DashboardPeriod>("week");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [visitsPerHour, setVisitsPerHour] = useState<ChartData>({ labels: [], data: [] });
  const [stampsByDrink, setStampsByDrink] = useState<StampsByDrinkData[]>([]);
  const [customerType, setCustomerType] = useState<CustomerTypeData>(defaultCustomerType);
  const [funnelData, setFunnelData] = useState<StampCardFunnelData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStatistics[]>([]);

  const { myCafe } = useCafe();

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!myCafe?.id) {
      setError("No cafe found. Please complete your cafe setup first.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [
        metricsData,
        visitsData,
        drinksData,
        customerData,
        funnel,
        daily,
      ] = await Promise.all([
        analyticsService.getDashboardMetrics(myCafe.id, period),
        analyticsService.getVisitsChart(myCafe.id, period),
        analyticsService.getStampsByDrink(myCafe.id, period, 5),
        analyticsService.getCustomerTypeBreakdown(myCafe.id, period),
        analyticsService.getStampCardFunnel(myCafe.id, period),
        analyticsService.getDailyStatistics(myCafe.id, period, 7),
      ]);

      setMetrics(metricsData);
      setVisitsPerHour(visitsData);
      setStampsByDrink(drinksData);
      setCustomerType(customerData);
      setFunnelData(funnel);
      setDailyStats(daily);
    } catch (err: any) {
      console.error("Failed to fetch stamps & visits data:", err);
      setError(err.response?.data?.message || "Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id, period]);

  // Fetch data on mount and when period changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform visits data for area chart
  const visitsChartData = visitsPerHour.labels.map((label, index) => ({
    hour: label,
    visits: visitsPerHour.data[index] || 0,
  }));

  // Transform stamps by drink for pie chart
  const stampsByDrinkChartData = stampsByDrink.map((drink, index) => ({
    name: drink.name,
    value: drink.value,
    color: drinkColors[index % drinkColors.length],
  }));

  // Transform customer type for pie chart
  const customerTypeChartData = [
    { name: "Returning", value: customerType.returningPercentage, color: chartColors.primary },
    { name: "New", value: customerType.newPercentage, color: chartColors.secondary },
  ];

  // Helper to get change type
  const getChangeType = (value: number): "increase" | "decrease" => {
    return value >= 0 ? "increase" : "decrease";
  };

  // Loading state
  if (isLoading && metrics.stamps === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-72" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Metrics Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  // Error state (no cafe)
  if (error && !myCafe?.id) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Cafe Found</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

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

        {/* Error Alert (non-blocking) */}
        {error && myCafe?.id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Stamps"
            value={metrics.stamps.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.stamps), 
              type: getChangeType(metrics.changes.stamps) 
            }}
            icon={Stamp}
            className="animate-slide-up opacity-0 stagger-1"
          />
          <MetricCard
            title="Avg per User"
            value={metrics.avgStampsPerUser.toString()}
            change={{ 
              value: Math.abs(metrics.changes.avgStampsPerUser), 
              type: getChangeType(metrics.changes.avgStampsPerUser) 
            }}
            icon={TrendingUp}
            className="animate-slide-up opacity-0 stagger-2"
          />
          <MetricCard
            title="Free Drink Redemptions"
            value={metrics.redemptions.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.redemptions), 
              type: getChangeType(metrics.changes.redemptions) 
            }}
            icon={Gift}
            className="animate-slide-up opacity-0 stagger-3"
          />
          <MetricCard
            title="Unique Visitors"
            value={metrics.uniqueVisitors.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.visits), 
              type: getChangeType(metrics.changes.visits) 
            }}
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
              {visitsChartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No visit data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={visitsChartData}>
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
              )}
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
              {stampsByDrinkChartData.length === 0 || stampsByDrinkChartData.every(d => d.value === 0) ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No drink data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stampsByDrinkChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stampsByDrinkChartData.map((entry, index) => (
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
              )}
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
                        data={customerTypeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {customerTypeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-serif font-bold text-foreground">
                        {customerType.returningPercentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">Returning</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.primary }} />
                    <div>
                      <p className="font-medium text-foreground">Returning</p>
                      <p className="text-sm text-muted-foreground">
                        {customerType.returning} ({customerType.returningPercentage}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.secondary }} />
                    <div>
                      <p className="font-medium text-foreground">New</p>
                      <p className="text-sm text-muted-foreground">
                        {customerType.new} ({customerType.newPercentage}%)
                      </p>
                    </div>
                  </div>
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
              {funnelData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No funnel data available
                </div>
              ) : (
                <div className="space-y-3">
                  {funnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{stage.stage}</span>
                        <span className="text-muted-foreground">{stage.users} users</span>
                      </div>
                      <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${stage.percentage}%`,
                            backgroundColor: `hsl(20, 35%, ${45 + index * 8}%)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Daily Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyStats.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No daily statistics available
              </div>
            ) : (
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
                  {dailyStats.map((row) => (
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}