import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Stamp,
  Gift,
  Clock,
  CheckCircle,
  Users,
  AlertCircle,
  ArrowRight,
  Camera,
} from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { analyticsService } from "@/services/analytics.service";
import type {
  AllTimeStampsStats,
  StampCardFunnelData,
  EngagementJourneyStep,
  CustomerTypeData,
} from "@/types/analytics.types";

const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 65%)",
  quaternary: "hsl(8, 31%, 33%)",
};

const defaultStats: AllTimeStampsStats = {
  totalStamps: 0,
  freeDrinksRedeemed: 0,
  avgCompletionTimeDays: null,
  cardsCompleted: 0,
};

const defaultCustomerType: CustomerTypeData = {
  returning: 0,
  new: 0,
  returningPercentage: 0,
  newPercentage: 0,
};

export default function StampsVisits() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AllTimeStampsStats>(defaultStats);
  const [funnelData, setFunnelData] = useState<StampCardFunnelData[]>([]);
  const [journeyData, setJourneyData] = useState<EngagementJourneyStep[]>([]);
  const [customerType, setCustomerType] = useState<CustomerTypeData>(defaultCustomerType);

  const { myCafe, isInitialized: isCafeInitialized } = useCafe();

  const fetchData = useCallback(async () => {
    if (!myCafe?.id) {
      setError("No cafe found. Please complete your cafe setup first.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [allTimeStats, funnel, journey, custType] = await Promise.all([
        analyticsService.getAllTimeStampsStats(myCafe.id),
        analyticsService.getStampCardFunnelDynamic(myCafe.id),
        analyticsService.getEngagementJourney(myCafe.id),
        analyticsService.getCustomerTypeBreakdown(myCafe.id, "month"),
      ]);

      setStats(allTimeStats);
      setFunnelData(funnel);
      setJourneyData(journey);
      setCustomerType(custType);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const customerTypeChartData = [
    { name: "Returning", value: customerType.returningPercentage, color: chartColors.primary },
    { name: "New", value: customerType.newPercentage, color: chartColors.secondary },
  ];

  const funnelColors = [
    "hsl(20, 35%, 40%)",
    "hsl(22, 42%, 47%)",
    "hsl(26, 52%, 54%)",
    "hsl(30, 62%, 62%)",
    "hsl(35, 38%, 72%)",
  ];

  if (!isCafeInitialized) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading && stats.totalStamps === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (isCafeInitialized && error && !myCafe?.id) {
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

  const maxJourneyCount = Math.max(...journeyData.map((s) => s.count), 1);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Stamps & Visits</h1>
          <p className="text-muted-foreground mt-1">
            All-time loyalty and engagement overview for {myCafe?.name || "your café"}
          </p>
        </div>

        {error && myCafe?.id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Metric Cards — All-Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Stamps"
            value={stats.totalStamps.toLocaleString()}
            icon={Stamp}
            description="All-time stamps collected"
            className="animate-slide-up opacity-0 stagger-1"
          />
          <MetricCard
            title="Free Drinks Redeemed"
            value={stats.freeDrinksRedeemed.toLocaleString()}
            icon={Gift}
            description="All-time rewards claimed"
            className="animate-slide-up opacity-0 stagger-2"
          />
          <MetricCard
            title="Avg Completion Time"
            value={
              stats.avgCompletionTimeDays !== null
                ? `${stats.avgCompletionTimeDays}d`
                : "—"
            }
            icon={Clock}
            description="Days to complete a stamp card"
            className="animate-slide-up opacity-0 stagger-3"
          />
          <MetricCard
            title="Cards Completed"
            value={stats.cardsCompleted.toLocaleString()}
            icon={CheckCircle}
            description="All-time loyalty cards finished"
            className="animate-slide-up opacity-0 stagger-4"
          />
        </div>

        {/* Stamp Card Completion Funnel + Returning vs New */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-mocha" />
                Stamp Card Completion Funnel
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                All-time — how customers progress through the loyalty card
              </p>
            </CardHeader>
            <CardContent>
              {funnelData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No stamp card data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {funnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{stage.stage}</span>
                        <span className="text-muted-foreground">
                          {stage.users.toLocaleString()} users · {stage.percentage}%
                        </span>
                      </div>
                      <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${Math.max(stage.percentage, 2)}%`,
                            backgroundColor: funnelColors[index % funnelColors.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Returning vs New Customers */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-mocha" />
                Returning vs New Customers
              </CardTitle>
              <p className="text-sm text-muted-foreground">Based on last 30 days of visits</p>
            </CardHeader>
            <CardContent>
              {customerType.returning + customerType.new === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                  No customer data available
                </div>
              ) : (
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
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: chartColors.primary }}
                      />
                      <div>
                        <p className="font-medium text-foreground">Returning</p>
                        <p className="text-sm text-muted-foreground">
                          {customerType.returning} ({customerType.returningPercentage}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: chartColors.secondary }}
                      />
                      <div>
                        <p className="font-medium text-foreground">New</p>
                        <p className="text-sm text-muted-foreground">
                          {customerType.new} ({customerType.newPercentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Engagement Journey Funnel */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-mocha" />
              Stamp-to-Reward Journey
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              All-time — how customers move through your loyalty ecosystem
            </p>
          </CardHeader>
          <CardContent>
            {journeyData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No journey data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {journeyData.map((step, index) => {
                  const maxCount = Math.max(...journeyData.map((s) => s.count), 1);
                  const pct = maxCount > 0 ? Math.round((step.count / maxCount) * 100) : 0;
                  return (
                    <div key={step.stage} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{step.stage}</span>
                        <span className="text-muted-foreground">
                          {step.count.toLocaleString()} · {pct}%
                        </span>
                      </div>
                      <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, 2)}%`,
                            backgroundColor: funnelColors[index % funnelColors.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stamp Progress Distribution (horizontal bar) */}
        {funnelData.length > 0 && (
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-mocha" />
                Stamp Progress Distribution
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Where your customers currently sit in their stamp journey
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={Math.max(200, funnelData.length * 52)}>
                <BarChart
                  data={[...funnelData].reverse()}
                  layout="vertical"
                  margin={{ left: 16, right: 32 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(35, 25%, 88%)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(20, 20%, 45%)"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    stroke="hsl(20, 20%, 45%)"
                    fontSize={11}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(35, 25%, 88%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Users"]}
                  />
                  <Bar dataKey="users" radius={[0, 6, 6, 0]}>
                    {[...funnelData].reverse().map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={funnelColors[index % funnelColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
