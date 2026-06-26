"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function QualityAssurancePage() {
  const utils = api.useUtils();
  const [activeTab, setActiveTab] = useState("dataQualityCheck");

  const dataQualityCheckQuery = api.dataGovernance.dataQualityCheckList.useQuery();
  const dataQualityCheckCount = api.dataGovernance.dataQualityCheckCount.useQuery();
  const dataQualityCheckDelete = api.dataGovernance.dataQualityCheckDelete.useMutation({
    onSuccess: () => {
      utils.dataGovernance.dataQualityCheckList.invalidate();
      utils.dataGovernance.dataQualityCheckCount.invalidate();
      utils.dataGovernance.dataGovernanceRuleList.invalidate();
      utils.dataGovernance.dataGovernanceRuleCount.invalidate();
    },
  });

  const dataGovernanceRuleQuery = api.dataGovernance.dataGovernanceRuleList.useQuery();
  const dataGovernanceRuleCount = api.dataGovernance.dataGovernanceRuleCount.useQuery();
  const dataGovernanceRuleDelete = api.dataGovernance.dataGovernanceRuleDelete.useMutation({
    onSuccess: () => {
      utils.dataGovernance.dataQualityCheckList.invalidate();
      utils.dataGovernance.dataQualityCheckCount.invalidate();
      utils.dataGovernance.dataGovernanceRuleList.invalidate();
      utils.dataGovernance.dataGovernanceRuleCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Quality Assurance</h1>
        <p className="text-muted-foreground">Data quality checks and governance rules</p>
      </div>
      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "dataQualityCheck" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("dataQualityCheck")}
            type="button"
          >
            Quality Checks
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "dataGovernanceRule" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("dataGovernanceRule")}
            type="button"
          >
            Governance Rules
          </button>
        </div>

        {activeTab === "dataQualityCheck" && (
          <div>
            <DataTable
              title="Quality Checks"
              description="Manage quality checks records"
              data={dataQualityCheckQuery.data}
              isLoading={dataQualityCheckQuery.isLoading}
              count={dataQualityCheckCount.data}
              onRefresh={() => dataQualityCheckQuery.refetch()}
              onDelete={((id: number) => dataQualityCheckDelete.mutate({ id }))}
              columns={[{"key": "tableName", "label": "Table"}, {"key": "checkType", "label": "Check Type"}, {"key": "passed", "label": "Passed"}, {"key": "createdAt", "label": "Date"}]}
            />
          </div>
        )}

        {activeTab === "dataGovernanceRule" && (
          <div>
            <DataTable
              title="Governance Rules"
              description="Manage governance rules records"
              data={dataGovernanceRuleQuery.data}
              isLoading={dataGovernanceRuleQuery.isLoading}
              count={dataGovernanceRuleCount.data}
              onRefresh={() => dataGovernanceRuleQuery.refetch()}
              onDelete={((id: number) => dataGovernanceRuleDelete.mutate({ id }))}
              columns={[{"key": "name", "label": "Name"}, {"key": "scope", "label": "Scope"}, {"key": "status", "label": "Status"}, {"key": "createdAt", "label": "Date"}]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
