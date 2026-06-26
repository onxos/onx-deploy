"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function StewardshipPage() {
  const utils = api.useUtils();

  const stewardshipRecordQuery =
    api.stewardship.stewardshipRecordList.useQuery();
  const stewardshipRecordCount =
    api.stewardship.stewardshipRecordCount.useQuery();
  const stewardshipRecordDelete =
    api.stewardship.stewardshipRecordDelete.useMutation({
      onSuccess: () => {
        utils.stewardship.stewardshipRecordList.invalidate();
        utils.stewardship.stewardshipRecordCount.invalidate();
      },
    });

  const continuityPlanQuery = api.stewardship.continuityPlanList.useQuery();
  const continuityPlanCount = api.stewardship.continuityPlanCount.useQuery();
  const continuityPlanDelete = api.stewardship.continuityPlanDelete.useMutation(
    {
      onSuccess: () => {
        utils.stewardship.continuityPlanList.invalidate();
        utils.stewardship.continuityPlanCount.invalidate();
      },
    },
  );
  const [activeTab, setActiveTab] = useState("stewardshipRecord");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Stewardship</h1>
        <p className="text-muted-foreground">
          Stewardship records and continuity plans
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "stewardshipRecord" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("stewardshipRecord")}
            type="button"
          >
            Stewardship
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "continuityPlan" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("continuityPlan")}
            type="button"
          >
            Continuity Plans
          </button>
        </div>

        {activeTab === "stewardshipRecord" && (
          <div>
            <DataTable
              title="Stewardship"
              description="Manage stewardship records"
              data={stewardshipRecordQuery.data}
              isLoading={stewardshipRecordQuery.isLoading}
              count={stewardshipRecordCount.data}
              onRefresh={() => stewardshipRecordQuery.refetch()}
              onDelete={(id) => stewardshipRecordDelete.mutate({ id })}
              columns={[
                { key: "responsibility", label: "Responsibility" },
                { key: "scope", label: "Scope" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
        {activeTab === "continuityPlan" && (
          <div>
            <DataTable
              title="Continuity Plans"
              description="Manage continuity plans records"
              data={continuityPlanQuery.data}
              isLoading={continuityPlanQuery.isLoading}
              count={continuityPlanCount.data}
              onRefresh={() => continuityPlanQuery.refetch()}
              onDelete={(id) => continuityPlanDelete.mutate({ id })}
              columns={[
                { key: "name", label: "Name" },
                { key: "scenario", label: "Scenario" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
