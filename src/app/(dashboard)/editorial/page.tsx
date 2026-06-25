"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function EditorialPage() {
  const utils = api.useUtils();

  const editorialPolicyQuery = api.editorial.editorialPolicyList.useQuery();
  const editorialPolicyCount = api.editorial.editorialPolicyCount.useQuery();
  const editorialPolicyDelete = api.editorial.editorialPolicyDelete.useMutation(
    {
      onSuccess: () => {
        utils.editorial.editorialPolicyList.invalidate();
        utils.editorial.editorialPolicyCount.invalidate();
      },
    },
  );

  const contentReviewQuery = api.editorial.contentReviewList.useQuery();
  const contentReviewCount = api.editorial.contentReviewCount.useQuery();
  const contentReviewDelete = api.editorial.contentReviewDelete.useMutation({
    onSuccess: () => {
      utils.editorial.contentReviewList.invalidate();
      utils.editorial.contentReviewCount.invalidate();
    },
  });

  const publicationScheduleQuery =
    api.editorial.publicationScheduleList.useQuery();
  const publicationScheduleCount =
    api.editorial.publicationScheduleCount.useQuery();
  const publicationScheduleDelete =
    api.editorial.publicationScheduleDelete.useMutation({
      onSuccess: () => {
        utils.editorial.publicationScheduleList.invalidate();
        utils.editorial.publicationScheduleCount.invalidate();
      },
    });
  const [activeTab, setActiveTab] = useState("editorialPolicy");

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Editorial Governance</h1>
        <p className="text-muted-foreground">
          Editorial policies, content reviews, and publication schedules
        </p>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "editorialPolicy" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("editorialPolicy")}
            type="button"
          >
            Editorial Policies
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "contentReview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("contentReview")}
            type="button"
          >
            Content Reviews
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "publicationSchedule" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("publicationSchedule")}
            type="button"
          >
            Publication Schedule
          </button>
        </div>

        {activeTab === "editorialPolicy" && (
          <div>
            <DataTable
              title="Editorial Policies"
              description="Manage editorial policies records"
              data={editorialPolicyQuery.data}
              isLoading={editorialPolicyQuery.isLoading}
              count={editorialPolicyCount.data}
              onRefresh={() => editorialPolicyQuery.refetch()}
              onDelete={(id) => editorialPolicyDelete.mutate({ id })}
              columns={[
                { key: "name", label: "Name" },
                { key: "scope", label: "Scope" },
                { key: "status", label: "Status" },
                { key: "version", label: "Version" },
              ]}
            />
          </div>
        )}
        {activeTab === "contentReview" && (
          <div>
            <DataTable
              title="Content Reviews"
              description="Manage content reviews records"
              data={contentReviewQuery.data}
              isLoading={contentReviewQuery.isLoading}
              count={contentReviewCount.data}
              onRefresh={() => contentReviewQuery.refetch()}
              onDelete={(id) => contentReviewDelete.mutate({ id })}
              columns={[
                { key: "contentId", label: "Content Id" },
                { key: "contentType", label: "Content Type" },
                { key: "verdict", label: "Verdict" },
              ]}
            />
          </div>
        )}
        {activeTab === "publicationSchedule" && (
          <div>
            <DataTable
              title="Publication Schedule"
              description="Manage publication schedule records"
              data={publicationScheduleQuery.data}
              isLoading={publicationScheduleQuery.isLoading}
              count={publicationScheduleCount.data}
              onRefresh={() => publicationScheduleQuery.refetch()}
              onDelete={(id) => publicationScheduleDelete.mutate({ id })}
              columns={[
                { key: "title", label: "Title" },
                { key: "scheduledDate", label: "Scheduled Date" },
                { key: "status", label: "Status" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
