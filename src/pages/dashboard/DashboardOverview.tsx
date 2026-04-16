import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import {
  StampsBarChart,
  RepeatRateTrendChart,
  VisitGapDistributionChart,
  LoyaltyProgressDistributionChart,
} from "@/components/dashboard/Charts";
import { Stamp, UserPlus, Gift, Users, RefreshCw, Activity, AlertCircle } from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardOverview() {
  const { myCafe, isInitialized: isCafeInitialized } = useCafe();
  const {
    period,
    setPeriod,
    metrics,
    stampsData,
    repeatRateTrend,
    visitGapDistribution,
    loyaltyProgress,
    isLoading,
    error,
  } = useDashboard();

  const getChangeType = (value: number): "increase" | "decrease" => {
    return value >= 0 ? "increase" : "decrease";
  };

  const getRepeatCustomerSubtext = () => {
    switch (period) {
      case "today": return "Returning customers today";
      case "week": return "% of customers who came back this week";
      case "month": return "% of customers who came back this month";
      default: return "Returning customers";
    }
  };

  const getActiveCustomerSubtext = () => {
    switch (period) {
      case "today": return "Visited today";
      case "week": return "Visited this week";
      case "month": return "Visited this month";
      default: return "Unique visitors";
    }
  };

  // Show skeleton while cafe context is still initializing
  if (!isCafeInitialized) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
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

  // Render loading skeletons
  if (isLoading && !metrics.stamps) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
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
            title="Repeat Customers"
            value={`${metrics.repeatCustomerRate}%`}
            change={{
              value: Math.abs(metrics.changes.repeatCustomerRate),
              type: getChangeType(metrics.changes.repeatCustomerRate),
            }}
            icon={RefreshCw}
            description={getRepeatCustomerSubtext()}
            className="animate-slide-up opacity-0 stagger-1"
          />
          <MetricCard
            title="Active Customers"
            value={metrics.activeCustomers.toLocaleString()}
            icon={Users}
            description={getActiveCustomerSubtext()}
            className="animate-slide-up opacity-0 stagger-2"
          />
          <MetricCard
            title="Stamps Collected"
            value={metrics.stamps.toLocaleString()}
            change={{
              value: Math.abs(metrics.changes.stamps),
              type: getChangeType(metrics.changes.stamps),
            }}
            icon={Stamp}
            className="animate-slide-up opacity-0 stagger-3"
          />
          <MetricCard
            title="New Users"
            value={metrics.newUsers.toLocaleString()}
            change={{
              value: Math.abs(metrics.changes.newUsers),
              type: getChangeType(metrics.changes.newUsers),
            }}
            icon={UserPlus}
            className="animate-slide-up opacity-0 stagger-4"
          />
          <MetricCard
            title="Rewards Redeemed"
            value={metrics.freeDrinksRedeemed.toLocaleString()}
            change={{
              value: Math.abs(metrics.changes.redemptions),
              type: getChangeType(metrics.changes.redemptions),
            }}
            icon={Gift}
            description="Rewards claimed"
            className="animate-slide-up opacity-0 stagger-5"
          />
          <MetricCard
            title="Rewards Completed"
            value={`${metrics.rewardCompletionRate}%`}
            change={{
              value: Math.abs(metrics.changes.rewardCompletionRate),
              type: getChangeType(metrics.changes.rewardCompletionRate),
            }}
            icon={Activity}
            description="Customers who finished loyalty"
            className="animate-slide-up opacity-0 [animation-delay:0.6s]"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StampsBarChart data={stampsData} period={period} />
          <RepeatRateTrendChart data={repeatRateTrend} period={period} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitGapDistributionChart data={visitGapDistribution} />
          <LoyaltyProgressDistributionChart data={loyaltyProgress} />
        </div>
      </div>
    </DashboardLayout>
  );
}
