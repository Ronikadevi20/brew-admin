import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import {
  VisitsLineChart,
  StampsBarChart,
  BDLVisibilityPieChart,
  PeakHoursHeatmap,
} from "@/components/dashboard/Charts";
import { Users, Stamp, Camera, UserPlus, Clock, Activity } from "lucide-react";

export default function DashboardOverview() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const metricsData = {
    today: {
      visits: 156,
      stamps: 234,
      bdlPosts: 45,
      newUsers: 23,
      peakHour: "5:00 PM",
      avgFrequency: 2.4,
    },
    week: {
      visits: 1089,
      stamps: 1678,
      bdlPosts: 312,
      newUsers: 156,
      peakHour: "5:00 PM",
      avgFrequency: 2.8,
    },
    month: {
      visits: 4356,
      stamps: 6892,
      bdlPosts: 1245,
      newUsers: 623,
      peakHour: "5:00 PM",
      avgFrequency: 3.2,
    },
  };

  const data = metricsData[period];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your café.</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <MetricCard
            title="Total Visits"
            value={data.visits.toLocaleString()}
            change={{ value: 12, type: "increase" }}
            icon={Users}
            className="animate-slide-up opacity-0 stagger-1"
          />
          <MetricCard
            title="Stamps Collected"
            value={data.stamps.toLocaleString()}
            change={{ value: 8, type: "increase" }}
            icon={Stamp}
            className="animate-slide-up opacity-0 stagger-2"
          />
          <MetricCard
            title="BDL Posts"
            value={data.bdlPosts}
            change={{ value: 15, type: "increase" }}
            icon={Camera}
            className="animate-slide-up opacity-0 stagger-3"
          />
          <MetricCard
            title="New Users"
            value={data.newUsers}
            change={{ value: 5, type: "increase" }}
            icon={UserPlus}
            className="animate-slide-up opacity-0 stagger-4"
          />
          <MetricCard
            title="Peak Hour"
            value={data.peakHour}
            icon={Clock}
            description="Most active time"
            className="animate-slide-up opacity-0 stagger-5"
          />
          <MetricCard
            title="Avg. Frequency"
            value={`${data.avgFrequency}x`}
            change={{ value: 3, type: "increase" }}
            icon={Activity}
            description="Visits per user"
            className="animate-slide-up opacity-0 [animation-delay:0.6s]"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitsLineChart />
          <StampsBarChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BDLVisibilityPieChart />
          <PeakHoursHeatmap />
        </div>
      </div>
    </DashboardLayout>
  );
}
