#!/usr/bin/env bun
/**
 * Wave 5 verification: D11-S03, D11-S04, D11-S05, D12-S01, D12-S02
 * 45 checks (9 per system)
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
    failures.push(label);
  }
}

function fileExists(rel: string) {
  return existsSync(resolve(ROOT, rel));
}

// ── D11-S03 Mobile Clinic ────────────────────────────────────────────────────
console.log("\n[D11-S03] Mobile Clinic Schedule & Route");
check(
  "schema file exists",
  fileExists("src/server/db/schema/mobile-clinic-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/mobile-clinic.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/mobile-clinic.ts"),
);
check("layout exists", fileExists("src/app/mobile-clinic/layout.tsx"));
check("page exists", fileExists("src/app/mobile-clinic/page.tsx"));
check(
  "schema barrel exports mobile-clinic",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/db/schema.ts"), "utf-8");
    return (src as string).includes("mobile-clinic-foundation");
  })(),
);
check(
  "permissions includes mobile-clinic:read",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/lib/permissions.ts"), "utf-8");
    return (src as string).includes('"mobile-clinic:read"');
  })(),
);
check(
  "root.ts imports mobileClinicRouter",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/api/root.ts"), "utf-8");
    return (src as string).includes("mobileClinicRouter");
  })(),
);
check(
  "migration SQL references onx_mobile_clinic_route",
  (() => {
    const src = readFileSync(
      resolve(ROOT, "drizzle/0013_wave5_systems.sql"),
      "utf-8",
    );
    return (src as string).includes("onx_mobile_clinic_route");
  })(),
);

// ── D11-S04 Field Visit ──────────────────────────────────────────────────────
console.log("\n[D11-S04] Field Visit Record");
check(
  "schema file exists",
  fileExists("src/server/db/schema/field-visit-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/field-visit.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/field-visit.ts"),
);
check("layout exists", fileExists("src/app/field-visits/layout.tsx"));
check("page exists", fileExists("src/app/field-visits/page.tsx"));
check(
  "schema barrel exports field-visit",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/db/schema.ts"), "utf-8");
    return (src as string).includes("field-visit-foundation");
  })(),
);
check(
  "permissions includes field-visit:read",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/lib/permissions.ts"), "utf-8");
    return (src as string).includes('"field-visit:read"');
  })(),
);
check(
  "root.ts imports fieldVisitRouter",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/api/root.ts"), "utf-8");
    return (src as string).includes("fieldVisitRouter");
  })(),
);
check(
  "migration SQL references onx_field_visit",
  (() => {
    const src = readFileSync(
      resolve(ROOT, "drizzle/0013_wave5_systems.sql"),
      "utf-8",
    );
    return (src as string).includes("onx_field_visit");
  })(),
);

// ── D11-S05 Emergency Case ───────────────────────────────────────────────────
console.log("\n[D11-S05] Emergency Case Intake & Triage");
check(
  "schema file exists",
  fileExists("src/server/db/schema/emergency-case-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/emergency-case.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/emergency-case.ts"),
);
check("layout exists", fileExists("src/app/emergency/layout.tsx"));
check("page exists", fileExists("src/app/emergency/page.tsx"));
check(
  "schema barrel exports emergency-case",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/db/schema.ts"), "utf-8");
    return (src as string).includes("emergency-case-foundation");
  })(),
);
check(
  "permissions includes emergency:read",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/lib/permissions.ts"), "utf-8");
    return (src as string).includes('"emergency:read"');
  })(),
);
check(
  "root.ts imports emergencyCaseRouter",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/api/root.ts"), "utf-8");
    return (src as string).includes("emergencyCaseRouter");
  })(),
);
check(
  "migration SQL references onx_emergency_case",
  (() => {
    const src = readFileSync(
      resolve(ROOT, "drizzle/0013_wave5_systems.sql"),
      "utf-8",
    );
    return (src as string).includes("onx_emergency_case");
  })(),
);

// ── D12-S01 Regulatory Register ──────────────────────────────────────────────
console.log("\n[D12-S01] Regulatory Register");
check(
  "schema file exists",
  fileExists("src/server/db/schema/regulatory-register-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/regulatory-register.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/regulatory-register.ts"),
);
check("layout exists", fileExists("src/app/regulatory-register/layout.tsx"));
check("page exists", fileExists("src/app/regulatory-register/page.tsx"));
check(
  "schema barrel exports regulatory-register",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/db/schema.ts"), "utf-8");
    return (src as string).includes("regulatory-register-foundation");
  })(),
);
check(
  "permissions includes compliance:read",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/lib/permissions.ts"), "utf-8");
    return (src as string).includes('"compliance:read"');
  })(),
);
check(
  "root.ts imports regulatoryRegisterRouter",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/api/root.ts"), "utf-8");
    return (src as string).includes("regulatoryRegisterRouter");
  })(),
);
check(
  "migration SQL references onx_regulatory_requirement",
  (() => {
    const src = readFileSync(
      resolve(ROOT, "drizzle/0013_wave5_systems.sql"),
      "utf-8",
    );
    return (src as string).includes("onx_regulatory_requirement");
  })(),
);

// ── D12-S02 Licence & Certificate ───────────────────────────────────────────
console.log("\n[D12-S02] Licence & Certificate Tracker");
check(
  "schema file exists",
  fileExists("src/server/db/schema/licence-certificate-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/licence-certificate.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/licence-certificate.ts"),
);
check("layout exists", fileExists("src/app/licences/layout.tsx"));
check("page exists", fileExists("src/app/licences/page.tsx"));
check(
  "schema barrel exports licence-certificate",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/db/schema.ts"), "utf-8");
    return (src as string).includes("licence-certificate-foundation");
  })(),
);
check(
  "permissions includes compliance:write",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/lib/permissions.ts"), "utf-8");
    return (src as string).includes('"compliance:write"');
  })(),
);
check(
  "root.ts imports licenceCertificateRouter",
  (() => {
    const src = readFileSync(resolve(ROOT, "src/server/api/root.ts"), "utf-8");
    return (src as string).includes("licenceCertificateRouter");
  })(),
);
check(
  "migration SQL references onx_licence_certificate",
  (() => {
    const src = readFileSync(
      resolve(ROOT, "drizzle/0013_wave5_systems.sql"),
      "utf-8",
    );
    return (src as string).includes("onx_licence_certificate");
  })(),
);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Wave 5 verification: ${passed}/${passed + failed} checks passed`);
if (failures.length > 0) {
  console.error("\nFailed checks:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
} else {
  console.log("All Wave 5 checks passed ✅");
}
