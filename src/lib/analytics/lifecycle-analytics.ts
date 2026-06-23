import {
  dreams,
  goals,
  potentials,
  tasks,
} from "@/lib/civilization/lifecycle-records";

export const lifecycleStages = [
  {
    key: "dreams",
    label: "Dreams",
    count: dreams.length,
  },
  {
    key: "potentials",
    label: "Potentials",
    count: potentials.length,
  },
  {
    key: "goals",
    label: "Goals",
    count: goals.length,
  },
  {
    key: "milestones",
    label: "Milestones",
    count: goals.reduce((sum, goal) => sum + goal.milestones.length, 0),
  },
  {
    key: "completion",
    label: "Completion",
    count: tasks.filter((task) => task.status === "done").length,
  },
] as const;

function percentage(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getLifecycleAnalyticsSummary() {
  const completedMilestones = goals.reduce(
    (sum, goal) =>
      sum + goal.milestones.filter((milestone) => milestone.completed).length,
    0,
  );
  const totalMilestones = lifecycleStages[3].count;
  const completedTasks = lifecycleStages[4].count;
  const activeExecution = tasks.filter((task) => task.status !== "done").length;
  const dreamCount = lifecycleStages[0].count;

  return {
    generatedAt: new Date().toISOString(),
    kpis: {
      dreams: dreamCount,
      potentials: lifecycleStages[1].count,
      goals: lifecycleStages[2].count,
      activeExecution,
      completionVelocity: completedTasks,
    },
    conversionFunnel: lifecycleStages.map((stage, index) => {
      const previous = lifecycleStages[index - 1]?.count ?? stage.count;
      return {
        ...stage,
        stageRate: percentage(stage.count, previous),
        totalRate: percentage(stage.count, dreamCount),
      };
    }),
    goalProgress: goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      completedMilestones: goal.milestones.filter(
        (milestone) => milestone.completed,
      ).length,
      totalMilestones: goal.milestones.length,
      milestoneProgress: percentage(
        goal.milestones.filter((milestone) => milestone.completed).length,
        goal.milestones.length,
      ),
      status: goal.status,
    })),
    executionVelocity: [
      {
        interval: "2026-06-21",
        completed: 0,
        variance: 0,
      },
      {
        interval: "2026-06-22",
        completed: 0,
        variance: 0,
      },
      {
        interval: "2026-06-23",
        completed: completedTasks,
        variance: completedTasks,
      },
    ],
    report: {
      period: "2026-06-21 to 2026-06-23",
      csvRows: [
        ["metric", "value"],
        ["dreams", String(dreamCount)],
        ["potentials", String(lifecycleStages[1].count)],
        ["goals", String(lifecycleStages[2].count)],
        ["completed_milestones", String(completedMilestones)],
        ["total_milestones", String(totalMilestones)],
        ["completed_tasks", String(completedTasks)],
      ],
      evidenceReferences: [
        "docs/ONX_ATLAS_V5_COMPLETE_EXECUTION_PACKAGE_v1.0.docx",
        "evidence/EP-04/2026-06-23/acceptance/EV-ACPT_WP-K-05_20260623_checklist.md",
      ],
    },
  };
}
