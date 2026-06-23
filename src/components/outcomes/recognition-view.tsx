"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

export function RecognitionView() {
  const summary = api.outcome.getReviewSummary.useQuery(undefined, {
    staleTime: 60_000,
  });

  if (summary.isLoading) {
    return (
      <PageWrapper
        title="Recognition"
        description="Achievement badges and leadership review signals."
      >
        <div className="h-64 animate-pulse rounded-lg border border-border bg-muted" />
      </PageWrapper>
    );
  }

  if (summary.error || !summary.data) {
    return (
      <PageWrapper title="Recognition">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-destructive">
              Recognition unavailable
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Protected recognition records could not be loaded.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const data = summary.data;

  return (
    <PageWrapper
      title="Recognition"
      description="Achievement badges and leadership review signals."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Outcomes</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {data.review.totalOutcomes}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Lessons</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {data.review.lessonCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Badges</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {data.review.recognitionCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Quality</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {Math.round(data.review.averageQuality)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.badges.map((badge) => (
          <Card key={badge.id}>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {badge.label}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {badge.reason}
                  </p>
                </div>
                <span className="rounded-md bg-emerald-100 px-2 py-1 text-sm font-semibold text-emerald-800">
                  {badge.signal}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Awarded to {badge.recipient} on {badge.awardedAt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
