"use client";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function SystemConfigurationPage() {
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

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">System Configuration</h1>
        <p className="text-muted-foreground">
          Institution settings and configuration
        </p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Institution Settings"
          description="Manage institution settings records"
          data={institutionSettingQuery.data}
          isLoading={institutionSettingQuery.isLoading}
          count={institutionSettingCount.data}
          onRefresh={() => institutionSettingQuery.refetch()}
          onDelete={(id: number) => institutionSettingDelete.mutate({ id })}
          columns={[
            { key: "key", label: "Key" },
            { key: "value", label: "Value" },
            { key: "category", label: "Category" },
            { key: "updatedAt", label: "Updated" },
          ]}
        />
      </div>
    </div>
  );
}
