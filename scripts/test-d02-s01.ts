#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D02-S01 Test Script
 * HR: Department + Employee service layer validation
 */

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { department, employee } from "@/server/db/schema/hr-foundation";
import * as svc from "@/server/services/hr.service";

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
  console.log("\n=== D02-S01 HR Service Tests ===\n");

  const deptCode = `DEPT-${Date.now()}`;
  const empNumber = `EMP-${Date.now()}`;
  let deptId: number | undefined;
  let empId: number | undefined;

  try {
    console.log("--- Department ---");

    const dept = await svc.createDepartment({
      branchId: 1,
      code: deptCode,
      name: "Test Dept",
    });
    deptId = dept?.id;
    assert(!!deptId, "createDepartment returns id");
    assert(dept?.code === deptCode, "createDepartment sets code");

    const depts = await svc.listDepartments(1);
    assert(depts.length > 0, "listDepartments returns array");

    const fetchedDept = await svc.getDepartmentById(deptId ?? 0);
    assert(
      fetchedDept?.id === deptId,
      "getDepartmentById returns correct record",
    );

    const updatedDept = await svc.updateDepartment(deptId ?? 0, {
      name: "Updated Dept",
    });
    assert(
      updatedDept?.name === "Updated Dept",
      "updateDepartment changes name",
    );

    // Duplicate code
    try {
      await svc.createDepartment({ branchId: 1, code: deptCode, name: "Dup" });
      assert(false, "createDepartment rejects duplicate code");
    } catch {
      assert(true, "createDepartment rejects duplicate code");
    }

    console.log("\n--- Employee ---");

    const emp = await svc.createEmployee({
      branchId: 1,
      employeeNumber: empNumber,
      firstName: "Jane",
      lastName: "Doe",
      email: `${empNumber}@test.local`,
      hireDate: "2024-01-01",
      departmentId: deptId,
      employmentType: "FULL_TIME",
    });
    empId = emp?.id;
    assert(!!empId, "createEmployee returns id");
    assert(emp?.status === "ACTIVE", "createEmployee default status is ACTIVE");

    const emps = await svc.listEmployees(1);
    assert(emps.length > 0, "listEmployees returns array");

    const fetchedEmp = await svc.getEmployeeById(empId ?? 0);
    assert(fetchedEmp?.id === empId, "getEmployeeById returns correct record");

    const updatedEmp = await svc.updateEmployee(empId ?? 0, {
      jobTitle: "Vet Tech",
    });
    assert(
      updatedEmp?.jobTitle === "Vet Tech",
      "updateEmployee changes jobTitle",
    );

    await svc.terminateEmployee(empId ?? 0, "2025-01-01");
    const terminated = await svc.getEmployeeById(empId ?? 0);
    assert(
      terminated?.status === "TERMINATED",
      "terminateEmployee sets status to TERMINATED",
    );

    // Duplicate employee number
    try {
      await svc.createEmployee({
        branchId: 1,
        employeeNumber: empNumber,
        firstName: "A",
        lastName: "B",
        email: `dup-${empNumber}@test.local`,
        hireDate: "2024-01-01",
      });
      assert(false, "createEmployee rejects duplicate employee number");
    } catch {
      assert(true, "createEmployee rejects duplicate employee number");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    fail++;
  } finally {
    if (empId) await db.delete(employee).where(eq(employee.id, empId));
    if (deptId) await db.delete(department).where(eq(department.id, deptId));
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
