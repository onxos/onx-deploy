"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function AuditReviewPage() {
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
  const complianceCheckDelete =
    api.auditReview.complianceCheckDelete.useMutation({
      onSuccess: () => {
        utils.auditReview.complianceCheckList.invalidate();
        utils.auditReview.complianceCheckCount.invalidate();
      },
    });
  const [activeTab, setActiveTab] = useState("auditLog");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Audit Review Center</h1>
        <p className="text-muted-foreground">
          Audit logs and compliance checks
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "auditLog" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("auditLog")}
            type="button"
          >
            Audit Logs
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "complianceCheck" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("complianceCheck")}
            type="button"
          >
            Compliance Checks
          </button>
        </div>

        {activeTab === "auditLog" && (
          <div>
            <DataTable
              title="Audit Logs"
              description="Manage audit logs records"
              data={auditLogQuery.data}
              isLoading={auditLogQuery.isLoading}
              count={auditLogCount.data}
              onRefresh={() => auditLogQuery.refetch()}
              onDelete={(id) => auditLogDelete.mutate({ id })}
              columns={[
                { key: "action", label: "Action" },
                { key: "resource", label: "Resource" },
                { key: "actorId", label: "Actor Id" },
              ]}
            />
          </div>
        )}
        {activeTab === "complianceCheck" && (
          <div>
            <DataTable
              title="Compliance Checks"
              description="Manage compliance checks records"
              data={complianceCheckQuery.data}
              isLoading={complianceCheckQuery.isLoading}
              count={complianceCheckCount.data}
              onRefresh={() => complianceCheckQuery.refetch()}
              onDelete={(id) => complianceCheckDelete.mutate({ id })}
              columns={[
                { key: "name", label: "Name" },
                { key: "standard", label: "Standard" },
                { key: "result", label: "Result" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
