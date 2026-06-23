"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

function toCsv(rows: string[][]) {
  return rows.map((row) => row.join(",")).join("\n");
}

export function LifecycleReportView() {
  const summary = api.analytics.getLifecycleSummary.useQuery(undefined, {
    staleTime: 60_000,
  });

  if (summary.isLoading) {
    return (
      <PageWrapper
        title="Reports"
        description="Reviewable lifecycle report exports with evidence references."
      >
        <div className="h-64 animate-pulse rounded-lg border border-border bg-muted" />
      </PageWrapper>
    );
  }

  if (summary.error || !summary.data) {
    return (
      <PageWrapper
        title="Reports"
        description="Reviewable lifecycle report exports with evidence references."
      >
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Report unavailable
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Protected report data could not be loaded for this session.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const report = summary.data.report;

  return (
    <PageWrapper
      title="Reports"
      description="Reviewable lifecycle report exports with evidence references."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Lifecycle CSV export
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Period: {report.period}
                </p>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-sm font-semibold text-emerald-800">
                Ready
              </span>
            </div>
            <pre className="mt-5 overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm text-foreground">
              {toCsv(report.csvRows)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              Evidence references
            </h2>
            <div className="mt-4 space-y-3">
              {report.evidenceReferences.map((reference) => (
                <div
                  className="rounded-md border border-border p-3 text-sm text-muted-foreground"
                  key={reference}
                >
                  {reference}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
