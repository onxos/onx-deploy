"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function TaskManagementPage() {
  const utils = api.useUtils();

  const taskQuery = api.task.list.useQuery();

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Task Management</h1>
        <p className="text-muted-foreground">Manage tasks and track outcomes</p>
      </div>
      <div className="px-6 space-y-4">
        <DataTable
          title="Tasks"
          description="Manage tasks records"
          data={taskQuery.data}
          isLoading={taskQuery.isLoading}
          count={undefined}
          onRefresh={() => taskQuery.refetch()}
          onDelete={undefined}
          columns={[{"key": "title", "label": "Title"}, {"key": "status", "label": "Status"}, {"key": "priority", "label": "Priority"}, {"key": "assignee", "label": "Assignee"}]}
        />
      </div>
    </div>
  );
}
