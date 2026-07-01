import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { analyserDeviceRouter } from "./routers/analyser-device";
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
import { cashReconciliationRouter } from "./routers/cash-reconciliation";
import { catalogueRouter } from "./routers/catalogue";
import { civilizationRouter } from "./routers/civilization";
import { clinicalRouter } from "./routers/clinical";
import { clinicalOutcomeRouter } from "./routers/clinical-outcome";
import { consentFormRouter } from "./routers/consent-form";
import { crmRouter } from "./routers/crm";
import { data_governanceRouter } from "./routers/data_governance";
import { dicomStudyRouter } from "./routers/dicom-study";
import { discountRouter } from "./routers/discount";
import { dreamRouter } from "./routers/dream";
import { editorialRouter } from "./routers/editorial";
import { enablementRouter } from "./routers/enablement";
import { evolutionRouter } from "./routers/evolution";
import { externalLabRouter } from "./routers/external-lab";
import { financeRouter } from "./routers/finance";
import { gapRouter } from "./routers/gap";
import { glRouter } from "./routers/gl";
import { goalRouter } from "./routers/goal";
import { grnRouter } from "./routers/grn";
import { hrRouter } from "./routers/hr";
import { imagingRequestRouter } from "./routers/imaging-request";
import { inpatientRouter } from "./routers/inpatient";
import { institutionRouter } from "./routers/institution";
import { insuranceRouter } from "./routers/insurance";
import { insuranceClaimRouter } from "./routers/insurance-claim";
import { insurancePolicyRouter } from "./routers/insurance-policy";
import { inventoryRouter } from "./routers/inventory";
import { inventoryLocationRouter } from "./routers/inventory-location";
import { itemBatchRouter } from "./routers/item-batch";
import { judgmentRouter } from "./routers/judgment";
import { labResultHistoryRouter } from "./routers/lab-result-history";
import { labTestRouter } from "./routers/lab-test";
import { launchRouter } from "./routers/launch";
import { leaveRouter } from "./routers/leave";
import { operationsRouter } from "./routers/operations";
import { orgRouter } from "./routers/org";
import { outcomeRouter } from "./routers/outcome";
import { payrollRouter } from "./routers/payroll";
import { performanceRouter } from "./routers/performance";
import { petProfileRouter } from "./routers/pet-profile";
import { posRouter } from "./routers/pos";
import { posReceiptRouter } from "./routers/pos-receipt";
import { potentialRouter } from "./routers/potential";
import { prescriptionRouter } from "./routers/prescription";
import { procurementRouter } from "./routers/procurement";
import { procurementPrRouter } from "./routers/procurement-pr";
import { purchaseOrderRouter } from "./routers/purchase-order";
import { recruitmentRouter } from "./routers/recruitment";
import { referralRouter } from "./routers/referral";
import { release_mgmtRouter } from "./routers/release_mgmt";
import { reorderRouter } from "./routers/reorder";
import { sechRouter } from "./routers/sech";
import { security_reviewRouter } from "./routers/security_review";
import { shiftManagementRouter } from "./routers/shift-management";
import { soapNoteRouter } from "./routers/soap-note";
import { stewardshipRouter } from "./routers/stewardship";
import { stockMovementRouter } from "./routers/stock-movement";
import { supplierReturnRouter } from "./routers/supplier-return";
import { surgicalTheatreRouter } from "./routers/surgical-theatre";
import { taskRouter } from "./routers/task";
import { telvetMedicalNoteRouter } from "./routers/televet-medical-note";
import { telvetSessionRouter } from "./routers/televet-session";
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
  // Wave 2e
  catalogue: catalogueRouter,
  cashReconciliation: cashReconciliationRouter,
  petProfile: petProfileRouter,
  recruitment: recruitmentRouter,
  shiftManagement: shiftManagementRouter,
  // Wave 2f
  discount: discountRouter,
  inpatient: inpatientRouter,
  posReceipt: posReceiptRouter,
  referral: referralRouter,
  surgicalTheatre: surgicalTheatreRouter,
  // Wave 3
  analyserDevice: analyserDeviceRouter,
  clinicalOutcome: clinicalOutcomeRouter,
  consentForm: consentFormRouter,
  externalLab: externalLabRouter,
  labTest: labTestRouter,
  // Wave 4
  dicomStudy: dicomStudyRouter,
  imagingRequest: imagingRequestRouter,
  labResultHistory: labResultHistoryRouter,
  telvetMedicalNote: telvetMedicalNoteRouter,
  telvetSession: telvetSessionRouter,
});

export type AppRouter = typeof appRouter;
