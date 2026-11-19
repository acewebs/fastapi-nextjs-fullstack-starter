import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  const upstream = await fetch(`${BACKEND_URL}/health`, {
    headers: { "Content-Type": "application/json" },
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });
}
