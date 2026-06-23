"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

function LoadingPanel() {
  const placeholders = [
    "dreams",
    "potentials",
    "goals",
    "execution",
    "velocity",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {placeholders.map((placeholder) => (
        <div
          className="h-28 animate-pulse rounded-lg border border-border bg-muted"
          key={placeholder}
        />
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail: string;
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function LifecycleAnalyticsView() {
  const summary = api.analytics.getLifecycleSummary.useQuery(undefined, {
    staleTime: 60_000,
  });

  if (summary.isLoading) {
    return (
      <PageWrapper
        title="Analytics"
        description="Dream-to-Evolution lifecycle metrics, conversion, progress, and execution trends."
      >
        <LoadingPanel />
      </PageWrapper>
    );
  }

  if (summary.error) {
    return (
      <PageWrapper
        title="Analytics"
        description="Dream-to-Evolution lifecycle metrics, conversion, progress, and execution trends."
      >
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Analytics unavailable
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Protected analytics data could not be loaded for this session.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const data = summary.data;

  if (!data) {
    return (
      <PageWrapper title="Analytics">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              No analytics data
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Lifecycle metrics appear after dreams, potentials, goals, and
              execution tasks exist.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Analytics"
      description="Dream-to-Evolution lifecycle metrics, conversion, progress, and execution trends."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          detail="Captured dream records"
          label="Dreams"
          value={data.kpis.dreams}
        />
        <MetricCard
          detail="Conversion-ready opportunities"
          label="Potentials"
          value={data.kpis.potentials}
        />
        <MetricCard
          detail="Active goal records"
          label="Goals"
          value={data.kpis.goals}
        />
        <MetricCard
          detail="Tasks not yet completed"
          label="Active execution"
          value={data.kpis.activeExecution}
        />
        <MetricCard
          detail="Completed tasks in baseline period"
          label="Completion velocity"
          value={data.kpis.completionVelocity}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              Dream conversion funnel
            </h2>
            <div className="mt-5 space-y-4">
              {data.conversionFunnel.map((stage) => (
                <div key={stage.key}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground">
                      {stage.label}
                    </span>
                    <span className="text-muted-foreground">
                      {stage.count} / {stage.totalRate}%
                    </span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(stage.totalRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              Goal progress charts
            </h2>
            <div className="mt-5 space-y-4">
              {data.goalProgress.map((goal) => (
                <div
                  className="rounded-md border border-border p-4"
                  key={goal.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {goal.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {goal.completedMilestones}/{goal.totalMilestones}{" "}
                        milestones completed
                      </p>
                    </div>
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                      {goal.milestoneProgress}%
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${goal.milestoneProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground">
            Execution velocity and trends
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {data.executionVelocity.map((point) => (
              <div
                className="rounded-md border border-border p-4"
                key={point.interval}
              >
                <p className="text-sm text-muted-foreground">
                  {point.interval}
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {point.completed}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Variance {point.variance >= 0 ? "+" : ""}
                  {point.variance}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
