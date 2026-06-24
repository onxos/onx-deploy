"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function launchPage() {
  const utils = api.useUtils();

  const launchChecklistQuery = api.launch.launchChecklistList.useQuery();
  const launchChecklistCount = api.launch.launchChecklistCount.useQuery();
  const launchChecklistDelete =
      api.launch.launchChecklistDelete.useMutation({
    onSuccess: () => {
      utils.launch.launchChecklistList.invalidate();
      utils.launch.launchChecklistCount.invalidate();
    },
  });

  const postLaunchMonitoringQuery = api.launch.postLaunchMonitoringList.useQuery();
  const postLaunchMonitoringCount = api.launch.postLaunchMonitoringCount.useQuery();
  const postLaunchMonitoringDelete =
      api.launch.postLaunchMonitoringDelete.useMutation({
    onSuccess: () => {
      utils.launch.postLaunchMonitoringList.invalidate();
      utils.launch.postLaunchMonitoringCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Launch Readiness</h1>
        <p className="text-muted-foreground">
          Launch checklists and post-launch monitoring
        </p>
      </div>

      <Tabs defaultValue="launchChecklist" className="px-6">
        <TabsList>
          <TabsTrigger value="launchChecklist">Launch Checklist</TabsTrigger>
          <TabsTrigger value="postLaunchMonitoring">Post-Launch Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="launchChecklist">
          <DataTable
            title="Launch Checklist"
            description="Manage launch checklist records"
            data={launchChecklistQuery.data}
            isLoading={launchChecklistQuery.isLoading}
            count={launchChecklistCount.data}
            onRefresh={() => launchChecklistQuery.refetch()}
            onDelete={(id) => launchChecklistDelete.mutate({ id })}
            columns={[{ key: 'item', label: 'Item' }, { key: 'category', label: 'Category' }, { key: 'completed', label: 'Completed' }]}
          />
        </TabsContent>

        <TabsContent value="postLaunchMonitoring">
          <DataTable
            title="Post-Launch Monitoring"
            description="Manage post-launch monitoring records"
            data={postLaunchMonitoringQuery.data}
            isLoading={postLaunchMonitoringQuery.isLoading}
            count={postLaunchMonitoringCount.data}
            onRefresh={() => postLaunchMonitoringQuery.refetch()}
            onDelete={(id) => postLaunchMonitoringDelete.mutate({ id })}
            columns={[{ key: 'metric', label: 'Metric' }, { key: 'value', label: 'Value' }, { key: 'isHealthy', label: 'Is Healthy' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}