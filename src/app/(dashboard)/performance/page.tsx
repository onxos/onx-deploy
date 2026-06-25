"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function PerformancePage() {
  const utils = api.useUtils();

  const performanceMetricQuery =
    api.performance.performanceMetricList.useQuery();
  const performanceMetricCount =
    api.performance.performanceMetricCount.useQuery();
  const performanceMetricDelete =
    api.performance.performanceMetricDelete.useMutation({
      onSuccess: () => {
        utils.performance.performanceMetricList.invalidate();
        utils.performance.performanceMetricCount.invalidate();
      },
    });

  const loadTestResultQuery = api.performance.loadTestResultList.useQuery();
  const loadTestResultCount = api.performance.loadTestResultCount.useQuery();
  const loadTestResultDelete = api.performance.loadTestResultDelete.useMutation(
    {
      onSuccess: () => {
        utils.performance.loadTestResultList.invalidate();
        utils.performance.loadTestResultCount.invalidate();
      },
    },
  );
  const [activeTab, setActiveTab] = useState("performanceMetric");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Performance Monitoring</h1>
        <p className="text-muted-foreground">
          Performance metrics and load test results
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "performanceMetric" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("performanceMetric")}
            type="button"
          >
            Performance Metrics
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "loadTestResult" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("loadTestResult")}
            type="button"
          >
            Load Tests
          </button>
        </div>

        {activeTab === "performanceMetric" && (
          <div>
            <DataTable
              title="Performance Metrics"
              description="Manage performance metrics records"
              data={performanceMetricQuery.data}
              isLoading={performanceMetricQuery.isLoading}
              count={performanceMetricCount.data}
              onRefresh={() => performanceMetricQuery.refetch()}
              onDelete={(id) => performanceMetricDelete.mutate({ id })}
              columns={[
                { key: "name", label: "Name" },
                { key: "value", label: "Value" },
                { key: "unit", label: "Unit" },
                { key: "isAlert", label: "Is Alert" },
              ]}
            />
          </div>
        )}
        {activeTab === "loadTestResult" && (
          <div>
            <DataTable
              title="Load Tests"
              description="Manage load tests records"
              data={loadTestResultQuery.data}
              isLoading={loadTestResultQuery.isLoading}
              count={loadTestResultCount.data}
              onRefresh={() => loadTestResultQuery.refetch()}
              onDelete={(id) => loadTestResultDelete.mutate({ id })}
              columns={[
                { key: "scenario", label: "Scenario" },
                { key: "concurrentUsers", label: "Concurrent Users" },
                { key: "avgResponseTime", label: "Avg Response Time" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
