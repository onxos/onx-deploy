"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function SecurityReviewPage() {
  const utils = api.useUtils();

  const securityAuditQuery = api.securityReview.securityAuditList.useQuery();
  const securityAuditCount = api.securityReview.securityAuditCount.useQuery();
  const securityAuditDelete =
    api.securityReview.securityAuditDelete.useMutation({
      onSuccess: () => {
        utils.securityReview.securityAuditList.invalidate();
        utils.securityReview.securityAuditCount.invalidate();
      },
    });

  const vulnerabilityTrackingQuery =
    api.securityReview.vulnerabilityTrackingList.useQuery();
  const vulnerabilityTrackingCount =
    api.securityReview.vulnerabilityTrackingCount.useQuery();
  const vulnerabilityTrackingDelete =
    api.securityReview.vulnerabilityTrackingDelete.useMutation({
      onSuccess: () => {
        utils.securityReview.vulnerabilityTrackingList.invalidate();
        utils.securityReview.vulnerabilityTrackingCount.invalidate();
      },
    });
  const [activeTab, setActiveTab] = useState("securityAudit");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Security Review</h1>
        <p className="text-muted-foreground">
          Vulnerability tracking and security audits
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "securityAudit" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("securityAudit")}
            type="button"
          >
            Security Audits
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "vulnerabilityTracking" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("vulnerabilityTracking")}
            type="button"
          >
            Vulnerabilities
          </button>
        </div>

        {activeTab === "securityAudit" && (
          <div>
            <DataTable
              title="Security Audits"
              description="Manage security audits records"
              data={securityAuditQuery.data}
              isLoading={securityAuditQuery.isLoading}
              count={securityAuditCount.data}
              onRefresh={() => securityAuditQuery.refetch()}
              onDelete={(id) => securityAuditDelete.mutate({ id })}
              columns={[
                { key: "auditType", label: "Audit Type" },
                { key: "target", label: "Target" },
                { key: "severity", label: "Severity" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
        {activeTab === "vulnerabilityTracking" && (
          <div>
            <DataTable
              title="Vulnerabilities"
              description="Manage vulnerabilities records"
              data={vulnerabilityTrackingQuery.data}
              isLoading={vulnerabilityTrackingQuery.isLoading}
              count={vulnerabilityTrackingCount.data}
              onRefresh={() => vulnerabilityTrackingQuery.refetch()}
              onDelete={(id) => vulnerabilityTrackingDelete.mutate({ id })}
              columns={[
                { key: "cveId", label: "Cve Id" },
                { key: "title", label: "Title" },
                { key: "severity", label: "Severity" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
