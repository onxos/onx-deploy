"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function ReleaseMgmtPage() {
  const utils = api.useUtils();

  const releaseRecordQuery = api.releaseMgmt.releaseRecordList.useQuery();
  const releaseRecordCount = api.releaseMgmt.releaseRecordCount.useQuery();
  const releaseRecordDelete = api.releaseMgmt.releaseRecordDelete.useMutation({
    onSuccess: () => {
      utils.releaseMgmt.releaseRecordList.invalidate();
      utils.releaseMgmt.releaseRecordCount.invalidate();
    },
  });

  const deploymentTrackingQuery =
    api.releaseMgmt.deploymentTrackingList.useQuery();
  const deploymentTrackingCount =
    api.releaseMgmt.deploymentTrackingCount.useQuery();
  const deploymentTrackingDelete =
    api.releaseMgmt.deploymentTrackingDelete.useMutation({
      onSuccess: () => {
        utils.releaseMgmt.deploymentTrackingList.invalidate();
        utils.releaseMgmt.deploymentTrackingCount.invalidate();
      },
    });
  const [activeTab, setActiveTab] = useState("releaseRecord");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Release Management</h1>
        <p className="text-muted-foreground">
          Release records and deployment tracking
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "releaseRecord" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("releaseRecord")}
            type="button"
          >
            Releases
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "deploymentTracking" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("deploymentTracking")}
            type="button"
          >
            Deployments
          </button>
        </div>

        {activeTab === "releaseRecord" && (
          <div>
            <DataTable
              title="Releases"
              description="Manage releases records"
              data={releaseRecordQuery.data}
              isLoading={releaseRecordQuery.isLoading}
              count={releaseRecordCount.data}
              onRefresh={() => releaseRecordQuery.refetch()}
              onDelete={(id) => releaseRecordDelete.mutate({ id })}
              columns={[
                { key: "version", label: "Version" },
                { key: "name", label: "Name" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
        {activeTab === "deploymentTracking" && (
          <div>
            <DataTable
              title="Deployments"
              description="Manage deployments records"
              data={deploymentTrackingQuery.data}
              isLoading={deploymentTrackingQuery.isLoading}
              count={deploymentTrackingCount.data}
              onRefresh={() => deploymentTrackingQuery.refetch()}
              onDelete={(id) => deploymentTrackingDelete.mutate({ id })}
              columns={[
                { key: "releaseId", label: "Release Id" },
                { key: "environment", label: "Environment" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
