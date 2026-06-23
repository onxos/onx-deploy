"use client";

import { WorkspaceLayout } from "@/components/workspace/workspace-layout";

export default function WorkspacePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">
          Understanding / Judgment Workspace
        </h1>
        <p className="text-muted-foreground">
          Capture research, analysis, decisions, confidence, evidence, and
          linked entities.
        </p>
      </div>
      <WorkspaceLayout />
    </main>
  );
}
