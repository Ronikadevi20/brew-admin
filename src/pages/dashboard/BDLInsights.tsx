import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
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
import { Camera, Eye, Users, TrendingUp, Coffee, Clock, Calendar } from "lucide-react";

const dailyTimelineData = [
  { date: "Dec 4", posts: 38, public: 15, friends: 18, private: 5 },
  { date: "Dec 5", posts: 45, public: 20, friends: 17, private: 8 },
  { date: "Dec 6", posts: 52, public: 22, friends: 21, private: 9 },
  { date: "Dec 7", posts: 61, public: 28, friends: 24, private: 9 },
  { date: "Dec 8", posts: 78, public: 35, friends: 30, private: 13 },
  { date: "Dec 9", posts: 85, public: 38, friends: 35, private: 12 },
  { date: "Dec 10", posts: 45, public: 20, friends: 18, private: 7 },
];

const engagementData = [
  { day: "Mon", postsAfterStamp: 12, repeatPosters: 8 },
  { day: "Tue", postsAfterStamp: 15, repeatPosters: 10 },
  { day: "Wed", postsAfterStamp: 22, repeatPosters: 14 },
  { day: "Thu", postsAfterStamp: 18, repeatPosters: 12 },
  { day: "Fri", postsAfterStamp: 28, repeatPosters: 18 },
  { day: "Sat", postsAfterStamp: 35, repeatPosters: 22 },
  { day: "Sun", postsAfterStamp: 30, repeatPosters: 20 },
];

const chartColors = {
  primary: "hsl(20, 35%, 40%)",
  secondary: "hsl(28, 60%, 55%)",
  tertiary: "hsl(35, 38%, 75%)",
};

export default function BDLInsights() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  const insightCards = [
    {
      title: "Most Photographed Drink",
      value: "Caramel Macchiato",
      icon: Coffee,
      description: "32 photos today",
    },
    {
      title: "Peak BDL Time",
      value: "3:00 - 5:00 PM",
      icon: Clock,
      description: "45% of daily posts",
    },
    {
      title: "Top Engagement Days",
      value: "Fri, Sat, Sun",
      icon: Calendar,
      description: "+65% vs weekdays",
    },
  ];

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
            <div className="space-y-4">
              {dailyTimelineData.map((day, index) => (
                <div
                  key={day.date}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-20 text-sm font-medium text-foreground">{day.date}</div>
                  <div className="flex-1">
                    <div className="flex gap-1 h-8">
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
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-lg font-semibold text-foreground">{day.posts}</span>
                    <span className="text-sm text-muted-foreground ml-1">posts</span>
                  </div>
                </div>
              ))}
            </div>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyTimelineData}>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
