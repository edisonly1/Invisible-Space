"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KpData {
  kp: number | null
  updated: string | null
}

export function KpTile() {
  const [data, setData] = useState<KpData>({ kp: null, updated: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKp = async () => {
      try {
        const response = await fetch("/api/kp")
        if (response.ok) {
          const kpData = await response.json()
          setData(kpData)
        }
      } catch (error) {
        console.error("Failed to fetch Kp data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchKp()
    const interval = setInterval(fetchKp, 60000) // Revalidate every 60s
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "—"
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Estimated planetary Kp</CardTitle>
        <p className="text-xs text-muted-foreground">Updated {formatTime(data.updated)}</p>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2" aria-live="polite">
          {loading ? "—" : (data.kp ?? "—")}
        </div>
        <p className="text-sm text-muted-foreground">Kp≥5 implies possible aurora visibility at mid-latitudes</p>
      </CardContent>
    </Card>
  )
}
