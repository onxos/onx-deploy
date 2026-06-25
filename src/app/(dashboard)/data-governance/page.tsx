"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function DataGovernancePage() {
  const utils = api.useUtils();

  const dataGovernanceRuleQuery =
    api.dataGovernance.dataGovernanceRuleList.useQuery();
  const dataGovernanceRuleCount =
    api.dataGovernance.dataGovernanceRuleCount.useQuery();
  const dataGovernanceRuleDelete =
    api.dataGovernance.dataGovernanceRuleDelete.useMutation({
      onSuccess: () => {
        utils.dataGovernance.dataGovernanceRuleList.invalidate();
        utils.dataGovernance.dataGovernanceRuleCount.invalidate();
      },
    });

  const dataQualityCheckQuery =
    api.dataGovernance.dataQualityCheckList.useQuery();
  const dataQualityCheckCount =
    api.dataGovernance.dataQualityCheckCount.useQuery();
  const dataQualityCheckDelete =
    api.dataGovernance.dataQualityCheckDelete.useMutation({
      onSuccess: () => {
        utils.dataGovernance.dataQualityCheckList.invalidate();
        utils.dataGovernance.dataQualityCheckCount.invalidate();
      },
    });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Data Governance</h1>
        <p className="text-muted-foreground">
          Data governance rules and quality checks
        </p>
      </div>

      <Tabs defaultValue="dataGovernanceRule" className="px-6">
        <TabsList>
          <TabsTrigger value="dataGovernanceRule">Governance Rules</TabsTrigger>
          <TabsTrigger value="dataQualityCheck">Quality Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="dataGovernanceRule">
          <DataTable
            title="Governance Rules"
            description="Manage governance rules records"
            data={dataGovernanceRuleQuery.data}
            isLoading={dataGovernanceRuleQuery.isLoading}
            count={dataGovernanceRuleCount.data}
            onRefresh={() => dataGovernanceRuleQuery.refetch()}
            onDelete={(id) => dataGovernanceRuleDelete.mutate({ id })}
            columns={[
              { key: "name", label: "Name" },
              { key: "scope", label: "Scope" },
              { key: "status", label: "Status" },
            ]}
          />
        </TabsContent>

        <TabsContent value="dataQualityCheck">
          <DataTable
            title="Quality Checks"
            description="Manage quality checks records"
            data={dataQualityCheckQuery.data}
            isLoading={dataQualityCheckQuery.isLoading}
            count={dataQualityCheckCount.data}
            onRefresh={() => dataQualityCheckQuery.refetch()}
            onDelete={(id) => dataQualityCheckDelete.mutate({ id })}
            columns={[
              { key: "tableName", label: "Table Name" },
              { key: "checkType", label: "Check Type" },
              { key: "passed", label: "Passed" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
