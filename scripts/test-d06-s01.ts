#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D06-S01 Test Script
 * Insurance: Insurance Company service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { insuranceCompany as insTable } from "@/server/db/schema/insurance-foundation";
import * as svc from "@/server/services/insurance.service";

let pass = 0;
let fail = 0;
const errors: string[] = [];

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    fail++;
    errors.push(label);
  }
}

async function run() {
  console.log("\n=== D06-S01 Insurance Service Tests ===\n");

  const insCode = `INS-${Date.now()}`;
  let insId: number | undefined;

  try {
    const ins = await svc.createInsuranceCompany({
      code: insCode,
      name: "Test Insurance Co",
      creditDays: 30,
    });
    insId = ins?.id;
    assert(!!insId, "createInsuranceCompany returns id");
    assert(
      ins?.status === "ACTIVE",
      "createInsuranceCompany default status is ACTIVE",
    );

    const list = await svc.listInsuranceCompanies();
    assert(list.length > 0, "listInsuranceCompanies returns array");

    const fetched = await svc.getInsuranceCompanyById(insId ?? 0);
    assert(
      fetched?.id === insId,
      "getInsuranceCompanyById returns correct record",
    );

    const updated = await svc.updateInsuranceCompany(insId ?? 0, {
      name: "Updated Insurance Co",
    });
    assert(
      updated?.name === "Updated Insurance Co",
      "updateInsuranceCompany changes name",
    );

    // Status update
    const suspended = await svc.updateInsuranceCompany(insId ?? 0, {
      status: "SUSPENDED",
    });
    assert(
      suspended?.status === "SUSPENDED",
      "updateInsuranceCompany sets status SUSPENDED",
    );

    // Filter by status
    const activeOnly = await svc.listInsuranceCompanies({ status: "ACTIVE" });
    assert(
      activeOnly.every((c) => c.status === "ACTIVE"),
      "listInsuranceCompanies filters by status",
    );

    // Duplicate code
    try {
      await svc.createInsuranceCompany({ code: insCode, name: "Dup" });
      assert(false, "createInsuranceCompany rejects duplicate code");
    } catch {
      assert(true, "createInsuranceCompany rejects duplicate code");
    }

    // Not found
    try {
      await svc.updateInsuranceCompany(999999, { name: "X" });
      assert(false, "updateInsuranceCompany throws NOT_FOUND for missing id");
    } catch {
      assert(true, "updateInsuranceCompany throws NOT_FOUND for missing id");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (insId) await db.delete(insTable).where(eq(insTable.id, insId));
  }

  console.log(`\n=== Results: ${pass} PASS, ${fail} FAIL ===`);
  if (errors.length > 0) {
    console.error("Failed:", errors);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
