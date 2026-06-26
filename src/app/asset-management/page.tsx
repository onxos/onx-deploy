"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function AssetManagementPage() {
  const utils = api.useUtils();

  const launchChecklistQuery = api.launch.launchChecklistList.useQuery();
  const launchChecklistCount = api.launch.launchChecklistCount.useQuery();
  const launchChecklistDelete = api.launch.launchChecklistDelete.useMutation({
    onSuccess: () => {
      utils.launch.launchChecklistList.invalidate();
      utils.launch.launchChecklistCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Asset Management</h1>
        <p className="text-muted-foreground">Launch checklists and asset tracking</p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Launch Checklists"
          description="Manage launch checklists records"
          data={launchChecklistQuery.data}
          isLoading={launchChecklistQuery.isLoading}
          count={launchChecklistCount.data}
          onRefresh={() => launchChecklistQuery.refetch()}
          onDelete={((id: number) => launchChecklistDelete.mutate({ id }))}
          columns={[{"key": "name", "label": "Name"}, {"key": "status", "label": "Status"}, {"key": "phase", "label": "Phase"}, {"key": "createdAt", "label": "Date"}]}
        />
      </div>
    </div>
  );
}
