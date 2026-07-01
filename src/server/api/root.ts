import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { audit_reviewRouter } from "./routers/audit_review";
import { authRouter } from "./routers/auth";
import { branchRbacRouter } from "./routers/branch-rbac";
import { civilizationRouter } from "./routers/civilization";
import { clinicalRouter } from "./routers/clinical";
import { crmRouter } from "./routers/crm";
import { data_governanceRouter } from "./routers/data_governance";
import { dreamRouter } from "./routers/dream";
import { editorialRouter } from "./routers/editorial";
import { enablementRouter } from "./routers/enablement";
import { evolutionRouter } from "./routers/evolution";
import { financeRouter } from "./routers/finance";
import { gapRouter } from "./routers/gap";
import { glRouter } from "./routers/gl";
import { goalRouter } from "./routers/goal";
import { hrRouter } from "./routers/hr";
import { institutionRouter } from "./routers/institution";
import { insuranceRouter } from "./routers/insurance";
import { inventoryRouter } from "./routers/inventory";
import { judgmentRouter } from "./routers/judgment";
import { launchRouter } from "./routers/launch";
import { operationsRouter } from "./routers/operations";
import { orgRouter } from "./routers/org";
import { outcomeRouter } from "./routers/outcome";
import { performanceRouter } from "./routers/performance";
import { posRouter } from "./routers/pos";
import { potentialRouter } from "./routers/potential";
import { procurementRouter } from "./routers/procurement";
import { release_mgmtRouter } from "./routers/release_mgmt";
import { sechRouter } from "./routers/sech";
import { security_reviewRouter } from "./routers/security_review";
import { stewardshipRouter } from "./routers/stewardship";
import { taskRouter } from "./routers/task";
import { tenantRouter } from "./routers/tenant";
import { titanRouter } from "./routers/titan";
import { titan_opsRouter } from "./routers/titan_ops";
import { understandingRouter } from "./routers/understanding";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  analytics: analyticsRouter,
  auditReview: audit_reviewRouter,
  auth: authRouter,
  civilization: civilizationRouter,
  dataGovernance: data_governanceRouter,
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
  releaseMgmt: release_mgmtRouter,
  sech: sechRouter,
  securityReview: security_reviewRouter,
  stewardship: stewardshipRouter,
  task: taskRouter,
  titan: titanRouter,
  titanOps: titan_opsRouter,
  understanding: understandingRouter,
  user: userRouter,
  branchRbac: branchRbacRouter,
  clinical: clinicalRouter,
  crm: crmRouter,
  finance: financeRouter,
  gl: glRouter,
  hr: hrRouter,
  insurance: insuranceRouter,
  inventory: inventoryRouter,
  org: orgRouter,
  pos: posRouter,
  procurement: procurementRouter,
  tenant: tenantRouter,
});

export type AppRouter = typeof appRouter;
