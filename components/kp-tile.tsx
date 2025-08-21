import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchKpData } from "@/lib/swpc"

export const revalidate = 60

export async function KpTile() {
  let kp: number | null = null
  let time: string | null = null

  try {
    const data = await fetchKpData()
    kp = data.kp
    time = data.time
  } catch (error) {
    console.error("Failed to fetch Kp data:", error)
  }

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
        <CardTitle className="text-lg">Kp Index</CardTitle>
        <p className="text-xs text-muted-foreground">Updated {formatTime(time)}</p>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2">{kp !== null ? kp.toFixed(2) : "—"}</div>
        <p className="text-sm text-muted-foreground">Kp≥5 implies possible aurora visibility at mid-latitudes.</p>
      </CardContent>
    </Card>
  )
}
