"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function releaseMgmtPage() {
  const utils = api.useUtils();

  const releaseRecordQuery = api.releaseMgmt.releaseRecordList.useQuery();
  const releaseRecordCount = api.releaseMgmt.releaseRecordCount.useQuery();
  const releaseRecordDelete =
      api.releaseMgmt.releaseRecordDelete.useMutation({
    onSuccess: () => {
      utils.releaseMgmt.releaseRecordList.invalidate();
      utils.releaseMgmt.releaseRecordCount.invalidate();
    },
  });

  const deploymentTrackingQuery = api.releaseMgmt.deploymentTrackingList.useQuery();
  const deploymentTrackingCount = api.releaseMgmt.deploymentTrackingCount.useQuery();
  const deploymentTrackingDelete =
      api.releaseMgmt.deploymentTrackingDelete.useMutation({
    onSuccess: () => {
      utils.releaseMgmt.deploymentTrackingList.invalidate();
      utils.releaseMgmt.deploymentTrackingCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Release Management</h1>
        <p className="text-muted-foreground">
          Release records and deployment tracking
        </p>
      </div>

      <Tabs defaultValue="releaseRecord" className="px-6">
        <TabsList>
          <TabsTrigger value="releaseRecord">Releases</TabsTrigger>
          <TabsTrigger value="deploymentTracking">Deployments</TabsTrigger>
        </TabsList>

        <TabsContent value="releaseRecord">
          <DataTable
            title="Releases"
            description="Manage releases records"
            data={releaseRecordQuery.data}
            isLoading={releaseRecordQuery.isLoading}
            count={releaseRecordCount.data}
            onRefresh={() => releaseRecordQuery.refetch()}
            onDelete={(id) => releaseRecordDelete.mutate({ id })}
            columns={[{ key: 'version', label: 'Version' }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

        <TabsContent value="deploymentTracking">
          <DataTable
            title="Deployments"
            description="Manage deployments records"
            data={deploymentTrackingQuery.data}
            isLoading={deploymentTrackingQuery.isLoading}
            count={deploymentTrackingCount.data}
            onRefresh={() => deploymentTrackingQuery.refetch()}
            onDelete={(id) => deploymentTrackingDelete.mutate({ id })}
            columns={[{ key: 'releaseId', label: 'Release Id' }, { key: 'environment', label: 'Environment' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}