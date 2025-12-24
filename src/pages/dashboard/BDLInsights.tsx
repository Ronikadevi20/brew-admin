import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Camera, Eye, TrendingUp, Coffee, Clock, Calendar, AlertCircle } from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { analyticsService } from "@/services/analytics.service";
import type { 
  DashboardPeriod,
  BDLTimelineData, 
  BDLEngagementData, 
  BDLPeakTimesData,
  DrinkPopularityData,
} from "@/types/analytics.types";

const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 75%)",
};

// Default empty data
const defaultPeakTimes: BDLPeakTimesData = {
  peakTime: "N/A",
  peakDays: [],
  weekdayAvg: 0,
  weekendAvg: 0,
};

export default function BDLInsights() {
  const [period, setPeriod] = useState<DashboardPeriod>("week");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [timelineData, setTimelineData] = useState<BDLTimelineData[]>([]);
  const [engagementData, setEngagementData] = useState<BDLEngagementData[]>([]);
  const [peakTimes, setPeakTimes] = useState<BDLPeakTimesData>(defaultPeakTimes);
  const [topDrinks, setTopDrinks] = useState<DrinkPopularityData[]>([]);

  const { myCafe } = useCafe();

  // Fetch BDL analytics data
  const fetchBDLData = useCallback(async () => {
    if (!myCafe?.id) {
      setError("No cafe found. Please complete your cafe setup first.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [timeline, engagement, peak, drinks] = await Promise.all([
        analyticsService.getBDLTimeline(myCafe.id, period),
        analyticsService.getBDLEngagement(myCafe.id, period),
        analyticsService.getBDLPeakTimes(myCafe.id, period),
        analyticsService.getMostPhotographedDrinks(myCafe.id, period, 5),
      ]);

      setTimelineData(timeline);
      setEngagementData(engagement);
      setPeakTimes(peak);
      setTopDrinks(drinks);
    } catch (err: any) {
      console.error("Failed to fetch BDL data:", err);
      setError(err.response?.data?.message || "Failed to load BDL analytics");
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id, period]);

  // Fetch data on mount and when period changes
  useEffect(() => {
    fetchBDLData();
  }, [fetchBDLData]);

  // Calculate weekend vs weekday comparison
  const weekendComparison = peakTimes.weekdayAvg > 0 
    ? Math.round(((peakTimes.weekendAvg - peakTimes.weekdayAvg) / peakTimes.weekdayAvg) * 100)
    : 0;

  // Insight cards data
  const insightCards = [
    {
      title: "Most Photographed Drink",
      value: topDrinks[0]?.drinkName || "No data",
      icon: Coffee,
      description: topDrinks[0] ? `${topDrinks[0].count} photos (${topDrinks[0].percentage}%)` : "Collect more data",
    },
    {
      title: "Peak BDL Time",
      value: peakTimes.peakTime,
      icon: Clock,
      description: `Avg ${peakTimes.weekendAvg} posts on weekends`,
    },
    {
      title: "Top Engagement Days",
      value: peakTimes.peakDays.join(", ") || "N/A",
      icon: Calendar,
      description: weekendComparison >= 0 
        ? `+${weekendComparison}% vs weekdays` 
        : `${weekendComparison}% vs weekdays`,
    },
  ];

  // Loading state
  if (isLoading && timelineData.length === 0) {
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

          {/* Insight Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          {/* Timeline Skeleton */}
          <Skeleton className="h-96 rounded-xl" />

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
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
            <h1 className="text-3xl font-serif font-bold text-foreground">BDL Insights</h1>
            <p className="text-muted-foreground mt-1">BeReal-style post analytics for your café</p>
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

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insightCards.map((card, index) => (
            <Card
              key={card.title}
              className="hover:shadow-coffee-xl transition-all duration-300 animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{card.title}</p>
                    <p className="text-2xl font-serif font-semibold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <card.icon className="w-6 h-6 text-mocha" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Timeline */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-mocha" />
              Daily BDL Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timelineData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No BDL posts in this period
              </div>
            ) : (
              <div className="space-y-4">
                {timelineData.map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-20 text-sm font-medium text-foreground">{day.date}</div>
                    <div className="flex-1">
                      <div className="flex gap-1 h-8">
                        {day.posts > 0 && (
                          <>
                            <div
                              className="bg-mocha rounded-l-lg transition-all hover:opacity-80"
                              style={{ width: `${(day.public / day.posts) * 100}%` }}
                              title={`Public: ${day.public}`}
                            />
                            <div
                              className="bg-caramel transition-all hover:opacity-80"
                              style={{ width: `${(day.friends / day.posts) * 100}%` }}
                              title={`Friends: ${day.friends}`}
                            />
                            <div
                              className="bg-latte rounded-r-lg transition-all hover:opacity-80"
                              style={{ width: `${(day.private / day.posts) * 100}%` }}
                              title={`Private: ${day.private}`}
                            />
                          </>
                        )}
                        {day.posts === 0 && (
                          <div className="flex-1 bg-muted/50 rounded-lg" />
                        )}
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-lg font-semibold text-foreground">{day.posts}</span>
                      <span className="text-sm text-muted-foreground ml-1">posts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-mocha rounded" />
                <span className="text-sm text-muted-foreground">Public</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-caramel rounded" />
                <span className="text-sm text-muted-foreground">Friends-only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-latte rounded" />
                <span className="text-sm text-muted-foreground">Private</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stacked Bar Chart */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-mocha" />
                Visibility Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
                    <XAxis dataKey="date" stroke="hsl(20, 20%, 45%)" fontSize={12} />
                    <YAxis stroke="hsl(20, 20%, 45%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(35, 25%, 88%)",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="public" stackId="a" fill={chartColors.primary} name="Public" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="friends" stackId="a" fill={chartColors.secondary} name="Friends" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="private" stackId="a" fill={chartColors.tertiary} name="Private" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Engagement Chart */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-mocha" />
                User Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {engagementData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No engagement data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 25%, 88%)" />
                    <XAxis dataKey="day" stroke="hsl(20, 20%, 45%)" fontSize={12} />
                    <YAxis stroke="hsl(20, 20%, 45%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(35, 25%, 88%)",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="postsAfterStamp"
                      stroke={chartColors.primary}
                      strokeWidth={3}
                      name="Posts after stamp"
                      dot={{ fill: chartColors.primary }}
                    />
                    <Line
                      type="monotone"
                      dataKey="repeatPosters"
                      stroke={chartColors.secondary}
                      strokeWidth={3}
                      name="Repeat posters"
                      dot={{ fill: chartColors.secondary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Drinks Section */}
        {topDrinks.length > 0 && (
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-mocha" />
                Most Photographed Drinks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDrinks.map((drink, index) => (
                  <div key={drink.drinkName} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{drink.drinkName}</span>
                        <span className="text-sm text-muted-foreground">{drink.count} photos</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-mocha to-caramel rounded-full transition-all duration-500"
                          style={{ width: `${drink.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                      {drink.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}