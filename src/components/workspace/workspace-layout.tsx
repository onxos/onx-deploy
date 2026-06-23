"use client";

import { useState } from "react";
import { useJudgment } from "@/hooks/use-judgment";
import { useUnderstanding } from "@/hooks/use-understanding";
import { JudgmentForm } from "./judgment-form";
import { JudgmentList } from "./judgment-list";
import { UnderstandingForm } from "./understanding-form";
import { UnderstandingList } from "./understanding-list";
import { WorkspaceFilters } from "./workspace-filters";

export function WorkspaceLayout() {
  const [tab, setTab] = useState<"understanding" | "judgment">("understanding");
  const understanding = useUnderstanding();
  const judgment = useJudgment();

  return (
    <section className="space-y-5">
      <div className="flex rounded-lg border bg-card p-1">
        {(["understanding", "judgment"] as const).map((item) => (
          <button
            className="flex-1 rounded-md px-4 py-2 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={tab === item}
            key={item}
            onClick={() => setTab(item)}
            type="button"
          >
            {item === "understanding" ? "Understanding tab" : "Judgment tab"}
          </button>
        ))}
      </div>
      <WorkspaceFilters
        confidence={judgment.confidence}
        setConfidence={judgment.setConfidence}
        setType={understanding.setType}
        type={understanding.type}
      />
      {tab === "understanding" ? (
        <>
          <UnderstandingForm />
          <UnderstandingList items={understanding.filteredUnderstanding} />
        </>
      ) : (
        <>
          <JudgmentForm />
          <JudgmentList items={judgment.filteredJudgments} />
        </>
      )}
    </section>
  );
}
