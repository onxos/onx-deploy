#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D08-S01 Test Script
 * POS: Terminal + Shift service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { posShift, posTerminal } from "@/server/db/schema/pos-foundation";
import * as svc from "@/server/services/pos.service";

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
  console.log("\n=== D08-S01 POS Service Tests ===\n");

  const termCode = `POS-${Date.now()}`;
  let termId: number | undefined;
  let shiftId: number | undefined;

  try {
    console.log("--- Terminal ---");

    const term = await svc.createTerminal({
      branchId: 1,
      terminalCode: termCode,
      terminalName: "Test Terminal",
    });
    termId = term?.id;
    assert(!!termId, "createTerminal returns id");
    assert(
      term?.status === "ACTIVE",
      "createTerminal default status is ACTIVE",
    );
    assert(term?.terminalCode === termCode, "createTerminal sets terminalCode");

    const terminals = await svc.listTerminals(1);
    assert(terminals.length > 0, "listTerminals returns array");

    const fetched = await svc.getTerminalById(termId ?? 0);
    assert(fetched?.id === termId, "getTerminalById returns correct record");

    const updated = await svc.updateTerminal(termId ?? 0, {
      terminalName: "Updated Terminal",
    });
    assert(
      updated?.terminalName === "Updated Terminal",
      "updateTerminal changes terminalName",
    );

    // Duplicate code
    try {
      await svc.createTerminal({
        branchId: 1,
        terminalCode: termCode,
        terminalName: "Dup",
      });
      assert(false, "createTerminal rejects duplicate code");
    } catch {
      assert(true, "createTerminal rejects duplicate code");
    }

    console.log("\n--- Shift ---");

    const shift = await svc.openShift({
      terminalId: termId ?? 0,
      branchId: 1,
      cashierId: "cashier-user-1",
      openingBalance: "500",
    });
    shiftId = shift?.id;
    assert(!!shiftId, "openShift returns id");
    assert(shift?.status === "OPEN", "openShift status is OPEN");

    // Cannot open second shift on same terminal
    try {
      await svc.openShift({
        terminalId: termId ?? 0,
        branchId: 1,
        cashierId: "cashier-user-2",
        openingBalance: "0",
      });
      assert(false, "openShift rejects duplicate open shift on same terminal");
    } catch {
      assert(true, "openShift rejects duplicate open shift on same terminal");
    }

    const activeShift = await svc.getActiveShift(termId ?? 0);
    assert(
      activeShift?.id === shiftId,
      "getActiveShift returns the open shift",
    );

    await svc.closeShift(shiftId ?? 0, 490, "End of day");
    const closedShift = await db
      .select()
      .from(posShift)
      .where(eq(posShift.id, shiftId ?? 0));
    assert(
      closedShift[0]?.status === "CLOSED",
      "closeShift sets status to CLOSED",
    );

    const noShift = await svc.getActiveShift(termId ?? 0);
    assert(noShift === null, "getActiveShift returns null after close");
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (shiftId) await db.delete(posShift).where(eq(posShift.id, shiftId));
    if (termId) await db.delete(posTerminal).where(eq(posTerminal.id, termId));
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
