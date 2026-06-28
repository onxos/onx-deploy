"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function AtlasV5Page() {
  const utils = api.useUtils();
  const [activeTab, setActiveTab] = useState("retrospective");

  const retrospectiveQuery = api.evolution.retrospectiveList.useQuery();
  const retrospectiveCount = api.evolution.retrospectiveCount.useQuery();
  const retrospectiveDelete = api.evolution.retrospectiveDelete.useMutation({
    onSuccess: () => {
      utils.evolution.retrospectiveList.invalidate();
      utils.evolution.retrospectiveCount.invalidate();
      utils.evolution.improvementBacklogList.invalidate();
      utils.evolution.improvementBacklogCount.invalidate();
    },
  });

  const improvementQuery = api.evolution.improvementBacklogList.useQuery();
  const improvementCount = api.evolution.improvementBacklogCount.useQuery();
  const improvementDelete = api.evolution.improvementBacklogDelete.useMutation({
    onSuccess: () => {
      utils.evolution.retrospectiveList.invalidate();
      utils.evolution.retrospectiveCount.invalidate();
      utils.evolution.improvementBacklogList.invalidate();
      utils.evolution.improvementBacklogCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Atlas V5</h1>
        <p className="text-muted-foreground">
          Complete platform train overview
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
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "improvement" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("improvement")}
            type="button"
          >
            Improvements
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
              onDelete={(id: number) => retrospectiveDelete.mutate({ id })}
              columns={[
                { key: "title", label: "Title" },
                { key: "status", label: "Status" },
                { key: "priority", label: "Priority" },
                { key: "category", label: "Category" },
              ]}
            />
          </div>
        )}

        {activeTab === "improvement" && (
          <div>
            <DataTable
              title="Improvements"
              description="Manage improvements records"
              data={improvementQuery.data}
              isLoading={improvementQuery.isLoading}
              count={improvementCount.data}
              onRefresh={() => improvementQuery.refetch()}
              onDelete={(id: number) => improvementDelete.mutate({ id })}
              columns={[
                { key: "title", label: "Title" },
                { key: "status", label: "Status" },
                { key: "priority", label: "Priority" },
                { key: "effort", label: "Effort" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
