import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch from NOAA SWPC 1-minute Kp data
    const response = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Kp data")
    }

    const data = await response.json()

    // Get the most recent Kp value (last 3 hours max)
    const recent = data.slice(-180) // Last 3 hours of 1-minute data
    const latestEntry = recent[recent.length - 1]

    if (!latestEntry) {
      return NextResponse.json({ kp: null, updated: null })
    }

    const kp = Number.parseFloat(latestEntry[1])
    const updated = new Date(latestEntry[0]).toISOString()

    return NextResponse.json({ kp, updated })
  } catch (error) {
    console.error("Kp API error:", error)
    return NextResponse.json({ kp: null, updated: null })
  }
}
