import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { auditReviewRouter } from "./routers/audit_review";
import { authRouter } from "./routers/auth";
import { civilizationRouter } from "./routers/civilization";
import { dataGovernanceRouter } from "./routers/data_governance";
import { dreamRouter } from "./routers/dream";
import { editorialRouter } from "./routers/editorial";
import { enablementRouter } from "./routers/enablement";
import { evolutionRouter } from "./routers/evolution";
import { gapRouter } from "./routers/gap";
import { goalRouter } from "./routers/goal";
import { institutionRouter } from "./routers/institution";
import { judgmentRouter } from "./routers/judgment";
import { launchRouter } from "./routers/launch";
import { operationsRouter } from "./routers/operations";
import { outcomeRouter } from "./routers/outcome";
import { performanceRouter } from "./routers/performance";
import { potentialRouter } from "./routers/potential";
import { releaseMgmtRouter } from "./routers/release_mgmt";
import { sechRouter } from "./routers/sech";
import { securityReviewRouter } from "./routers/security_review";
import { stewardshipRouter } from "./routers/stewardship";
import { taskRouter } from "./routers/task";
import { titanOpsRouter } from "./routers/titan_ops";
import { titanRouter } from "./routers/titan";
import { understandingRouter } from "./routers/understanding";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  auditReview: auditReviewRouter,
  auth: authRouter,
  civilization: civilizationRouter,
  dataGovernance: dataGovernanceRouter,
  dream: dreamRouter,
  editorial: editorialRouter,
  enablement: enablementRouter,
  evolution: evolutionRouter,
  gap: gapRouter,
  goal: goalRouter,
  institution: institutionRouter,
  judgment: judgmentRouter,
  launch: launchRouter,
  operations: operationsRouter,
  outcome: outcomeRouter,
  performance: performanceRouter,
  potential: potentialRouter,
  releaseMgmt: releaseMgmtRouter,
  sech: sechRouter,
  securityReview: securityReviewRouter,
  stewardship: stewardshipRouter,
  task: taskRouter,
  titan: titanRouter,
  titanOps: titanOpsRouter,
  understanding: understandingRouter,
  user: userRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
