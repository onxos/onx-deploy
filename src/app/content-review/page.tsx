"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";

export default function ContentReviewPage() {
  const utils = api.useUtils();
  const [activeTab, setActiveTab] = useState("contentReview");

  const contentReviewQuery = api.editorial.contentReviewList.useQuery();
  const contentReviewCount = api.editorial.contentReviewCount.useQuery();
  const contentReviewDelete = api.editorial.contentReviewDelete.useMutation({
    onSuccess: () => {
      utils.editorial.contentReviewList.invalidate();
      utils.editorial.contentReviewCount.invalidate();
      utils.editorial.editorialPolicyList.invalidate();
      utils.editorial.editorialPolicyCount.invalidate();
    },
  });

  const editorialPolicyQuery = api.editorial.editorialPolicyList.useQuery();
  const editorialPolicyCount = api.editorial.editorialPolicyCount.useQuery();
  const editorialPolicyDelete = api.editorial.editorialPolicyDelete.useMutation({
    onSuccess: () => {
      utils.editorial.contentReviewList.invalidate();
      utils.editorial.contentReviewCount.invalidate();
      utils.editorial.editorialPolicyList.invalidate();
      utils.editorial.editorialPolicyCount.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-semibold">Content Review</h1>
        <p className="text-muted-foreground">Editorial policies and content review</p>
      </div>
      <div className="px-6 space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "contentReview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("contentReview")}
            type="button"
          >
            Content Reviews
          </button>
          <button
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "editorialPolicy" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("editorialPolicy")}
            type="button"
          >
            Editorial Policies
          </button>
        </div>

        {activeTab === "contentReview" && (
          <div>
            <DataTable
              title="Content Reviews"
              description="Manage content reviews records"
              data={contentReviewQuery.data}
              isLoading={contentReviewQuery.isLoading}
              count={contentReviewCount.data}
              onRefresh={() => contentReviewQuery.refetch()}
              onDelete={((id: number) => contentReviewDelete.mutate({ id }))}
              columns={[{"key": "title", "label": "Title"}, {"key": "verdict", "label": "Verdict"}, {"key": "reviewer", "label": "Reviewer"}, {"key": "createdAt", "label": "Date"}]}
            />
          </div>
        )}

        {activeTab === "editorialPolicy" && (
          <div>
            <DataTable
              title="Editorial Policies"
              description="Manage editorial policies records"
              data={editorialPolicyQuery.data}
              isLoading={editorialPolicyQuery.isLoading}
              count={editorialPolicyCount.data}
              onRefresh={() => editorialPolicyQuery.refetch()}
              onDelete={((id: number) => editorialPolicyDelete.mutate({ id }))}
              columns={[{"key": "title", "label": "Title"}, {"key": "status", "label": "Status"}, {"key": "category", "label": "Category"}, {"key": "createdAt", "label": "Date"}]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
