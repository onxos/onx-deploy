"use client";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function ComplianceChecksPage() {
  const utils = api.useUtils();

  const complianceCheckQuery = api.auditReview.complianceCheckList.useQuery();
  const complianceCheckCount = api.auditReview.complianceCheckCount.useQuery();
  const complianceCheckDelete =
    api.auditReview.complianceCheckDelete.useMutation({
      onSuccess: () => {
        utils.auditReview.complianceCheckList.invalidate();
        utils.auditReview.complianceCheckCount.invalidate();
      },
    });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Compliance Checks</h1>
        <p className="text-muted-foreground">
          Compliance verification and audit tracking
        </p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Compliance Checks"
          description="Manage compliance checks records"
          data={complianceCheckQuery.data}
          isLoading={complianceCheckQuery.isLoading}
          count={complianceCheckCount.data}
          onRefresh={() => complianceCheckQuery.refetch()}
          onDelete={(id: number) => complianceCheckDelete.mutate({ id })}
          columns={[
            { key: "name", label: "Name" },
            { key: "standard", label: "Standard" },
            { key: "result", label: "Result" },
            { key: "createdAt", label: "Date" },
          ]}
        />
      </div>
    </div>
  );
}
