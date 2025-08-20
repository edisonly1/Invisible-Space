"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExplainerPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 print:py-4">
        <div className="print:hidden mb-6">
          <Button onClick={handlePrint} size="lg" className="mb-4">
            Print to PDF
          </Button>
        </div>

        <div className="space-y-6 print:space-y-4">
          <header className="text-center">
            <h1 className="text-3xl font-bold mb-2 print:text-2xl">Invisible Space — Today's Sky, Explained</h1>
            <p className="text-muted-foreground print:text-gray-600">
              Understanding space weather and its effects on Earth
            </p>
          </header>

          <Card className="print:shadow-none print:border-gray-300">
            <CardHeader>
              <CardTitle>What is the Kp Index?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                The Kp index is a 0–9 scale that measures how disturbed Earth's magnetic field is. Higher numbers mean
                stronger geomagnetic activity and a greater chance of seeing aurora.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Kp 0-2: Quiet conditions, no aurora visible</li>
                <li>Kp 3-4: Minor activity, aurora possible at high latitudes</li>
                <li>Kp 5-6: Moderate storm, aurora visible at mid-latitudes like Atlanta</li>
                <li>Kp 7-9: Strong to extreme storms, widespread aurora and potential disruptions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="print:shadow-none print:border-gray-300">
            <CardHeader>
              <CardTitle>How Space Weather Affects Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Space weather events like solar flares and coronal mass ejections (CMEs) can impact technology we rely
                on every day:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>GPS Navigation:</strong> Accuracy can decrease during geomagnetic storms
                </li>
                <li>
                  <strong>Radio Communications:</strong> HF radio signals may be disrupted or blocked
                </li>
                <li>
                  <strong>Power Grids:</strong> Extreme events can cause voltage fluctuations or outages
                </li>
                <li>
                  <strong>Satellites:</strong> Increased radiation can damage electronics or disrupt signals
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="print:shadow-none print:border-gray-300">
            <CardHeader>
              <CardTitle>What We Track</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Our data comes from official sources:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>NOAA SWPC Kp Index:</strong> Real-time geomagnetic activity measurements
                </li>
                <li>
                  <strong>NASA DONKI Bulletins:</strong> Solar flare and CME event notifications
                </li>
              </ul>
              <p className="text-sm text-muted-foreground print:text-gray-600 mt-4">
                💡 <strong>Tip:</strong> Use your browser's "Print" function or "Save as PDF" to create a clean handout
                for classroom use.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground print:text-gray-600">
          Data: NOAA SWPC & NASA DONKI
        </footer>
      </div>
    </div>
  )
}
