"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function EvolutionPage() {
  const utils = api.useUtils();

  const retrospectiveQuery = api.evolution.retrospectiveList.useQuery();
  const retrospectiveCount = api.evolution.retrospectiveCount.useQuery();
  const retrospectiveDelete = api.evolution.retrospectiveDelete.useMutation({
    onSuccess: () => {
      utils.evolution.retrospectiveList.invalidate();
      utils.evolution.retrospectiveCount.invalidate();
    },
  });

  const improvementBacklogQuery =
    api.evolution.improvementBacklogList.useQuery();
  const improvementBacklogCount =
    api.evolution.improvementBacklogCount.useQuery();
  const improvementBacklogDelete =
    api.evolution.improvementBacklogDelete.useMutation({
      onSuccess: () => {
        utils.evolution.improvementBacklogList.invalidate();
        utils.evolution.improvementBacklogCount.invalidate();
      },
    });

  const patternDetectionQuery = api.evolution.patternDetectionList.useQuery();
  const patternDetectionCount = api.evolution.patternDetectionCount.useQuery();
  const patternDetectionDelete =
    api.evolution.patternDetectionDelete.useMutation({
      onSuccess: () => {
        utils.evolution.patternDetectionList.invalidate();
        utils.evolution.patternDetectionCount.invalidate();
      },
    });

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
        <h1 className="text-3xl font-semibold">
          Evolution & Continuous Improvement
        </h1>
        <p className="text-muted-foreground">
          Retrospectives, improvement backlog, pattern detection, and
          recommendations
        </p>
      </div>

      <Tabs defaultValue="retrospective" className="px-6">
        <TabsList>
          <TabsTrigger value="retrospective">Retrospectives</TabsTrigger>
          <TabsTrigger value="improvementBacklog">
            Improvement Backlog
          </TabsTrigger>
          <TabsTrigger value="patternDetection">Pattern Detection</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="retrospective">
          <DataTable
            title="Retrospectives"
            description="Manage retrospectives records"
            data={retrospectiveQuery.data}
            isLoading={retrospectiveQuery.isLoading}
            count={retrospectiveCount.data}
            onRefresh={() => retrospectiveQuery.refetch()}
            onDelete={(id) => retrospectiveDelete.mutate({ id })}
            columns={[
              { key: "title", label: "Title" },
              { key: "goalReference", label: "Goal Reference" },
              { key: "status", label: "Status" },
              { key: "priority", label: "Priority" },
            ]}
          />
        </TabsContent>

        <TabsContent value="improvementBacklog">
          <DataTable
            title="Improvement Backlog"
            description="Manage improvement backlog records"
            data={improvementBacklogQuery.data}
            isLoading={improvementBacklogQuery.isLoading}
            count={improvementBacklogCount.data}
            onRefresh={() => improvementBacklogQuery.refetch()}
            onDelete={(id) => improvementBacklogDelete.mutate({ id })}
            columns={[
              { key: "title", label: "Title" },
              { key: "status", label: "Status" },
              { key: "priority", label: "Priority" },
              { key: "effort", label: "Effort" },
            ]}
          />
        </TabsContent>

        <TabsContent value="patternDetection">
          <DataTable
            title="Pattern Detection"
            description="Manage pattern detection records"
            data={patternDetectionQuery.data}
            isLoading={patternDetectionQuery.isLoading}
            count={patternDetectionCount.data}
            onRefresh={() => patternDetectionQuery.refetch()}
            onDelete={(id) => patternDetectionDelete.mutate({ id })}
            columns={[
              { key: "pattern", label: "Pattern" },
              { key: "type", label: "Type" },
              { key: "occurrences", label: "Occurrences" },
              { key: "confidence", label: "Confidence" },
            ]}
          />
        </TabsContent>

        <TabsContent value="recommendation">
          <DataTable
            title="Recommendations"
            description="Manage recommendations records"
            data={recommendationQuery.data}
            isLoading={recommendationQuery.isLoading}
            count={recommendationCount.data}
            onRefresh={() => recommendationQuery.refetch()}
            onDelete={(id) => recommendationDelete.mutate({ id })}
            columns={[
              { key: "title", label: "Title" },
              { key: "status", label: "Status" },
              { key: "cycle", label: "Cycle" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
