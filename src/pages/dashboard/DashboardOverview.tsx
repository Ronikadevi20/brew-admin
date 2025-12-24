import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import {
  VisitsLineChart,
  StampsBarChart,
  BDLVisibilityPieChart,
  PeakHoursHeatmap,
} from "@/components/dashboard/Charts";
import { Users, Stamp, Camera, UserPlus, Clock, Activity, AlertCircle } from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardOverview() {
  const { myCafe } = useCafe();
  const {
    period,
    setPeriod,
    metrics,
    visitsData,
    stampsData,
    bdlVisibility,
    peakHours,
    isLoading,
    error,
  } = useDashboard();

  // Helper to determine change type (only increase or decrease)
  const getChangeType = (value: number): "increase" | "decrease" => {
    return value >= 0 ? "increase" : "decrease";
  };

  // Render loading skeletons
  if (isLoading && !metrics.visits) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Metrics Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
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
        </div>
      </DashboardLayout>
    );
  }

  // Render error state
  if (error && !myCafe?.id) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Cafe Found</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
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
            <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening at {myCafe?.name || "your café"}.
            </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <MetricCard
            title="Total Visits"
            value={metrics.visits.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.visits), 
              type: getChangeType(metrics.changes.visits) 
            }}
            icon={Users}
            className="animate-slide-up opacity-0 stagger-1"
          />
          <MetricCard
            title="Stamps Collected"
            value={metrics.stamps.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.stamps), 
              type: getChangeType(metrics.changes.stamps) 
            }}
            icon={Stamp}
            className="animate-slide-up opacity-0 stagger-2"
          />
          <MetricCard
            title="BDL Posts"
            value={metrics.bdlPosts.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.bdlPosts), 
              type: getChangeType(metrics.changes.bdlPosts) 
            }}
            icon={Camera}
            className="animate-slide-up opacity-0 stagger-3"
          />
          <MetricCard
            title="New Users"
            value={metrics.newUsers.toLocaleString()}
            change={{ 
              value: Math.abs(metrics.changes.newUsers), 
              type: getChangeType(metrics.changes.newUsers) 
            }}
            icon={UserPlus}
            className="animate-slide-up opacity-0 stagger-4"
          />
          <MetricCard
            title="Peak Hour"
            value={metrics.peakHour}
            icon={Clock}
            description="Most active time"
            className="animate-slide-up opacity-0 stagger-5"
          />
          <MetricCard
            title="Avg. Frequency"
            value={`${metrics.avgFrequency}x`}
            change={{ 
              value: Math.abs(metrics.changes.avgFrequency), 
              type: getChangeType(metrics.changes.avgFrequency) 
            }}
            icon={Activity}
            description="Visits per user"
            className="animate-slide-up opacity-0 [animation-delay:0.6s]"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitsLineChart data={visitsData} period={period} />
          <StampsBarChart data={stampsData} period={period} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BDLVisibilityPieChart data={bdlVisibility} />
          <PeakHoursHeatmap data={peakHours} />
        </div>
      </div>
    </DashboardLayout>
  );
}