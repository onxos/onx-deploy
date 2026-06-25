"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function InstitutionPage() {
  const utils = api.useUtils();

  const institutionSettingQuery =
    api.institution.institutionSettingList.useQuery();
  const institutionSettingCount =
    api.institution.institutionSettingCount.useQuery();
  const institutionSettingDelete =
    api.institution.institutionSettingDelete.useMutation({
      onSuccess: () => {
        utils.institution.institutionSettingList.invalidate();
        utils.institution.institutionSettingCount.invalidate();
      },
    });

  const memberManagementQuery = api.institution.memberManagementList.useQuery();
  const memberManagementCount =
    api.institution.memberManagementCount.useQuery();
  const memberManagementDelete =
    api.institution.memberManagementDelete.useMutation({
      onSuccess: () => {
        utils.institution.memberManagementList.invalidate();
        utils.institution.memberManagementCount.invalidate();
      },
    });
  const [activeTab, setActiveTab] = useState("institutionSetting");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Institution Administration</h1>
        <p className="text-muted-foreground">
          Institution settings, members, and security audits
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "institutionSetting" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("institutionSetting")}
            type="button"
          >
            Settings
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "memberManagement" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("memberManagement")}
            type="button"
          >
            Members
          </button>
        </div>

        {activeTab === "institutionSetting" && (
          <div>
            <DataTable
              title="Settings"
              description="Manage settings records"
              data={institutionSettingQuery.data}
              isLoading={institutionSettingQuery.isLoading}
              count={institutionSettingCount.data}
              onRefresh={() => institutionSettingQuery.refetch()}
              onDelete={(id) => institutionSettingDelete.mutate({ id })}
              columns={[
                { key: "key", label: "Key" },
                { key: "category", label: "Category" },
                { key: "value", label: "Value" },
              ]}
            />
          </div>
        )}
        {activeTab === "memberManagement" && (
          <div>
            <DataTable
              title="Members"
              description="Manage members records"
              data={memberManagementQuery.data}
              isLoading={memberManagementQuery.isLoading}
              count={memberManagementCount.data}
              onRefresh={() => memberManagementQuery.refetch()}
              onDelete={(id) => memberManagementDelete.mutate({ id })}
              columns={[
                { key: "userId", label: "User Id" },
                { key: "role", label: "Role" },
                { key: "department", label: "Department" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
