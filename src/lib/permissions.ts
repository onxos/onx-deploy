export const ROLES = [
  "guest",
  "viewer",
  "operator",
  "editor",
  "admin",
  "founder",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LEVELS: Record<Role, number> = {
  founder: 0,
  admin: 1,
  editor: 2,
  operator: 3,
  viewer: 4,
  guest: 5,
};

export const PERMISSIONS = [
  "admin:read",
  "analytics:read",
  "article:create",
  "article:update",
  "article:delete",
  "gap:update",
  "sech:update",
  "user:delete",
  "user:updateRole",
  // Foundation P0 — org/tenant/RBAC management (OCMBR-003)
  "org:read",
  "org:write",
  "tenant:read",
  "tenant:write",
  "rbac:manage",
  "audit:read",
  "events:read",
  // Wave 1 — D07-S01 CRM (OCMBR-004)
  "crm:read",
  "crm:write",
  // Wave 1 — D02-S01 HR (OCMBR-004)
  "hr:read",
  "hr:write",
  // Wave 1 — D05-S01 Inventory (OCMBR-004)
  "inventory:read",
  "inventory:write",
  // Wave 1 — D04-S01 Procurement (OCMBR-004)
  "procurement:read",
  "procurement:write",
  // Wave 1 — D06-S01 Insurance (OCMBR-004)
  "insurance:read",
  "insurance:write",
  // Wave 1 — D03-S01 Finance / D03-S02 GL (OCMBR-004)
  "finance:read",
  "finance:write",
  // Wave 1 — D09-S01 Clinical (OCMBR-004)
  "clinical:read",
  "clinical:write",
  // Wave 1 — D08-S01 POS (OCMBR-004)
  "pos:read",
  "pos:write",
  // Wave 2 — D02-S03 Attendance (OCMBR-005)
  "attendance:read",
  "attendance:write",
  // Wave 2 — D02-S04 Leave (OCMBR-005)
  "leave:read",
  "leave:write",
  // Wave 2 — D03-S03 Accounts Receivable (OCMBR-005)
  "ar:read",
  "ar:write",
  // Wave 2 — D04-S09 Approval Workflow (OCMBR-005)
  "approval:read",
  "approval:write",
  // Wave 2 — D05-S04 Stock Movement (OCMBR-005)
  "stock:read",
  "stock:write",
  // Wave 2 — D09-S02 Appointments (OCMBR-005)
  "appointment:read",
  "appointment:write",
  // Wave 2 — D09-S05 Vaccination (OCMBR-005)
  "vaccination:read",
  "vaccination:write",
  // Wave 2b — D02-S05 Payroll (OCMBR-005)
  "payroll:read",
  "payroll:write",
  // Wave 2b — D04-S04 Purchase Order (OCMBR-005)
  "purchase-order:read",
  "purchase-order:write",
  // Wave 2b — D05-S02 Inventory Locations (OCMBR-005)
  "inventory-location:read",
  "inventory-location:write",
  // Wave 2b — D05-S03 Item Batches (OCMBR-005)
  "item-batch:read",
  "item-batch:write",
  // Wave 2b — D05-S05 Reorder (OCMBR-005)
  "reorder:read",
  "reorder:write",
  // Wave 2b — D09-S03 SOAP Notes (OCMBR-005)
  "soap-note:read",
  "soap-note:write",
  // Wave 2c — D03-S04 Accounts Payable (OCMBR-005)
  "ap:read",
  "ap:write",
  // Wave 2c — D04-S05 GRN (OCMBR-005)
  "grn:read",
  "grn:write",
  // Wave 2c — D06-S04 Insurance Claim (OCMBR-005)
  "claim:read",
  "claim:write",
  // Wave 2d — D09-S04 Treatment Plan (OCMBR-005)
  "treatment-plan:read",
  "treatment-plan:write",
  // Wave 2d — D03-S05 Bank Reconciliation (OCMBR-005)
  "bank-recon:read",
  "bank-recon:write",
  // Wave 2d — D04-S06 Supplier Returns (OCMBR-005)
  "supplier-return:read",
  "supplier-return:write",
  // Wave 2d — D09-S06 Prescription (OCMBR-005)
  "prescription:read",
  "prescription:write",
  // Wave 2e — D08-S02 Service & Product Catalogue (OCMBR-005)
  "catalogue:read",
  "catalogue:write",
  // Wave 2e — D08-S05 Daily Cash Reconciliation (OCMBR-005)
  "cash-recon:read",
  "cash-recon:write",
  // Wave 2e — D08-S09 Shift Management (OCMBR-005)
  "shift-mgmt:read",
  "shift-mgmt:write",
  // Wave 2e — D02-S02 Recruitment & Onboarding (OCMBR-005)
  "recruitment:read",
  "recruitment:write",
  // Wave 2e — D07-S02 Pet Profile (OCMBR-005)
  "pet-profile:read",
  "pet-profile:write",
  // Wave 2f — D09-S07 Surgical Theatre (OCMBR-005)
  "surgical:read",
  "surgical:write",
  // Wave 2f — D09-S08 Hospitalisation (OCMBR-005)
  "inpatient:read",
  "inpatient:write",
  // Wave 2f — D09-S09 Referral Management (OCMBR-005)
  "referral:read",
  "referral:write",
  // Wave 2f — D08-S03 Discount & Coupon Engine (OCMBR-005)
  "discount:read",
  "discount:write",
  // Wave 2f — D08-S04 Receipt & Invoice (OCMBR-005)
  "receipt:read",
  "receipt:write",
  // Wave 3 — D09-S10 Clinical Outcome Tracking (OCMBR-005)
  "clinical-outcome:read",
  "clinical-outcome:write",
  // Wave 3 — D09-S11 Consent Forms (OCMBR-005)
  "consent:read",
  "consent:write",
  // Wave 3 — D10-S01 Lab Test Request (OCMBR-005)
  "lab:read",
  "lab:write",
  // Wave 3 — D10-S02 Analyser Device (OCMBR-005)
  "analyser:read",
  "analyser:write",
  // Wave 3 — D10-S03 External Lab (OCMBR-005)
  "external-lab:read",
  "external-lab:write",
  // Wave 4 — D10-S04 Lab Result History (OCMBR-005)
  // (reuses lab:read / lab:write)
  // Wave 4 — D10-S05 Imaging Request (OCMBR-005)
  "imaging:read",
  "imaging:write",
  // Wave 4 — D11-S01 TeleVet Session (OCMBR-005)
  "televet:read",
  "televet:write",
  // Wave 5 — D11-S03 Mobile Clinic (OCMBR-005)
  "mobile-clinic:read",
  "mobile-clinic:write",
  // Wave 5 — D11-S04 Field Visit (OCMBR-005)
  "field-visit:read",
  "field-visit:write",
  // Wave 5 — D11-S05 Emergency (OCMBR-005)
  "emergency:read",
  "emergency:write",
  // Wave 5 — D12-S01/S02 Compliance (OCMBR-005)
  "compliance:read",
  "compliance:write",
  // Wave 6 — D11-S06/S07/S08 Emergency Dispatch + On-call + Availability (OCMBR-005)
  "oncall:read",
  "oncall:write",
  "availability:read",
  "availability:write",
  // Wave 7 — D13-S01 Training (OCMBR-005)
  "training:read",
  "training:write",
  // Wave 8 — D13-S02..05 Appraisal + Analytics (OCMBR-005)
  "appraisal:read",
  "appraisal:write",
  "analytics:read",
  "analytics:write",
  "intelligence:read",
  "intelligence:write",
  "reporting:read",
  "reporting:write",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  founder: PERMISSIONS,
  admin: [
    "admin:read",
    "analytics:read",
    "article:create",
    "article:update",
    "article:delete",
    "gap:update",
    "sech:update",
    "user:delete",
    "user:updateRole",
    "org:read",
    "org:write",
    "tenant:read",
    "tenant:write",
    "rbac:manage",
    "audit:read",
    "events:read",
    "crm:read",
    "crm:write",
    "hr:read",
    "hr:write",
    "inventory:read",
    "inventory:write",
    "procurement:read",
    "procurement:write",
    "insurance:read",
    "insurance:write",
    "finance:read",
    "finance:write",
    "clinical:read",
    "clinical:write",
    "pos:read",
    "pos:write",
    "attendance:read",
    "attendance:write",
    "leave:read",
    "leave:write",
    "ar:read",
    "ar:write",
    "approval:read",
    "approval:write",
    "stock:read",
    "stock:write",
    "appointment:read",
    "appointment:write",
    "vaccination:read",
    "vaccination:write",
    "payroll:read",
    "payroll:write",
    "purchase-order:read",
    "purchase-order:write",
    "inventory-location:read",
    "inventory-location:write",
    "item-batch:read",
    "item-batch:write",
    "reorder:read",
    "reorder:write",
    "soap-note:read",
    "soap-note:write",
    "ap:read",
    "ap:write",
    "grn:read",
    "grn:write",
    "claim:read",
    "claim:write",
    "treatment-plan:read",
    "treatment-plan:write",
    "bank-recon:read",
    "bank-recon:write",
    "supplier-return:read",
    "supplier-return:write",
    "prescription:read",
    "prescription:write",
    "catalogue:read",
    "catalogue:write",
    "cash-recon:read",
    "cash-recon:write",
    "shift-mgmt:read",
    "shift-mgmt:write",
    "recruitment:read",
    "recruitment:write",
    "pet-profile:read",
    "pet-profile:write",
    "surgical:read",
    "surgical:write",
    "inpatient:read",
    "inpatient:write",
    "referral:read",
    "referral:write",
    "discount:read",
    "discount:write",
    "receipt:read",
    "receipt:write",
    "clinical-outcome:read",
    "clinical-outcome:write",
    "consent:read",
    "consent:write",
    "lab:read",
    "lab:write",
    "analyser:read",
    "analyser:write",
    "external-lab:read",
    "external-lab:write",
    "imaging:read",
    "imaging:write",
    "televet:read",
    "televet:write",
    "mobile-clinic:read",
    "mobile-clinic:write",
    "field-visit:read",
    "field-visit:write",
    "emergency:read",
    "emergency:write",
    "compliance:read",
    "compliance:write",
    "oncall:read",
    "oncall:write",
    "availability:read",
    "availability:write",
    "training:read",
    "training:write",
    "appraisal:read",
    "appraisal:write",
    "analytics:read",
    "analytics:write",
    "intelligence:read",
    "intelligence:write",
    "reporting:read",
    "reporting:write",
  ],
  editor: [
    "analytics:read",
    "article:create",
    "article:update",
    "gap:update",
    "org:read",
    "crm:read",
    "hr:read",
    "inventory:read",
    "procurement:read",
    "insurance:read",
    "finance:read",
    "clinical:read",
    "pos:read",
    "attendance:read",
    "leave:read",
    "ar:read",
    "approval:read",
    "stock:read",
    "appointment:read",
    "vaccination:read",
    "payroll:read",
    "purchase-order:read",
    "inventory-location:read",
    "item-batch:read",
    "reorder:read",
    "soap-note:read",
    "ap:read",
    "grn:read",
    "claim:read",
    "treatment-plan:read",
    "bank-recon:read",
    "supplier-return:read",
    "prescription:read",
    "catalogue:read",
    "cash-recon:read",
    "shift-mgmt:read",
    "recruitment:read",
    "pet-profile:read",
    "surgical:read",
    "inpatient:read",
    "referral:read",
    "discount:read",
    "receipt:read",
  ],
  operator: [
    "article:create",
    "gap:update",
    "sech:update",
    "org:read",
    "crm:read",
    "inventory:read",
    "clinical:read",
    "pos:read",
    "pos:write",
    "appointment:read",
    "appointment:write",
    "vaccination:read",
    "stock:read",
    "inventory-location:read",
    "item-batch:read",
    "soap-note:read",
    "soap-note:write",
    "treatment-plan:read",
    "treatment-plan:write",
    "prescription:read",
    "prescription:write",
    "catalogue:read",
    "cash-recon:read",
    "shift-mgmt:read",
    "shift-mgmt:write",
    "pet-profile:read",
    "pet-profile:write",
    "surgical:read",
    "surgical:write",
    "inpatient:read",
    "inpatient:write",
    "referral:read",
    "referral:write",
    "discount:read",
    "receipt:read",
  ],
  viewer: ["analytics:read"],
  guest: [],
};

export function isRole(role: string | null | undefined): role is Role {
  return ROLES.includes(role as Role);
}

export function normalizeRole(role: string | null | undefined): Role {
  return isRole(role) ? role : "operator";
}

export function hasMinimumRole(
  userRole: string | null | undefined,
  requiredRole: Role,
) {
  return ROLE_LEVELS[normalizeRole(userRole)] <= ROLE_LEVELS[requiredRole];
}

export function hasPermission(
  userRole: string | null | undefined,
  permission: Permission,
) {
  return ROLE_PERMISSIONS[normalizeRole(userRole)].includes(permission);
}
