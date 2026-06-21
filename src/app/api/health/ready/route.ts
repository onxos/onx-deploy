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
  const heapRatio = memory.heapUsed / memory.heapTotal;
  checks.memory = heapRatio < 0.9 ? "ok" : "degraded";

  const ready = Object.values(checks).every((check) => check === "ok");

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
