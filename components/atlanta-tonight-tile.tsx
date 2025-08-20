"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TonightData {
  bullets: string[]
}

export function AtlantaTonightTile() {
  const [data, setData] = useState<TonightData>({ bullets: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTonight = async () => {
      try {
        const response = await fetch("/api/tonight")
        if (response.ok) {
          const tonightData = await response.json()
          setData(tonightData)
        }
      } catch (error) {
        console.error("Failed to fetch tonight data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTonight()
    const interval = setInterval(fetchTonight, 120000) // Update every 2 minutes
    return () => clearInterval(interval)
  }, [])

  const defaultBullets = [
    "☄️ No new bright events",
    "🌌 Aurora requires Kp≥6 here",
    "☀️ Minor flare risk, expect quiet radio",
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Atlanta Tonight</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {loading
            ? defaultBullets.map((bullet, index) => <li key={index}>{bullet}</li>)
            : data.bullets.length > 0
              ? data.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)
              : defaultBullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
        </ul>
      </CardContent>
    </Card>
  )
}
