import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  const checks = {
    database: "unknown",
    memory: "unknown",
  };

  try {
    await db.execute(sql`select 1`);
    checks.database = "ok";
  } catch {
    checks.database = "down";
  }

  const memory = process.memoryUsage();
  const heapTotal = Math.max(memory.heapTotal, 1);
  const heapRatio = memory.heapUsed / heapTotal;

  // Memory is exposed as telemetry and warning signal, not a hard readiness gate.
  // Some runtimes may report transient heap ratios above 1 during allocation cycles.
  checks.memory = heapRatio < 0.95 ? "ok" : "degraded";

  const ready = checks.database === "ok";

  return NextResponse.json(
    {
      status: ready ? "ok" : "degraded",
      checks,
      memory: {
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
      },
      timestamp: new Date().toISOString(),
    },
    { status: ready ? 200 : 503 },
  );
}
