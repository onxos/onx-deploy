"use client";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function ExecutionRecordsPage() {
  const utils = api.useUtils();

  const auditLogQuery = api.auditReview.auditLogList.useQuery();
  const auditLogCount = api.auditReview.auditLogCount.useQuery();
  const auditLogDelete = api.auditReview.auditLogDelete.useMutation({
    onSuccess: () => {
      utils.auditReview.auditLogList.invalidate();
      utils.auditReview.auditLogCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Execution Records</h1>
        <p className="text-muted-foreground">
          Audit log and execution tracking
        </p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Audit Logs"
          description="Manage audit logs records"
          data={auditLogQuery.data}
          isLoading={auditLogQuery.isLoading}
          count={auditLogCount.data}
          onRefresh={() => auditLogQuery.refetch()}
          onDelete={(id: number) => auditLogDelete.mutate({ id })}
          columns={[
            { key: "action", label: "Action" },
            { key: "resource", label: "Resource" },
            { key: "resourceId", label: "Resource ID" },
            { key: "details", label: "Details" },
          ]}
        />
      </div>
    </div>
  );
}
