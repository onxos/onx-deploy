#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D03-S02 Test Script
 * GL: Fiscal Period + Journal Entry service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { coaAccount as accountTable } from "@/server/db/schema/finance-foundation";
import {
  glEntry,
  glEntryLine,
  glPeriod,
} from "@/server/db/schema/gl-foundation";
import * as fSvc from "@/server/services/finance.service";
import * as svc from "@/server/services/gl.service";

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
  console.log("\n=== D03-S02 GL Service Tests ===\n");

  let periodId: number | undefined;
  let entryId: number | undefined;
  let acc1Id: number | undefined;
  let acc2Id: number | undefined;

  const accCode1 = `GL-TST1-${Date.now()}`;
  const accCode2 = `GL-TST2-${Date.now()}`;

  try {
    // Set up accounts
    const acc1 = await fSvc.createAccount({
      code: accCode1,
      name: "GL Test Asset",
      accountType: "ASSET",
      level: 2,
    });
    const acc2 = await fSvc.createAccount({
      code: accCode2,
      name: "GL Test Revenue",
      accountType: "REVENUE",
      level: 2,
    });
    acc1Id = acc1?.id;
    acc2Id = acc2?.id;
    assert(!!acc1Id && !!acc2Id, "Setup: created 2 GL test accounts");

    console.log("--- Period ---");

    const period = await svc.createPeriod({
      name: `FY-TST-${Date.now()}`,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
    });
    periodId = period?.id;
    assert(!!periodId, "createPeriod returns id");
    assert(period?.status === "OPEN", "createPeriod default status is OPEN");

    const periods = await svc.listPeriods();
    assert(periods.length > 0, "listPeriods returns array");

    console.log("\n--- Journal Entry ---");

    const entry = await svc.createEntry(
      {
        entryType: "JOURNAL",
        periodId: periodId ?? 0,
        branchId: 1,
        createdBy: "test",
        description: "Test journal entry",
      },
      [
        { accountId: acc1Id ?? 0, debit: "100", credit: "0" },
        { accountId: acc2Id ?? 0, debit: "0", credit: "100" },
      ],
    );
    entryId = entry?.id;
    assert(!!entryId, "createEntry returns id");
    assert(entry?.status === "DRAFT", "createEntry default status is DRAFT");
    assert(Number(entry?.totalDebit) === 100, "createEntry totalDebit = 100");
    assert(Number(entry?.totalCredit) === 100, "createEntry totalCredit = 100");

    const lines = await svc.getEntryLines(entryId ?? 0);
    assert(lines.length === 2, "getEntryLines returns 2 lines");

    // Post entry
    await svc.postEntry(entryId ?? 0);
    const posted = await svc.getEntryById(entryId ?? 0);
    assert(posted?.status === "POSTED", "postEntry sets status to POSTED");

    // Cannot post again
    try {
      await svc.postEntry(entryId ?? 0);
      assert(false, "postEntry rejects already-posted entry");
    } catch {
      assert(true, "postEntry rejects already-posted entry");
    }

    // Unbalanced entry
    try {
      await svc.createEntry(
        {
          entryType: "JOURNAL",
          periodId: periodId ?? 0,
          branchId: 1,
          createdBy: "test",
          description: "Unbalanced test",
        },
        [
          { accountId: acc1Id ?? 0, debit: "100", credit: "0" },
          { accountId: acc2Id ?? 0, debit: "0", credit: "50" }, // unbalanced
        ],
      );
      assert(false, "createEntry rejects unbalanced entry");
    } catch {
      assert(true, "createEntry rejects unbalanced entry");
    }

    // Close period
    const closed = await svc.closePeriod(periodId ?? 0);
    assert(closed?.status === "CLOSED", "closePeriod sets status to CLOSED");
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (entryId) {
      await db.delete(glEntryLine).where(eq(glEntryLine.entryId, entryId));
      await db.delete(glEntry).where(eq(glEntry.id, entryId));
    }
    if (periodId) await db.delete(glPeriod).where(eq(glPeriod.id, periodId));
    if (acc1Id)
      await db.delete(accountTable).where(eq(accountTable.id, acc1Id));
    if (acc2Id)
      await db.delete(accountTable).where(eq(accountTable.id, acc2Id));
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
