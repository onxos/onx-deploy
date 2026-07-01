import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { apRouter } from "./routers/ap";
import { appointmentRouter } from "./routers/appointment";
import { approvalRouter } from "./routers/approval";
import { arRouter } from "./routers/ar";
import { attendanceRouter } from "./routers/attendance";
import { audit_reviewRouter } from "./routers/audit_review";
import { authRouter } from "./routers/auth";
import { bankReconciliationRouter } from "./routers/bank-reconciliation";
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
import { grnRouter } from "./routers/grn";
import { hrRouter } from "./routers/hr";
import { institutionRouter } from "./routers/institution";
import { insuranceRouter } from "./routers/insurance";
import { insuranceClaimRouter } from "./routers/insurance-claim";
import { insurancePolicyRouter } from "./routers/insurance-policy";
import { inventoryRouter } from "./routers/inventory";
import { inventoryLocationRouter } from "./routers/inventory-location";
import { itemBatchRouter } from "./routers/item-batch";
import { judgmentRouter } from "./routers/judgment";
import { launchRouter } from "./routers/launch";
import { leaveRouter } from "./routers/leave";
import { operationsRouter } from "./routers/operations";
import { orgRouter } from "./routers/org";
import { outcomeRouter } from "./routers/outcome";
import { payrollRouter } from "./routers/payroll";
import { performanceRouter } from "./routers/performance";
import { posRouter } from "./routers/pos";
import { potentialRouter } from "./routers/potential";
import { prescriptionRouter } from "./routers/prescription";
import { procurementRouter } from "./routers/procurement";
import { procurementPrRouter } from "./routers/procurement-pr";
import { purchaseOrderRouter } from "./routers/purchase-order";
import { release_mgmtRouter } from "./routers/release_mgmt";
import { reorderRouter } from "./routers/reorder";
import { sechRouter } from "./routers/sech";
import { security_reviewRouter } from "./routers/security_review";
import { soapNoteRouter } from "./routers/soap-note";
import { stewardshipRouter } from "./routers/stewardship";
import { stockMovementRouter } from "./routers/stock-movement";
import { supplierReturnRouter } from "./routers/supplier-return";
import { taskRouter } from "./routers/task";
import { tenantRouter } from "./routers/tenant";
import { titanRouter } from "./routers/titan";
import { titan_opsRouter } from "./routers/titan_ops";
import { treatmentPlanRouter } from "./routers/treatment-plan";
import { understandingRouter } from "./routers/understanding";
import { userRouter } from "./routers/user";
import { vaccinationRouter } from "./routers/vaccination";

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
  procurementPr: procurementPrRouter,
  tenant: tenantRouter,
  // Wave 2a
  appointment: appointmentRouter,
  approval: approvalRouter,
  ar: arRouter,
  attendance: attendanceRouter,
  insurancePolicy: insurancePolicyRouter,
  leave: leaveRouter,
  stockMovement: stockMovementRouter,
  vaccination: vaccinationRouter,
  // Wave 2b
  inventoryLocation: inventoryLocationRouter,
  itemBatch: itemBatchRouter,
  payroll: payrollRouter,
  purchaseOrder: purchaseOrderRouter,
  reorder: reorderRouter,
  soapNote: soapNoteRouter,
  // Wave 2c
  ap: apRouter,
  grn: grnRouter,
  insuranceClaim: insuranceClaimRouter,
  // Wave 2d
  bankReconciliation: bankReconciliationRouter,
  prescription: prescriptionRouter,
  supplierReturn: supplierReturnRouter,
  treatmentPlan: treatmentPlanRouter,
});

export type AppRouter = typeof appRouter;
