#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D05-S01 Test Script
 * Inventory: Item Category + Item service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  itemCategory,
  item as itemTable,
} from "@/server/db/schema/inventory-foundation";
import * as svc from "@/server/services/inventory.service";

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
  console.log("\n=== D05-S01 Inventory Service Tests ===\n");

  const catCode = `CAT-${Date.now()}`;
  const sku = `SKU-${Date.now()}`;
  const barcode = `BC-${Date.now()}`;
  let catId: number | undefined;
  let itemId: number | undefined;

  try {
    console.log("--- Item Category ---");

    const cat = await svc.createItemCategory({
      code: catCode,
      name: "Test Category",
    });
    catId = cat?.id;
    assert(!!catId, "createItemCategory returns id");
    assert(cat?.code === catCode, "createItemCategory sets code");

    const cats = await svc.listItemCategories(true);
    assert(cats.length > 0, "listItemCategories returns array");

    const updatedCat = await svc.updateItemCategory(catId ?? 0, {
      name: "Updated Cat",
    });
    assert(
      updatedCat?.name === "Updated Cat",
      "updateItemCategory changes name",
    );

    // Duplicate code
    try {
      await svc.createItemCategory({ code: catCode, name: "Dup" });
      assert(false, "createItemCategory rejects duplicate code");
    } catch {
      assert(true, "createItemCategory rejects duplicate code");
    }

    console.log("\n--- Item ---");

    const newItem = await svc.createItem({
      sku,
      name: "Test Drug",
      barcode,
      categoryId: catId,
      itemType: "MEDICATION",
      unit: "TABLET",
      unitPrice: "12.5",
      taxRate: "0.15",
      requiresPrescription: true,
    });
    itemId = newItem?.id;
    assert(!!itemId, "createItem returns id");
    assert(newItem?.sku === sku, "createItem sets sku");
    assert(
      newItem?.requiresPrescription === true,
      "createItem sets requiresPrescription",
    );

    const items = await svc.listItems();
    assert(items.length > 0, "listItems returns array");

    const fetchedItem = await svc.getItemById(itemId ?? 0);
    assert(fetchedItem?.id === itemId, "getItemById returns correct record");

    const bySku = await svc.getItemBySku(sku);
    assert(bySku?.id === itemId, "getItemBySku returns correct record");

    const updatedItem = await svc.updateItem(itemId ?? 0, {
      unitPrice: "15.0",
    });
    assert(
      Number(updatedItem?.unitPrice) === 15.0,
      "updateItem changes unitPrice",
    );

    // Duplicate SKU
    try {
      await svc.createItem({
        sku,
        name: "Dup",
        unit: "PIECE",
        unitPrice: "1",
        itemType: "PRODUCT",
      });
      assert(false, "createItem rejects duplicate sku");
    } catch {
      assert(true, "createItem rejects duplicate sku");
    }

    // Duplicate barcode
    try {
      await svc.createItem({
        sku: `SKU2-${Date.now()}`,
        barcode,
        name: "DupBC",
        unit: "PIECE",
        unitPrice: "1",
        itemType: "PRODUCT",
      });
      assert(false, "createItem rejects duplicate barcode");
    } catch {
      assert(true, "createItem rejects duplicate barcode");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (itemId) await db.delete(itemTable).where(eq(itemTable.id, itemId));
    if (catId) await db.delete(itemCategory).where(eq(itemCategory.id, catId));
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
