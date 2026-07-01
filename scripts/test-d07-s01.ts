#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D07-S01 Test Script
 * CRM: Client + Pet service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  client as clientTable,
  pet as petTable,
} from "@/server/db/schema/crm-foundation";
import * as svc from "@/server/services/crm.service";

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

async function cleanup(email: string, microchip?: string) {
  if (microchip)
    await db.delete(petTable).where(eq(petTable.microchipNumber, microchip));
  await db.delete(clientTable).where(eq(clientTable.email, email));
}

async function run() {
  console.log("\n=== D07-S01 CRM Service Tests ===\n");

  const testEmail = `crm-test-${Date.now()}@test.local`;
  const testMicrochip = `CHIP-${Date.now()}`;
  let clientId: number | undefined;
  let petId: number | undefined;

  try {
    // --- Client Tests ---
    console.log("--- Client ---");

    const newClient = await svc.createClient({
      branchId: 1,
      firstName: "Test",
      lastName: "Owner",
      phone: "0500000001",
      email: testEmail,
      country: "SA",
    });
    clientId = newClient?.id;
    assert(!!clientId, "createClient returns record with id");
    assert(newClient?.firstName === "Test", "createClient sets firstName");
    assert(
      newClient?.loyaltyTier === "STANDARD",
      "createClient default loyaltyTier is STANDARD",
    );

    const listed = await svc.listClients(1);
    assert(
      listed.length > 0,
      "listClients returns non-empty array for branch 1",
    );

    const fetched = await svc.getClientById(clientId ?? 0);
    assert(fetched?.id === clientId, "getClientById returns correct record");

    const updated = await svc.updateClient(clientId ?? 0, {
      firstName: "Updated",
    });
    assert(updated?.firstName === "Updated", "updateClient changes firstName");

    // Not found
    try {
      await svc.updateClient(999999, { firstName: "X" });
      assert(false, "updateClient throws NOT_FOUND for missing id");
    } catch {
      assert(true, "updateClient throws NOT_FOUND for missing id");
    }

    // --- Pet Tests ---
    console.log("\n--- Pet ---");

    if (clientId) {
      const newPet = await svc.createPet({
        clientId,
        branchId: 1,
        name: "Fluffy",
        species: "Cat",
        breed: "Persian",
        gender: "F",
        microchipNumber: testMicrochip,
        isNeutered: false,
      });
      petId = newPet?.id;
      assert(!!petId, "createPet returns record with id");
      assert(newPet?.name === "Fluffy", "createPet sets name");
      assert(newPet?.species === "Cat", "createPet sets species");

      const pets = await svc.listPets({ clientId });
      assert(
        pets.some((p) => p.id === petId),
        "listPets filters by clientId",
      );

      const fetchedPet = await svc.getPetById(petId ?? 0);
      assert(fetchedPet?.id === petId, "getPetById returns correct record");

      const updatedPet = await svc.updatePet(petId ?? 0, { name: "Fluffy2" });
      assert(updatedPet?.name === "Fluffy2", "updatePet changes name");

      // Duplicate microchip
      try {
        await svc.createPet({
          clientId,
          branchId: 1,
          name: "DupChip",
          species: "Dog",
          microchipNumber: testMicrochip,
        });
        assert(false, "createPet rejects duplicate microchip");
      } catch {
        assert(true, "createPet rejects duplicate microchip");
      }

      // Inactive client
      await svc.deactivateClient(clientId ?? 0);
      try {
        await svc.createPet({
          clientId,
          branchId: 1,
          name: "ShouldFail",
          species: "Dog",
        });
        assert(false, "createPet rejects inactive client");
      } catch {
        assert(true, "createPet rejects inactive client");
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    await cleanup(testEmail, testMicrochip);
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
