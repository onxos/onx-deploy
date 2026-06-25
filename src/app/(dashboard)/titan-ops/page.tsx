"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function TitanOpsPage() {
  const utils = api.useUtils();

  const titanMonitoringLogQuery =
    api.titanOps.titanMonitoringLogList.useQuery();
  const titanMonitoringLogCount =
    api.titanOps.titanMonitoringLogCount.useQuery();
  const titanMonitoringLogDelete =
    api.titanOps.titanMonitoringLogDelete.useMutation({
      onSuccess: () => {
        utils.titanOps.titanMonitoringLogList.invalidate();
        utils.titanOps.titanMonitoringLogCount.invalidate();
      },
    });

  const titanMaintenanceQuery = api.titanOps.titanMaintenanceList.useQuery();
  const titanMaintenanceCount = api.titanOps.titanMaintenanceCount.useQuery();
  const titanMaintenanceDelete =
    api.titanOps.titanMaintenanceDelete.useMutation({
      onSuccess: () => {
        utils.titanOps.titanMaintenanceList.invalidate();
        utils.titanOps.titanMaintenanceCount.invalidate();
      },
    });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Titan Operations</h1>
        <p className="text-muted-foreground">
          Titan monitoring logs and maintenance records
        </p>
      </div>

      <Tabs defaultValue="titanMonitoringLog" className="px-6">
        <TabsList>
          <TabsTrigger value="titanMonitoringLog">Monitoring Logs</TabsTrigger>
          <TabsTrigger value="titanMaintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="titanMonitoringLog">
          <DataTable
            title="Monitoring Logs"
            description="Manage monitoring logs records"
            data={titanMonitoringLogQuery.data}
            isLoading={titanMonitoringLogQuery.isLoading}
            count={titanMonitoringLogCount.data}
            onRefresh={() => titanMonitoringLogQuery.refetch()}
            onDelete={(id) => titanMonitoringLogDelete.mutate({ id })}
            columns={[
              { key: "titanId", label: "Titan Id" },
              { key: "event", label: "Event" },
              { key: "severity", label: "Severity" },
            ]}
          />
        </TabsContent>

        <TabsContent value="titanMaintenance">
          <DataTable
            title="Maintenance"
            description="Manage maintenance records"
            data={titanMaintenanceQuery.data}
            isLoading={titanMaintenanceQuery.isLoading}
            count={titanMaintenanceCount.data}
            onRefresh={() => titanMaintenanceQuery.refetch()}
            onDelete={(id) => titanMaintenanceDelete.mutate({ id })}
            columns={[
              { key: "titanId", label: "Titan Id" },
              { key: "type", label: "Type" },
              { key: "status", label: "Status" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
