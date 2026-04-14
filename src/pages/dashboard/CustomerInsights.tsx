import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Brain,
  Users,
  UserPlus,
  RefreshCw,
  Star,
  UserX,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { analyticsService } from "@/services/analytics.service";
import type {
  DashboardPeriod,
  CustomerSegments,
  CustomerIntelligence,
} from "@/types/analytics.types";
import { cn } from "@/lib/utils";

const defaultSegments: CustomerSegments = {
  new: 0,
  returning: 0,
  loyal: 0,
  atRisk: 0,
  total: 0,
};

const defaultIntelligence: CustomerIntelligence = {
  highlights: [],
  whatsChanged: [],
  recommendations: [],
};

export default function CustomerInsights() {
  const [period, setPeriod] = useState<DashboardPeriod>("week");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [segments, setSegments] = useState<CustomerSegments>(defaultSegments);
  const [intelligence, setIntelligence] = useState<CustomerIntelligence>(defaultIntelligence);

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
      const [segs, intel] = await Promise.all([
        analyticsService.getCustomerSegments(myCafe.id, period),
        analyticsService.getCustomerIntelligence(myCafe.id, period),
      ]);
      setSegments(segs);
      setIntelligence(intel);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load customer insights");
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const periodLabel =
    period === "today" ? "today" : period === "week" ? "this week" : "this month";

  if (!isCafeInitialized) {
    return <LoadingSkeleton />;
  }

  if (isLoading && segments.total === 0) {
    return <LoadingSkeleton />;
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

  const activeThisPeriod = segments.new + segments.returning;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Customer Insights</h1>
            <p className="text-muted-foreground mt-1">
              Understand who your customers are at {myCafe?.name || "your café"}
            </p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {error && myCafe?.id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Customer Segments ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Customer Segments</h2>
            {segments.total > 0 && (
              <span className="text-sm text-muted-foreground">
                {segments.total.toLocaleString()} total customers all-time
              </span>
            )}
          </div>

          {/* Two rows: period-specific on top, all-time on bottom */}
          <div className="space-y-3">
            {/* Row label: This period */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Active {periodLabel}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SegmentCard
                title="New Customers"
                count={segments.new}
                total={segments.total}
                description={`First-time visitors ${periodLabel}`}
                note="Their very first stamp at your café was in this period."
                icon={UserPlus}
                accentColor="blue"
              />
              <SegmentCard
                title="Returning Customers"
                count={segments.returning}
                total={segments.total}
                description={`Came back ${periodLabel}`}
                note="Had visited before this period AND visited again — not yet a card completer."
                icon={RefreshCw}
                accentColor="emerald"
              />
            </div>

            {/* Row label: All-time health */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-2">
              All-time customer health
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SegmentCard
                title="Loyal Customers"
                count={segments.loyal}
                total={segments.total}
                description="Completed at least one full stamp card"
                note="These customers have earned a free drink — your proven loyalists."
                icon={Star}
                accentColor="amber"
              />
              <SegmentCard
                title="At Risk"
                count={segments.atRisk}
                total={segments.total}
                description="No visit in the last 30 days"
                note="Haven't visited recently and did not visit in this period. May include loyal customers who are lapsing."
                icon={UserX}
                accentColor="red"
              />
            </div>
          </div>

          {/* Activity summary bar */}
          {segments.total > 0 && (
            <Card className="mt-4 bg-secondary/30 border-0">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Activity {periodLabel}</span>
                  <span className="text-sm text-muted-foreground">
                    {activeThisPeriod.toLocaleString()} active /{" "}
                    {segments.total.toLocaleString()} total
                  </span>
                </div>
                {/* Stacked bar: active (new + returning) vs inactive */}
                <div className="h-2.5 rounded-full overflow-hidden bg-secondary flex">
                  {segments.new > 0 && (
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(segments.new / segments.total) * 100}%` }}
                      title={`New: ${segments.new}`}
                    />
                  )}
                  {segments.returning > 0 && (
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(segments.returning / segments.total) * 100}%` }}
                      title={`Returning: ${segments.returning}`}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2.5">
                  {[
                    { label: `New (${segments.new})`, color: "bg-blue-500" },
                    { label: `Returning (${segments.returning})`, color: "bg-emerald-500" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <div className={cn("w-2.5 h-2.5 rounded-full", s.color)} />
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary border border-border" />
                    <span className="text-xs text-muted-foreground">
                      Not active this period ({(segments.total - activeThisPeriod).toLocaleString()})
                    </span>
                  </div>
                </div>
                {/* Tooltip note */}
                <p className="text-[11px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Loyal ({segments.loyal}) and At Risk ({segments.atRisk}) are all-time metrics and may
                  overlap with the active segments above.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ── Customer Intelligence ──────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-mocha" />
            Customer Intelligence
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Highlights */}
            <IntelCard
              title="Highlights"
              subtitle={`Key things happening ${periodLabel}`}
              icon={Lightbulb}
              iconColor="text-amber-500"
              items={intelligence.highlights}
              itemIcon={CheckCircle2}
              itemIconColor="text-emerald-500"
              emptyMessage="No highlight data yet."
            />

            {/* What's Changed */}
            <IntelCard
              title="What's Changed"
              subtitle="Compared to the previous period"
              icon={TrendingUp}
              iconColor="text-blue-500"
              items={intelligence.whatsChanged}
              itemIconFn={(text) => {
                const up =
                  text.includes("up") ||
                  text.includes("more") ||
                  text.includes("building") ||
                  text.includes("increased");
                const down =
                  text.includes("dropped") ||
                  text.includes("fewer") ||
                  text.includes("down");
                return up
                  ? { icon: TrendingUp, color: "text-emerald-500" }
                  : down
                  ? { icon: TrendingDown, color: "text-red-400" }
                  : { icon: Minus, color: "text-muted-foreground" };
              }}
              emptyMessage="Not enough data to compare yet."
            />

            {/* Recommendations */}
            <IntelCard
              title="Recommendations"
              subtitle="Actions to improve retention"
              icon={ArrowRight}
              iconColor="text-purple-500"
              items={intelligence.recommendations}
              itemIcon={AlertTriangle}
              itemIconColor="text-amber-400"
              emptyMessage="No recommendations at this time."
            />
          </div>
        </section>

        {/* ── Metrics Engine ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Metrics Engine</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricTile
              value={segments.total.toLocaleString()}
              label="All-time customers"
              icon={Users}
              color="bg-slate-50 text-slate-600"
            />
            <MetricTile
              value={activeThisPeriod.toLocaleString()}
              label={`Active ${periodLabel}`}
              icon={RefreshCw}
              color="bg-emerald-50 text-emerald-600"
            />
            <MetricTile
              value={
                segments.total > 0
                  ? `${Math.round((segments.loyal / segments.total) * 100)}%`
                  : "—"
              }
              label="Card completion rate"
              icon={Star}
              color="bg-amber-50 text-amber-600"
            />
            <MetricTile
              value={
                segments.total > 0
                  ? `${Math.round((segments.atRisk / segments.total) * 100)}%`
                  : "—"
              }
              label="At-risk rate"
              icon={UserX}
              color="bg-red-50 text-red-500"
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

type AccentColor = "blue" | "emerald" | "amber" | "red";

const accentMap: Record<AccentColor, { text: string; bg: string; bar: string }> = {
  blue: { text: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  red: { text: "text-red-500", bg: "bg-red-50", bar: "bg-red-400" },
};

interface SegmentCardProps {
  title: string;
  count: number;
  total: number;
  description: string;
  note: string;
  icon: React.ElementType;
  accentColor: AccentColor;
}

function SegmentCard({ title, count, total, description, note, icon: Icon, accentColor }: SegmentCardProps) {
  const acc = accentMap[accentColor];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", acc.bg)}>
            <Icon className={cn("w-5 h-5", acc.text)} />
          </div>
          <div className="text-right">
            <p className={cn("text-3xl font-serif font-bold", acc.text)}>
              {count.toLocaleString()}
            </p>
            {total > 0 && (
              <p className="text-xs text-muted-foreground">{pct}% of all customers</p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        {total > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", acc.bar)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">{note}</p>
      </CardContent>
    </Card>
  );
}

interface IntelCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  items: string[];
  itemIcon?: React.ElementType;
  itemIconColor?: string;
  itemIconFn?: (text: string) => { icon: React.ElementType; color: string };
  emptyMessage: string;
}

function IntelCard({
  title,
  subtitle,
  icon: HeaderIcon,
  iconColor,
  items,
  itemIcon: ItemIcon,
  itemIconColor,
  itemIconFn,
  emptyMessage,
}: IntelCardProps) {
  return (
    <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <HeaderIcon className={cn("w-4 h-4", iconColor)} />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          items.map((item, i) => {
            const resolved = itemIconFn
              ? itemIconFn(item)
              : { icon: ItemIcon!, color: itemIconColor! };
            const Icon = resolved.icon;
            return (
              <div key={i} className="flex gap-2.5">
                <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", resolved.color)} />
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

interface MetricTileProps {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

function MetricTile({ value, label, icon: Icon, color }: MetricTileProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", color.split(" ")[0])}>
            <Icon className={cn("w-4 h-4", color.split(" ")[1])} />
          </div>
          <div>
            <p className="text-xl font-serif font-bold text-foreground">{value}</p>
            <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-56 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </DashboardLayout>
  );
}
