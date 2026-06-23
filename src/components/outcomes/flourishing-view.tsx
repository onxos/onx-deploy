"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

export function FlourishingView() {
  const summary = api.outcome.getReviewSummary.useQuery(undefined, {
    staleTime: 60_000,
  });

  if (summary.isLoading) {
    return (
      <PageWrapper
        title="Flourishing"
        description="Personal and institutional growth signals across outcomes and recognitions."
      >
        <div className="h-64 animate-pulse rounded-lg border border-border bg-muted" />
      </PageWrapper>
    );
  }

  if (summary.error || !summary.data) {
    return (
      <PageWrapper title="Flourishing">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Timeline unavailable
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Protected flourishing records could not be loaded.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Flourishing"
      description="Personal and institutional growth signals across outcomes and recognitions."
    >
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground">
            Flourishing timeline
          </h2>
          <div className="mt-5 space-y-4">
            {summary.data.flourishingTimeline.map((item) => (
              <div
                className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-[140px_1fr]"
                key={item.id}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.date}
                  </p>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {item.scope}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex rounded-md bg-muted px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
