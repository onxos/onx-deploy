import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "onx-deploy",
    environment: process.env.NODE_ENV ?? "unknown",
    timestamp: new Date().toISOString(),
  });
}
