import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple health check - just return ok status
    return NextResponse.json({
      ok: true,
      now: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        ok: false,
        now: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
