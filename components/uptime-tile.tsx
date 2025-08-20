"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UptimeTile() {
  const [uptime, setUptime] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const response = await fetch("/api/uptime", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setUptime(data.percentage)
        }
      } catch (error) {
        console.error("Failed to fetch uptime:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUptime()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">24h Uptime</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2">{loading ? "—" : uptime !== null ? `${uptime}%` : "N/A"}</div>
        <p className="text-sm text-muted-foreground">
          {uptime === null ? "Logging is optional" : "System reliability"}
        </p>
      </CardContent>
    </Card>
  )
}
