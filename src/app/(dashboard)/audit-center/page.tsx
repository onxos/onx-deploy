"use client";

import { api } from "@/trpc/react";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function auditReviewPage() {
  const utils = api.useUtils();

  const auditLogQuery = api.auditReview.auditLogList.useQuery();
  const auditLogCount = api.auditReview.auditLogCount.useQuery();
  const auditLogDelete = api.auditReview.auditLogDelete.useMutation({
    onSuccess: () => {
      utils.auditReview.auditLogList.invalidate();
      utils.auditReview.auditLogCount.invalidate();
    },
  });

  const complianceCheckQuery = api.auditReview.complianceCheckList.useQuery();
  const complianceCheckCount = api.auditReview.complianceCheckCount.useQuery();
  const complianceCheckDelete = api.auditReview.complianceCheckDelete.useMutation({
    onSuccess: () => {
      utils.auditReview.complianceCheckList.invalidate();
      utils.auditReview.complianceCheckCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Audit & Compliance</h1>
        <p className="text-muted-foreground">Audit logs and compliance checks</p>
      </div>

      <Tabs defaultValue="auditLog" className="px-6">
        <TabsList>
          <TabsTrigger value="auditLog">Audit Logs</TabsTrigger>
          <TabsTrigger value="complianceCheck">Compliance Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="auditLog">
          <DataTable
            title="Audit Logs"
            description="Manage audit logs records"
            data={auditLogQuery.data}
            isLoading={auditLogQuery.isLoading}
            count={auditLogCount.data}
            onRefresh={() => auditLogQuery.refetch()}
            onDelete={(id) => auditLogDelete.mutate({ id })}
            columns={[{ key: 'action', label: 'Action' }, { key: 'resource', label: 'Resource' }, { key: 'actorId', label: 'Actor Id' }]}
          />
        </TabsContent>

        <TabsContent value="complianceCheck">
          <DataTable
            title="Compliance Checks"
            description="Manage compliance checks records"
            data={complianceCheckQuery.data}
            isLoading={complianceCheckQuery.isLoading}
            count={complianceCheckCount.data}
            onRefresh={() => complianceCheckQuery.refetch()}
            onDelete={(id) => complianceCheckDelete.mutate({ id })}
            columns={[{ key: 'name', label: 'Name' }, { key: 'standard', label: 'Standard' }, { key: 'result', label: 'Result' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}