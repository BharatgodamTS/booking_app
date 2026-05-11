import { cn } from "@/lib/utils";

interface CapacityProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function CapacityProgressBar({
  current,
  total,
  className,
}: CapacityProgressBarProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isWarning = percentage > 90;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">Occupancy Rate</span>
        <span className={cn(
          "font-bold",
          isWarning ? "text-rose-600 animate-pulse" : "text-blue-600"
        )}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-in-out",
            isWarning ? "bg-rose-500" : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isWarning && (
        <p className="text-[10px] text-rose-500 font-semibold uppercase tracking-wider">
          Critical: Low Capacity Remaining
        </p>
      )}
    </div>
  );
}
