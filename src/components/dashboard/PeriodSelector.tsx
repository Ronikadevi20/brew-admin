import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  value: "today" | "week" | "month";
  onChange: (value: "today" | "week" | "month") => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods = [
    { id: "today" as const, label: "Today" },
    { id: "week" as const, label: "This Week" },
    { id: "month" as const, label: "This Month" },
  ];

  return (
    <div className="inline-flex bg-secondary rounded-xl p-1 gap-1">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onChange(period.id)}
          className={cn(
            "toggle-chip",
            value === period.id ? "active" : ""
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
