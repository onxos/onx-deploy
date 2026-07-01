#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D03-S01 Test Script
 * Finance: Chart of Accounts service layer validation
 */

import { eq, like } from "drizzle-orm";
import { db } from "@/server/db";
import { coaAccount as accountTable } from "@/server/db/schema/finance-foundation";
import * as svc from "@/server/services/finance.service";

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
  console.log("\n=== D03-S01 Finance Service Tests ===\n");

  const code = `TST-${Date.now()}`;
  let accountId: number | undefined;

  try {
    console.log("--- Chart of Accounts ---");

    const acc = await svc.createAccount({
      code,
      name: "Test Account",
      accountType: "ASSET",
      level: 2,
    });
    accountId = acc?.id;
    assert(!!accountId, "createAccount returns id");
    assert(acc?.accountType === "ASSET", "createAccount sets accountType");
    assert(
      acc?.isSystemAccount === false,
      "createAccount default isSystemAccount is false",
    );

    const accounts = await svc.listAccounts();
    assert(accounts.length > 0, "listAccounts returns array");

    const byCode = await svc.getAccountByCode(code);
    assert(byCode?.id === accountId, "getAccountByCode returns correct record");

    const updated = await svc.updateAccount(accountId ?? 0, {
      name: "Updated Account",
    });
    assert(updated?.name === "Updated Account", "updateAccount changes name");

    // Deactivate
    await svc.deactivateAccount(accountId ?? 0);
    const deactivated = await svc.getAccountById(accountId ?? 0);
    assert(
      deactivated?.isActive === false,
      "deactivateAccount sets isActive false",
    );

    // Duplicate code
    try {
      await svc.createAccount({
        code,
        name: "Dup",
        accountType: "ASSET",
        level: 1,
      });
      assert(false, "createAccount rejects duplicate code");
    } catch {
      assert(true, "createAccount rejects duplicate code");
    }

    // Invalid account type
    try {
      await svc.createAccount({
        code: `INVALID-${Date.now()}`,
        name: "Bad Type",
        accountType: "INVALID" as "ASSET",
        level: 1,
      });
      assert(false, "createAccount rejects invalid accountType");
    } catch {
      assert(true, "createAccount rejects invalid accountType");
    }

    console.log("\n--- Seed Default CoA ---");
    const seeded = await svc.seedDefaultCoA(999);
    // clean up seeded accounts
    await db.delete(accountTable).where(like(accountTable.code, "1%"));
    await db.delete(accountTable).where(like(accountTable.code, "2%"));
    await db.delete(accountTable).where(like(accountTable.code, "3%"));
    await db.delete(accountTable).where(like(accountTable.code, "4%"));
    await db.delete(accountTable).where(like(accountTable.code, "5%"));
    await db.delete(accountTable).where(like(accountTable.code, "6%"));
    assert(seeded.length > 0, "seedDefaultCoA creates accounts");
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (accountId)
      await db.delete(accountTable).where(eq(accountTable.id, accountId));
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
