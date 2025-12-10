import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function MetricCard({ title, value, change, icon: Icon, description, className }: MetricCardProps) {
  return (
    <div className={cn("metric-card group", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
          <Icon className="w-6 h-6 text-mocha group-hover:text-primary-foreground transition-colors duration-300" />
        </div>
        {change && (
          <span
            className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              change.type === "increase" 
                ? "text-success bg-success/10" 
                : "text-destructive bg-destructive/10"
            )}
          >
            {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-serif font-semibold text-foreground">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
