"use client";

import { api } from "@/trpc/react";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function operationsPage() {
  const utils = api.useUtils();

  const operationalMetricQuery = api.operations.operationalMetricList.useQuery();
  const operationalMetricCount = api.operations.operationalMetricCount.useQuery();
  const operationalMetricDelete = api.operations.operationalMetricDelete.useMutation({
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

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Operations Center</h1>
        <p className="text-muted-foreground">Operational metrics and system health monitoring</p>
      </div>

      <Tabs defaultValue="operationalMetric" className="px-6">
        <TabsList>
          <TabsTrigger value="operationalMetric">Operational Metrics</TabsTrigger>
          <TabsTrigger value="systemHealth">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="operationalMetric">
          <DataTable
            title="Operational Metrics"
            description="Manage operational metrics records"
            data={operationalMetricQuery.data}
            isLoading={operationalMetricQuery.isLoading}
            count={operationalMetricCount.data}
            onRefresh={() => operationalMetricQuery.refetch()}
            onDelete={(id) => operationalMetricDelete.mutate({ id })}
            columns={[{ key: 'name', label: 'Name' }, { key: 'value', label: 'Value' }, { key: 'unit', label: 'Unit' }, { key: 'source', label: 'Source' }]}
          />
        </TabsContent>

        <TabsContent value="systemHealth">
          <DataTable
            title="System Health"
            description="Manage system health records"
            data={systemHealthQuery.data}
            isLoading={systemHealthQuery.isLoading}
            count={systemHealthCount.data}
            onRefresh={() => systemHealthQuery.refetch()}
            onDelete={(id) => systemHealthDelete.mutate({ id })}
            columns={[{ key: 'component', label: 'Component' }, { key: 'status', label: 'Status' }, { key: 'latency', label: 'Latency' }, { key: 'errorRate', label: 'Error Rate' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}