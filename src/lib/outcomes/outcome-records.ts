import { goals, tasks } from "@/lib/civilization/lifecycle-records";

export const outcomeRecords = [
  {
    completedAt: "2026-06-24",
    evidenceLinks: [
      "evidence/EP-05/2026-06-24/closure/EV-CLSR_TRAIN-L_20260624_final-verification.txt",
    ],
    goalId: goals[0].id,
    id: "outcome-1",
    impact: "Leadership can now review lifecycle analytics and reports.",
    qualityScore: 96,
    stakeholder: "Founder",
    summary: "Train L analytics baseline closed with 50/50 PASS.",
    taskId: tasks[0].id,
    title: "Analytics baseline accepted",
  },
] as const;

export const lessonRecords = [
  {
    decision: "Use shared lifecycle records before persistent outcome schema.",
    id: "lesson-1",
    improvement:
      "Future trains can replace the shared baseline with DB-backed outcome records.",
    linkedOutcomeId: "outcome-1",
    note: "Small deterministic records keep evidence reviewable while V5 execution advances sequentially.",
  },
] as const;

export const recognitionBadges = [
  {
    awardedAt: "2026-06-24",
    id: "badge-1",
    label: "Train L Closer",
    reason: "Closed analytics, reports, and visualization baseline.",
    recipient: "Husam",
    signal: "completion-quality",
  },
  {
    awardedAt: "2026-06-24",
    id: "badge-2",
    label: "Evidence Steward",
    reason:
      "Submitted code, test, deployment, acceptance, and closure evidence.",
    recipient: "Husam",
    signal: "evidence-completeness",
  },
] as const;

export const flourishingTimeline = [
  {
    date: "2026-06-23",
    description: "Atlas V5 complete execution package closed and shipped.",
    id: "flourish-1",
    scope: "institutional",
    title: "Package freeze achieved",
    type: "outcome",
  },
  {
    date: "2026-06-24",
    description: "Train L outcome and recognition signals became reviewable.",
    id: "flourish-2",
    scope: "personal",
    title: "Analytics capability recognized",
    type: "recognition",
  },
] as const;

export function getOutcomeReviewSummary() {
  return {
    badges: recognitionBadges,
    flourishingTimeline,
    generatedAt: new Date().toISOString(),
    lessons: lessonRecords,
    outcomes: outcomeRecords,
    review: {
      averageQuality:
        outcomeRecords.reduce((sum, item) => sum + item.qualityScore, 0) /
        outcomeRecords.length,
      evidenceCount: outcomeRecords.reduce(
        (sum, item) => sum + item.evidenceLinks.length,
        0,
      ),
      lessonCount: lessonRecords.length,
      recognitionCount: recognitionBadges.length,
      totalOutcomes: outcomeRecords.length,
    },
  };
}
