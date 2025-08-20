import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Helper to derive base URL from request headers instead of env var
function getBaseUrl() {
  const headersList = headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"

  // Use VERCEL_URL if available (server-side only), otherwise derive from headers
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return `${protocol}://${host}`
}

export async function GET() {
  try {
    const baseUrl = getBaseUrl()

    // Fetch current Kp to determine aurora visibility
    const kpResponse = await fetch(`${baseUrl}/api/kp`)
    let kp = null

    if (kpResponse.ok) {
      const kpData = await kpResponse.json()
      kp = kpData.kp
    }

    // Generate contextual bullets based on current conditions
    const bullets = []

    // Aurora visibility for Atlanta (requires higher Kp)
    if (kp !== null) {
      if (kp >= 6) {
        bullets.push("🌌 Aurora may be visible tonight!")
      } else if (kp >= 4) {
        bullets.push("🌌 Aurora possible, but unlikely at our latitude")
      } else {
        bullets.push("🌌 Aurora requires Kp≥6 here")
      }
    } else {
      bullets.push("🌌 Aurora requires Kp≥6 here")
    }

    // Check for recent solar activity
    const donkiResponse = await fetch(`${baseUrl}/api/donki`)
    let hasRecentActivity = false

    if (donkiResponse.ok) {
      const donkiData = await donkiResponse.json()
      const recentAlerts = donkiData.alerts?.filter((alert: any) => {
        const alertTime = new Date(alert.time)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return alertTime > oneDayAgo
      })
      hasRecentActivity = recentAlerts?.length > 0
    }

    if (hasRecentActivity) {
      bullets.push("☄️ Recent solar activity detected")
    } else {
      bullets.push("☄️ No new bright events")
    }

    // Radio conditions based on Kp
    if (kp !== null && kp >= 5) {
      bullets.push("📻 HF radio may be disrupted")
    } else {
      bullets.push("☀️ Minor flare risk, expect quiet radio")
    }

    return NextResponse.json({ bullets })
  } catch (error) {
    console.error("Tonight API error:", error)
    // Return default bullets on error
    return NextResponse.json({
      bullets: ["☄️ No new bright events", "🌌 Aurora requires Kp≥6 here", "☀️ Minor flare risk, expect quiet radio"],
    })
  }
}
