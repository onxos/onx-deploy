"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function EnablementPage() {
  const utils = api.useUtils();

  const trainingMaterialQuery = api.enablement.trainingMaterialList.useQuery();
  const trainingMaterialCount = api.enablement.trainingMaterialCount.useQuery();
  const trainingMaterialDelete =
    api.enablement.trainingMaterialDelete.useMutation({
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
  const [activeTab, setActiveTab] = useState("trainingMaterial");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">User Enablement</h1>
        <p className="text-muted-foreground">
          Training materials and onboarding flows
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "trainingMaterial" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("trainingMaterial")}
            type="button"
          >
            Training Materials
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "onboardingFlow" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("onboardingFlow")}
            type="button"
          >
            Onboarding Flows
          </button>
        </div>

        {activeTab === "trainingMaterial" && (
          <div>
            <DataTable
              title="Training Materials"
              description="Manage training materials records"
              data={trainingMaterialQuery.data}
              isLoading={trainingMaterialQuery.isLoading}
              count={trainingMaterialCount.data}
              onRefresh={() => trainingMaterialQuery.refetch()}
              onDelete={(id) => trainingMaterialDelete.mutate({ id })}
              columns={[
                { key: "title", label: "Title" },
                { key: "category", label: "Category" },
                { key: "difficulty", label: "Difficulty" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
        {activeTab === "onboardingFlow" && (
          <div>
            <DataTable
              title="Onboarding Flows"
              description="Manage onboarding flows records"
              data={onboardingFlowQuery.data}
              isLoading={onboardingFlowQuery.isLoading}
              count={onboardingFlowCount.data}
              onRefresh={() => onboardingFlowQuery.refetch()}
              onDelete={(id) => onboardingFlowDelete.mutate({ id })}
              columns={[
                { key: "userId", label: "User Id" },
                { key: "currentStep", label: "Current Step" },
                { key: "totalSteps", label: "Total Steps" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
