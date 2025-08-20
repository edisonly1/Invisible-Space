import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching Kp data from NOAA SWPC...")

    // Fetch from NOAA SWPC 1-minute Kp data
    const response = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", {
      next: { revalidate: 60 },
    })

    console.log("[v0] NOAA response status:", response.status)

    if (!response.ok) {
      console.log("[v0] NOAA API failed, using demo data")
      return NextResponse.json({
        kp: 2.3,
        updated: new Date().toISOString(),
        demo: true,
      })
    }

    const data = await response.json()
    console.log("[v0] Received data entries:", data?.length)

    // Get the most recent Kp value (last 3 hours max)
    const recent = data.slice(-180) // Last 3 hours of 1-minute data
    const latestEntry = recent[recent.length - 1]

    if (!latestEntry) {
      console.log("[v0] No recent entries found, using demo data")
      return NextResponse.json({
        kp: 1.7,
        updated: new Date().toISOString(),
        demo: true,
      })
    }

    const kp = Number.parseFloat(latestEntry[1])
    const updated = new Date(latestEntry[0]).toISOString()

    console.log("[v0] Successfully parsed Kp:", kp, "at", updated)
    return NextResponse.json({ kp, updated })
  } catch (error) {
    console.error("Kp API error:", error)
    console.log("[v0] Exception caught, returning demo data")
    return NextResponse.json({
      kp: 2.0,
      updated: new Date().toISOString(),
      demo: true,
      error: "External API unavailable",
    })
  }
}
