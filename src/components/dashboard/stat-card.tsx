import type { RouteIcon } from "@/config/routes";
import { cn } from "@/lib/utils";
import { RouteIconMark } from "../layout/route-icon";
import { Card, CardContent } from "../ui/card";

interface StatCardProps {
  label: string;
  value: number | string;
  change?: number;
  icon: RouteIcon;
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <p
                className={cn(
                  "text-xs font-semibold",
                  change >= 0 ? "text-emerald-700" : "text-destructive",
                )}
              >
                {change >= 0 ? "+" : ""}
                {change}% from baseline
              </p>
            )}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <RouteIconMark icon={icon} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
