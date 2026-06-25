"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function OperationsPage() {
  const utils = api.useUtils();

  const operationalMetricQuery =
    api.operations.operationalMetricList.useQuery();
  const operationalMetricCount =
    api.operations.operationalMetricCount.useQuery();
  const operationalMetricDelete =
    api.operations.operationalMetricDelete.useMutation({
      onSuccess: () => {
        utils.operations.operationalMetricList.invalidate();
        utils.operations.operationalMetricCount.invalidate();
      },
    });

  const systemHealthQuery = api.operations.systemHealthList.useQuery();
  const systemHealthCount = api.operations.systemHealthCount.useQuery();
  const systemHealthDelete = api.operations.systemHealthDelete.useMutation({
    onSuccess: () => {
      utils.operations.systemHealthList.invalidate();
      utils.operations.systemHealthCount.invalidate();
    },
  });
  const [activeTab, setActiveTab] = useState("operationalMetric");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Operations</h1>
        <p className="text-muted-foreground">
          Operational metrics and system health
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "operationalMetric" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("operationalMetric")}
            type="button"
          >
            Operational Metrics
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "systemHealth" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("systemHealth")}
            type="button"
          >
            System Health
          </button>
        </div>

        {activeTab === "operationalMetric" && (
          <div>
            <DataTable
              title="Operational Metrics"
              description="Manage operational metrics records"
              data={operationalMetricQuery.data}
              isLoading={operationalMetricQuery.isLoading}
              count={operationalMetricCount.data}
              onRefresh={() => operationalMetricQuery.refetch()}
              onDelete={(id) => operationalMetricDelete.mutate({ id })}
              columns={[
                { key: "name", label: "Name" },
                { key: "value", label: "Value" },
                { key: "unit", label: "Unit" },
                { key: "source", label: "Source" },
              ]}
            />
          </div>
        )}
        {activeTab === "systemHealth" && (
          <div>
            <DataTable
              title="System Health"
              description="Manage system health records"
              data={systemHealthQuery.data}
              isLoading={systemHealthQuery.isLoading}
              count={systemHealthCount.data}
              onRefresh={() => systemHealthQuery.refetch()}
              onDelete={(id) => systemHealthDelete.mutate({ id })}
              columns={[
                { key: "component", label: "Component" },
                { key: "status", label: "Status" },
                { key: "latency", label: "Latency" },
                { key: "errorRate", label: "Error Rate" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
