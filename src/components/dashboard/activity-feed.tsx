import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "./empty-state";

export type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
};

export function ActivityFeed({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent activity
          </h2>
          <p className="text-sm text-muted-foreground">
            Latest records from the active ONX data layer.
          </p>
        </div>
        {items.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Activity will appear here once corpus, gap, or SECH records are present."
          />
        ) : (
          <ol className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                  <time className={cn("text-xs text-muted-foreground")}>
                    {item.timestamp}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
