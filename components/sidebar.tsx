"use client"

import { useEffect, useState } from "react"

export function Sidebar() {
  const [healthStatus, setHealthStatus] = useState<"ok" | "error" | "loading">("loading")

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health")
        if (response.ok) {
          setHealthStatus("ok")
        } else {
          setHealthStatus("error")
        }
      } catch {
        setHealthStatus("error")
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-48 border-r bg-sidebar p-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-sidebar-foreground">City: Atlanta</p>
          <select disabled className="mt-1 text-xs text-muted-foreground bg-transparent border-none">
            <option>Atlanta (coming soon)</option>
          </select>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Kp≥5 storm watch</p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              healthStatus === "ok" ? "bg-green-500" : healthStatus === "error" ? "bg-red-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">API Status</span>
        </div>
      </aside>

      {/* Mobile Status Strip */}
      <div className="md:hidden border-b bg-sidebar px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>City: Atlanta</span>
        <span>Kp≥5 storm watch</span>
        <div className="flex items-center space-x-1">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              healthStatus === "ok" ? "bg-green-500" : healthStatus === "error" ? "bg-red-500" : "bg-yellow-500"
            }`}
          />
          <span>API</span>
        </div>
      </div>
    </>
  )
}
