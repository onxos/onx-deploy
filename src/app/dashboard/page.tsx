"use client";

import {
  ActivityFeed,
  type ActivityItem,
} from "@/components/dashboard/activity-feed";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { WidgetGrid } from "@/components/dashboard/widget-grid";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";

const sechFallback = (["S", "E", "C", "H", "Council"] as const).map(
  (layer) => ({
    layer,
    status: "pending",
    message: "Awaiting live SECH status.",
    lastUpdate: null,
  }),
);

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "No timestamp";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const articles = api.civilization.listArticles.useQuery(
    { limit: 5 },
    { placeholderData: [] },
  );
  const gaps = api.gap.getGapSummary.useQuery(undefined, {
    placeholderData: { total: 0, byCategory: [], byStatus: [] },
  });
  const titans = api.titan.listTitans.useQuery(undefined, {
    placeholderData: [],
  });
  const sech = api.sech.getCurrentStatus.useQuery(undefined, {
    placeholderData: sechFallback,
  });

  const isLoading =
    articles.isLoading || gaps.isLoading || titans.isLoading || sech.isLoading;
  const hasError = articles.error || gaps.error || titans.error || sech.error;

  if (isLoading) return <DashboardSkeleton />;

  const activityItems: ActivityItem[] = [
    ...(articles.data ?? []).map((article) => ({
      id: `article-${article.id}`,
      label: article.title,
      detail: `Knowledge article in ${article.category}`,
      timestamp: formatDate(article.updatedAt ?? article.createdAt),
    })),
    ...(sech.data ?? []).slice(0, 3).map((status) => ({
      id: `sech-${status.layer}`,
      label: `SECH ${status.layer}: ${status.status}`,
      detail: status.message ?? "Layer reports no active message.",
      timestamp: formatDate(status.lastUpdate),
    })),
  ].slice(0, 8);

  return (
    <PageWrapper
      title="Dashboard"
      description="Overview of ONX civilization activity, system posture, and operator shortcuts."
      actions={<QuickActions />}
    >
      {hasError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          One or more dashboard data sources could not be loaded. Available
          widgets are still rendered from successful tRPC responses.
        </div>
      )}

      <WidgetGrid>
        <StatCard
          label="Knowledge articles"
          value={articles.data?.length ?? 0}
          change={articles.data && articles.data.length > 0 ? 100 : 0}
          icon="book"
        />
        <StatCard
          label="Gap items"
          value={gaps.data?.total ?? 0}
          change={gaps.data && gaps.data.total > 0 ? 54 : 0}
          icon="gaps"
        />
        <StatCard
          label="Registered titans"
          value={titans.data?.length ?? 0}
          icon="titan"
        />
        <StatCard
          label="SECH layers"
          value={sech.data?.length ?? 0}
          icon="shield"
        />
      </WidgetGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <ActivityFeed items={activityItems} className="lg:col-span-2" />
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-foreground">
              Quick status
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Active health signals from Gate 6 services.
            </p>
            {(sech.data?.length ?? 0) > 0 ? (
              <div className="mt-4 space-y-3">
                {sech.data?.map((layer) => (
                  <div
                    key={layer.layer}
                    className="flex min-h-11 items-center justify-between rounded-md border border-border px-3"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {layer.layer}
                    </span>
                    <span className="text-sm capitalize text-muted-foreground">
                      {layer.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="No SECH data"
                  description="Layer status records will appear after the civilization seed is available."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
