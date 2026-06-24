"use client";

import { api } from "@/trpc/react";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function stewardshipPage() {
  const utils = api.useUtils();

  const stewardshipRecordQuery = api.stewardship.stewardshipRecordList.useQuery();
  const stewardshipRecordCount = api.stewardship.stewardshipRecordCount.useQuery();
  const stewardshipRecordDelete = api.stewardship.stewardshipRecordDelete.useMutation({
    onSuccess: () => {
      utils.stewardship.stewardshipRecordList.invalidate();
      utils.stewardship.stewardshipRecordCount.invalidate();
    },
  });

  const continuityPlanQuery = api.stewardship.continuityPlanList.useQuery();
  const continuityPlanCount = api.stewardship.continuityPlanCount.useQuery();
  const continuityPlanDelete = api.stewardship.continuityPlanDelete.useMutation({
    onSuccess: () => {
      utils.stewardship.continuityPlanList.invalidate();
      utils.stewardship.continuityPlanCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Stewardship & Continuity</h1>
        <p className="text-muted-foreground">Stewardship records and continuity plans</p>
      </div>

      <Tabs defaultValue="stewardshipRecord" className="px-6">
        <TabsList>
          <TabsTrigger value="stewardshipRecord">Stewardship</TabsTrigger>
          <TabsTrigger value="continuityPlan">Continuity Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="stewardshipRecord">
          <DataTable
            title="Stewardship"
            description="Manage stewardship records"
            data={stewardshipRecordQuery.data}
            isLoading={stewardshipRecordQuery.isLoading}
            count={stewardshipRecordCount.data}
            onRefresh={() => stewardshipRecordQuery.refetch()}
            onDelete={(id) => stewardshipRecordDelete.mutate({ id })}
            columns={[{ key: 'responsibility', label: 'Responsibility' }, { key: 'scope', label: 'Scope' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

        <TabsContent value="continuityPlan">
          <DataTable
            title="Continuity Plans"
            description="Manage continuity plans records"
            data={continuityPlanQuery.data}
            isLoading={continuityPlanQuery.isLoading}
            count={continuityPlanCount.data}
            onRefresh={() => continuityPlanQuery.refetch()}
            onDelete={(id) => continuityPlanDelete.mutate({ id })}
            columns={[{ key: 'name', label: 'Name' }, { key: 'scenario', label: 'Scenario' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}