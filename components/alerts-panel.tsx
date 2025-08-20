"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Alert {
  type: string
  time: string
  text: string
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/donki")
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.alerts || [])
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 120000) // Revalidate every 120s
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "Unknown time"

    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      // Try parsing ISO format with 'Z' suffix if missing
      const isoDate = new Date(timestamp.endsWith("Z") ? timestamp : timestamp + "Z")
      if (isNaN(isoDate.getTime())) {
        return "Invalid date"
      }
      return isoDate.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent bulletins found.</p>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 8).map((alert, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{alert.type}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(alert.time)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
