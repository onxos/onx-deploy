"use client";

import { ExecutionFilters } from "@/components/execution/execution-filters";
import { ExecutionTimeline } from "@/components/execution/execution-timeline";
import { OutcomeForm } from "@/components/execution/outcome-form";
import { ProgressSummary } from "@/components/execution/progress-summary";
import { TaskForm } from "@/components/execution/task-form";
import { TaskList } from "@/components/execution/task-list";
import { useExecution } from "@/hooks/use-execution";
import { useTasks } from "@/hooks/use-tasks";

export default function ExecutionPage() {
  const tasks = useTasks();
  const execution = useExecution(tasks.filteredTasks);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Execution Tracker</h1>
        <p className="text-muted-foreground">
          Decompose goals into tasks, track status, view timeline, and record
          outcomes.
        </p>
      </div>
      <ProgressSummary stats={execution.stats} />
      <ExecutionFilters setStatus={tasks.setStatus} status={tasks.status} />
      <TaskForm />
      <TaskList
        onNextStatus={(id) => tasks.updateStatus(id, "done")}
        tasks={tasks.filteredTasks}
      />
      <ExecutionTimeline tasks={execution.timeline} />
      <OutcomeForm onRecord={(value) => tasks.recordOutcome("task-1", value)} />
    </main>
  );
}
