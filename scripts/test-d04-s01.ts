#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D04-S01 Test Script
 * Procurement: Vendor Master service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { vendor as vendorTable } from "@/server/db/schema/procurement-foundation";
import * as svc from "@/server/services/procurement.service";

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
  console.log("\n=== D04-S01 Procurement Service Tests ===\n");

  const vendorCode = `VND-${Date.now()}`;
  let vendorId: number | undefined;

  try {
    const v = await svc.createVendor({
      code: vendorCode,
      name: "Test Vendor Co",
      vendorType: "SUPPLIER",
      paymentTermsDays: 30,
      creditLimit: "10000",
      country: "SA",
    });
    vendorId = v?.id;
    assert(!!vendorId, "createVendor returns id");
    assert(v?.status === "ACTIVE", "createVendor default status is ACTIVE");
    assert(
      v?.qualificationStatus === "PENDING",
      "createVendor default qualificationStatus is PENDING",
    );

    const vendors = await svc.listVendors();
    assert(vendors.length > 0, "listVendors returns array");

    const fetched = await svc.getVendorById(vendorId ?? 0);
    assert(fetched?.id === vendorId, "getVendorById returns correct record");

    const updated = await svc.updateVendor(vendorId ?? 0, {
      name: "Updated Vendor",
    });
    assert(updated?.name === "Updated Vendor", "updateVendor changes name");

    await svc.qualifyVendor(vendorId ?? 0, "APPROVED");
    const qualified = await svc.getVendorById(vendorId ?? 0);
    assert(
      qualified?.qualificationStatus === "APPROVED",
      "qualifyVendor sets APPROVED",
    );

    await svc.qualifyVendor(vendorId ?? 0, "REJECTED");
    const rejected = await svc.getVendorById(vendorId ?? 0);
    assert(
      rejected?.qualificationStatus === "REJECTED",
      "qualifyVendor sets REJECTED",
    );

    // Duplicate code
    try {
      await svc.createVendor({ code: vendorCode, name: "Dup", country: "SA" });
      assert(false, "createVendor rejects duplicate code");
    } catch {
      assert(true, "createVendor rejects duplicate code");
    }

    // Not found
    try {
      await svc.updateVendor(999999, { name: "X" });
      assert(false, "updateVendor throws NOT_FOUND for missing id");
    } catch {
      assert(true, "updateVendor throws NOT_FOUND for missing id");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (vendorId)
      await db.delete(vendorTable).where(eq(vendorTable.id, vendorId));
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
