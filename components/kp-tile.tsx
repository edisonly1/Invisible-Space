import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchKpData } from "@/lib/swpc"

export const revalidate = 60

export async function KpTile() {
  let kp: number | null = null
  let time: string | null = null
  let station: string | undefined

  try {
    const data = await fetchKpData()
    kp = data.kp
    time = data.time
    station = (data as any).station // "FRD" when using Atlanta proxy
  } catch (error) {
    console.error("Failed to fetch K data:", error)
  }

  const formatTimeEDT = (timestamp: string | null) => {
    if (!timestamp) return "—"
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short", // shows EDT/EST
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {station ? "K Index — Atlanta (FRD)" : "Kp Index"}
        </CardTitle>
        <p className="text-xs text-muted-foreground">Updated {formatTimeEDT(time)}</p>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2">
          {kp !== null ? (station ? kp.toFixed(0) : kp.toFixed(2)) : "—"}
        </div>
        <p className="text-sm text-muted-foreground">
          {station
            ? "Local proxy from Fredericksburg station (3-hour K)."
            : "Kp≥5 implies possible aurora visibility at mid-latitudes."}
        </p>
      </CardContent>
    </Card>
  )
}
