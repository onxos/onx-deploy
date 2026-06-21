import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  const startedAt = Date.now();

  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({
      status: "ok",
      connected: true,
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "down",
        connected: false,
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
