"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
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
  const [activeTab, setActiveTab] = useState("retrospective");

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

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "retrospective" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("retrospective")}
            type="button"
          >
            Retrospectives
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "improvementBacklog" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("improvementBacklog")}
            type="button"
          >
            Improvement Backlog
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "patternDetection" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("patternDetection")}
            type="button"
          >
            Pattern Detection
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "recommendation" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("recommendation")}
            type="button"
          >
            Recommendations
          </button>
        </div>

        {activeTab === "retrospective" && (
          <div>
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
          </div>
        )}
        {activeTab === "improvementBacklog" && (
          <div>
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
          </div>
        )}
        {activeTab === "patternDetection" && (
          <div>
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
          </div>
        )}
        {activeTab === "recommendation" && (
          <div>
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
          </div>
        )}
      </div>
    </div>
  );
}
