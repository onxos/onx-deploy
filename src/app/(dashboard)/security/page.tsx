"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function securityReviewPage() {
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

  const vulnerabilityTrackingQuery = api.securityReview.vulnerabilityTrackingList.useQuery();
  const vulnerabilityTrackingCount = api.securityReview.vulnerabilityTrackingCount.useQuery();
  const vulnerabilityTrackingDelete =
      api.securityReview.vulnerabilityTrackingDelete.useMutation({
    onSuccess: () => {
      utils.securityReview.vulnerabilityTrackingList.invalidate();
      utils.securityReview.vulnerabilityTrackingCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Security Review</h1>
        <p className="text-muted-foreground">
          Security audits and vulnerability tracking
        </p>
      </div>

      <Tabs defaultValue="securityAudit" className="px-6">
        <TabsList>
          <TabsTrigger value="securityAudit">Security Audits</TabsTrigger>
          <TabsTrigger value="vulnerabilityTracking">Vulnerabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="securityAudit">
          <DataTable
            title="Security Audits"
            description="Manage security audits records"
            data={securityAuditQuery.data}
            isLoading={securityAuditQuery.isLoading}
            count={securityAuditCount.data}
            onRefresh={() => securityAuditQuery.refetch()}
            onDelete={(id) => securityAuditDelete.mutate({ id })}
            columns={[{ key: 'auditType', label: 'Audit Type' }, { key: 'target', label: 'Target' }, { key: 'severity', label: 'Severity' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

        <TabsContent value="vulnerabilityTracking">
          <DataTable
            title="Vulnerabilities"
            description="Manage vulnerabilities records"
            data={vulnerabilityTrackingQuery.data}
            isLoading={vulnerabilityTrackingQuery.isLoading}
            count={vulnerabilityTrackingCount.data}
            onRefresh={() => vulnerabilityTrackingQuery.refetch()}
            onDelete={(id) => vulnerabilityTrackingDelete.mutate({ id })}
            columns={[{ key: 'cveId', label: 'Cve Id' }, { key: 'title', label: 'Title' }, { key: 'severity', label: 'Severity' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}