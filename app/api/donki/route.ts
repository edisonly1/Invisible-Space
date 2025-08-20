import { NextResponse } from "next/server"

interface DonkiEvent {
  eventType: string
  beginTime: string
  classType?: string
  sourceLocation?: string
  note?: string
  cmeAnalyses?: Array<{
    speed?: number
  }>
}

export async function GET() {
  try {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago

    const startDateStr = startDate.toISOString().split("T")[0]
    const endDateStr = endDate.toISOString().split("T")[0]

    const apiKey = process.env.NASA_DONKI_API_KEY || "9YZv0WxJ982HsNHoxu0dNtR9UKj9nhtdlKwpplEa"

    // Fetch solar flares and CMEs
    const [flareResponse, cmeResponse] = await Promise.all([
      fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${apiKey}`, {
        next: { revalidate: 120 },
      }),
      fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${apiKey}`, {
        next: { revalidate: 120 },
      }),
    ])

    const alerts = []

    // Process solar flares
    if (flareResponse.ok) {
      const flares: DonkiEvent[] = await flareResponse.json()
      for (const flare of flares.slice(0, 4)) {
        if (flare.beginTime) {
          alerts.push({
            type: `Solar Flare ${flare.classType || "Unknown"}`,
            time: flare.beginTime,
            text: `Active region ${flare.sourceLocation || "unknown"}${flare.note ? `, ${flare.note.substring(0, 50)}...` : ""}`,
          })
        }
      }
    }

    // Process CMEs
    if (cmeResponse.ok) {
      const cmes: DonkiEvent[] = await cmeResponse.json()
      for (const cme of cmes.slice(0, 4)) {
        if (cme.beginTime) {
          const speed = cme.cmeAnalyses?.[0]?.speed
          alerts.push({
            type: "Coronal Mass Ejection",
            time: cme.beginTime,
            text: `${speed ? `~${Math.round(speed)} km/s` : "Speed unknown"}${cme.note ? `, ${cme.note.substring(0, 50)}...` : ""}`,
          })
        }
      }
    }

    // Sort by time (most recent first)
    alerts.sort((a, b) => {
      const dateA = new Date(a.time)
      const dateB = new Date(b.time)
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({ alerts: alerts.slice(0, 8) })
  } catch (error) {
    console.error("DONKI API error:", error)
    return NextResponse.json({ alerts: [] })
  }
}
