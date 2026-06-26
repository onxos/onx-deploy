"use client";

import { api } from "@/trpc/react";

export default function TaskManagementPage() {
  const taskQuery = api.task.list.useQuery();

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Task Management</h1>
        <p className="text-muted-foreground">Manage tasks and track outcomes</p>
      </div>
      <div className="px-6 space-y-4">
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Priority</th>
                <th className="px-4 py-3 text-left font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {taskQuery.isLoading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : taskQuery.data?.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No tasks found</td></tr>
              ) : (
                taskQuery.data?.map((task: Record<string, unknown>) => (
                  <tr key={String(task.id)} className="border-t">
                    <td className="px-4 py-3">{String(task.title ?? "")}</td>
                    <td className="px-4 py-3">{String(task.status ?? "")}</td>
                    <td className="px-4 py-3">{String(task.priority ?? "")}</td>
                    <td className="px-4 py-3">{String(task.assignee ?? "")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
