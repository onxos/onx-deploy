"use client";

import { api } from "@/trpc/react";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function enablementPage() {
  const utils = api.useUtils();

  const trainingMaterialQuery = api.enablement.trainingMaterialList.useQuery();
  const trainingMaterialCount = api.enablement.trainingMaterialCount.useQuery();
  const trainingMaterialDelete = api.enablement.trainingMaterialDelete.useMutation({
    onSuccess: () => {
      utils.enablement.trainingMaterialList.invalidate();
      utils.enablement.trainingMaterialCount.invalidate();
    },
  });

  const onboardingFlowQuery = api.enablement.onboardingFlowList.useQuery();
  const onboardingFlowCount = api.enablement.onboardingFlowCount.useQuery();
  const onboardingFlowDelete = api.enablement.onboardingFlowDelete.useMutation({
    onSuccess: () => {
      utils.enablement.onboardingFlowList.invalidate();
      utils.enablement.onboardingFlowCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">User Enablement</h1>
        <p className="text-muted-foreground">Training materials and onboarding flows</p>
      </div>

      <Tabs defaultValue="trainingMaterial" className="px-6">
        <TabsList>
          <TabsTrigger value="trainingMaterial">Training Materials</TabsTrigger>
          <TabsTrigger value="onboardingFlow">Onboarding Flows</TabsTrigger>
        </TabsList>

        <TabsContent value="trainingMaterial">
          <DataTable
            title="Training Materials"
            description="Manage training materials records"
            data={trainingMaterialQuery.data}
            isLoading={trainingMaterialQuery.isLoading}
            count={trainingMaterialCount.data}
            onRefresh={() => trainingMaterialQuery.refetch()}
            onDelete={(id) => trainingMaterialDelete.mutate({ id })}
            columns={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'difficulty', label: 'Difficulty' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

        <TabsContent value="onboardingFlow">
          <DataTable
            title="Onboarding Flows"
            description="Manage onboarding flows records"
            data={onboardingFlowQuery.data}
            isLoading={onboardingFlowQuery.isLoading}
            count={onboardingFlowCount.data}
            onRefresh={() => onboardingFlowQuery.refetch()}
            onDelete={(id) => onboardingFlowDelete.mutate({ id })}
            columns={[{ key: 'userId', label: 'User Id' }, { key: 'currentStep', label: 'Current Step' }, { key: 'totalSteps', label: 'Total Steps' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}