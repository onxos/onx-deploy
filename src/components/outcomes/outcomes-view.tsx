"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

export function OutcomesView() {
  const summary = api.outcome.getReviewSummary.useQuery(undefined, {
    staleTime: 60_000,
  });

  if (summary.isLoading) {
    return (
      <PageWrapper
        title="Outcomes"
        description="Completed goal outcomes, lessons learned, and stakeholder impact."
      >
        <div className="h-64 animate-pulse rounded-lg border border-border bg-muted" />
      </PageWrapper>
    );
  }

  if (summary.error || !summary.data) {
    return (
      <PageWrapper title="Outcomes">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Outcomes unavailable
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Protected outcome records could not be loaded.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const data = summary.data;

  if ((data.outcomes as readonly unknown[]).length === 0) {
    return (
      <PageWrapper title="Outcomes">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              No outcomes recorded
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Completed goal outcomes will appear after execution closes.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Outcomes"
      description="Completed goal outcomes, lessons learned, and stakeholder impact."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {data.outcomes.map((outcome) => (
            <Card key={outcome.id}>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {outcome.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {outcome.summary}
                    </p>
                  </div>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                    Quality {outcome.qualityScore}
                  </span>
                </div>
                <p className="mt-4 text-sm text-foreground">
                  Stakeholder impact: {outcome.impact}
                </p>
                <div className="mt-4 space-y-2">
                  {outcome.evidenceLinks.map((link) => (
                    <div
                      className="rounded-md border border-border p-3 text-sm text-muted-foreground"
                      key={link}
                    >
                      {link}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              Lessons learned
            </h2>
            <div className="mt-4 space-y-4">
              {data.lessons.map((lesson) => (
                <div
                  className="rounded-md border border-border p-4"
                  key={lesson.id}
                >
                  <p className="font-medium text-foreground">
                    {lesson.decision}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lesson.note}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Improvement: {lesson.improvement}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
