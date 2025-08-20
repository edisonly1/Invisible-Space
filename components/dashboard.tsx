import { KpTile } from "./kp-tile"
import { UptimeTile } from "./uptime-tile"
import { AtlantaTonightTile } from "./atlanta-tonight-tile"
import { AlertsPanel } from "./alerts-panel"
import { ExplainerPanel } from "./explainer-panel"

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpTile />
        <UptimeTile />
        <AtlantaTonightTile />
      </div>

      {/* Detail Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsPanel />
        <ExplainerPanel />
      </div>
    </div>
  )
}
