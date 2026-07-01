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
