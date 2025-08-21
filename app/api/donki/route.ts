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

    const fetchWithTimeout = async (url: string) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          next: { revalidate: 120 },
        })
        clearTimeout(timeoutId)
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }

    // Fetch solar flares and CMEs with fallback handling
    let flareResponse, cmeResponse
    try {
      ;[flareResponse, cmeResponse] = await Promise.all([
        fetchWithTimeout(
          `https://api.nasa.gov/DONKI/FLR?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${apiKey}`,
        ),
        fetchWithTimeout(
          `https://api.nasa.gov/DONKI/CME?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${apiKey}`,
        ),
      ])
    } catch (fetchError) {
      console.error("NASA DONKI API fetch failed:", fetchError)
      return NextResponse.json({
        alerts: [
          {
            type: "Solar Flare M2.1",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            text: "Active region AR3536, moderate solar flare detected",
          },
          {
            type: "Coronal Mass Ejection",
            time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
            text: "~450 km/s, Earth-directed component possible",
          },
          {
            type: "Solar Flare C8.7",
            time: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
            text: "Active region AR3535, minor solar activity",
          },
        ],
        demo: true,
      })
    }

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
    return NextResponse.json({
      alerts: [
        {
          type: "Solar Flare M1.8",
          time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          text: "Active region AR3534, moderate solar activity (demo data)",
        },
        {
          type: "Coronal Mass Ejection",
          time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          text: "~380 km/s, glancing blow trajectory (demo data)",
        },
      ],
      demo: true,
    })
  }
}
