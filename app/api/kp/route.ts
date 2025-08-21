import { NextResponse } from "next/server"
import { fetchKpData } from "@/lib/swpc"

export const runtime = "nodejs"
export const revalidate = 0
export const dynamic = "force-dynamic"

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  }

  try {
    const { kp, time } = await fetchKpData()

    return NextResponse.json(
      {
        kp,
        time,
        source: "noaa-estimated-planetary-k-index-1-minute.json",
      },
      { headers },
    )
  } catch (error) {
    console.error("Kp API error:", error)
    return NextResponse.json(
      { kp: null, time: null, source: "noaa-estimated-planetary-k-index-1-minute.json" },
      { headers },
    )
  }
}
