"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function UserFeedbackPage() {
  const utils = api.useUtils();

  const recommendationQuery = api.evolution.recommendationList.useQuery();
  const recommendationCount = api.evolution.recommendationCount.useQuery();
  const recommendationDelete = api.evolution.recommendationDelete.useMutation({
    onSuccess: () => {
      utils.evolution.recommendationList.invalidate();
      utils.evolution.recommendationCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">User Feedback</h1>
        <p className="text-muted-foreground">Recommendations and user feedback tracking</p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Recommendations"
          description="Manage recommendations records"
          data={recommendationQuery.data}
          isLoading={recommendationQuery.isLoading}
          count={recommendationCount.data}
          onRefresh={() => recommendationQuery.refetch()}
          onDelete={((id: number) => recommendationDelete.mutate({ id }))}
          columns={[{"key": "title", "label": "Title"}, {"key": "status", "label": "Status"}, {"key": "priority", "label": "Priority"}, {"key": "createdAt", "label": "Date"}]}
        />
      </div>
    </div>
  );
}
