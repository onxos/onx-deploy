"use client";

import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export default function institutionPage() {
  const utils = api.useUtils();

  const institutionSettingQuery = api.institution.institutionSettingList.useQuery();
  const institutionSettingCount = api.institution.institutionSettingCount.useQuery();
  const institutionSettingDelete =
      api.institution.institutionSettingDelete.useMutation({
    onSuccess: () => {
      utils.institution.institutionSettingList.invalidate();
      utils.institution.institutionSettingCount.invalidate();
    },
  });

  const memberManagementQuery = api.institution.memberManagementList.useQuery();
  const memberManagementCount = api.institution.memberManagementCount.useQuery();
  const memberManagementDelete =
      api.institution.memberManagementDelete.useMutation({
    onSuccess: () => {
      utils.institution.memberManagementList.invalidate();
      utils.institution.memberManagementCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Institution Management</h1>
        <p className="text-muted-foreground">
          Institution settings and member management
        </p>
      </div>

      <Tabs defaultValue="institutionSetting" className="px-6">
        <TabsList>
          <TabsTrigger value="institutionSetting">Settings</TabsTrigger>
          <TabsTrigger value="memberManagement">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="institutionSetting">
          <DataTable
            title="Settings"
            description="Manage settings records"
            data={institutionSettingQuery.data}
            isLoading={institutionSettingQuery.isLoading}
            count={institutionSettingCount.data}
            onRefresh={() => institutionSettingQuery.refetch()}
            onDelete={(id) => institutionSettingDelete.mutate({ id })}
            columns={[{ key: 'key', label: 'Key' }, { key: 'category', label: 'Category' }, { key: 'value', label: 'Value' }]}
          />
        </TabsContent>

        <TabsContent value="memberManagement">
          <DataTable
            title="Members"
            description="Manage members records"
            data={memberManagementQuery.data}
            isLoading={memberManagementQuery.isLoading}
            count={memberManagementCount.data}
            onRefresh={() => memberManagementQuery.refetch()}
            onDelete={(id) => memberManagementDelete.mutate({ id })}
            columns={[{ key: 'userId', label: 'User Id' }, { key: 'role', label: 'Role' }, { key: 'department', label: 'Department' }, { key: 'status', label: 'Status' }]}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}