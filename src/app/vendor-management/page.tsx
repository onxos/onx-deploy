"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function VendorManagementPage() {
  const utils = api.useUtils();

  const stewardshipRecordQuery = api.stewardship.stewardshipRecordList.useQuery();
  const stewardshipRecordCount = api.stewardship.stewardshipRecordCount.useQuery();
  const stewardshipRecordDelete = api.stewardship.stewardshipRecordDelete.useMutation({
    onSuccess: () => {
      utils.stewardship.stewardshipRecordList.invalidate();
      utils.stewardship.stewardshipRecordCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Vendor Management</h1>
        <p className="text-muted-foreground">Stewardship records and vendor tracking</p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Stewardship Records"
          description="Manage stewardship records records"
          data={stewardshipRecordQuery.data}
          isLoading={stewardshipRecordQuery.isLoading}
          count={stewardshipRecordCount.data}
          onRefresh={() => stewardshipRecordQuery.refetch()}
          onDelete={((id: number) => stewardshipRecordDelete.mutate({ id }))}
          columns={[{"key": "name", "label": "Name"}, {"key": "type", "label": "Type"}, {"key": "status", "label": "Status"}, {"key": "createdAt", "label": "Date"}]}
        />
      </div>
    </div>
  );
}
