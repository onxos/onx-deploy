export const dreams = [
  {
    category: "Professional",
    createdAt: "2026-06-22",
    description: "Create the ONX Dream-to-Goal operating layer.",
    id: "dream-1",
    priority: "Critical",
    status: "Active",
    title: "Build the ONX core experience",
    updatedAt: "2026-06-22",
  },
] as const;

export const potentials = [
  {
    assessmentScore: 92,
    category: "Creation",
    conversionReady: true,
    description:
      "Ship the Dream Center first, then convert pathways into goals.",
    dreamId: "dream-1",
    feasibility: "High",
    id: "potential-1",
    parentDreamTitle: "Build the ONX core experience",
  },
] as const;

export const goals = [
  {
    childGoals: ["Instrument evidence automation"],
    deadline: "2026-06-30",
    description: "Convert Train K into a complete operating layer.",
    id: "goal-1",
    milestones: [
      {
        completed: true,
        dueDate: "2026-06-23",
        id: "m1",
        title: "Model dream",
      },
    ],
    priority: "Critical",
    status: "Active",
    title: "Close Train K with 50/50 certification",
  },
] as const;

export const tasks = [
  {
    assignee: "Husam",
    description: "Create the Dream Center route and components.",
    dueDate: "2026-06-23",
    goalId: "goal-1",
    id: "task-1",
    parentGoalTitle: "Close Train K with 50/50 certification",
    priority: "Critical",
    status: "done",
    title: "Ship WP-K-01",
  },
] as const;
