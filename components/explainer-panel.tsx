import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ExplainerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classroom Explainer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a one-page handout explaining today's space weather conditions. Perfect for teachers who want to
          screenshot or print without formatting issues.
        </p>
        <Link href="/explainer" target="_blank">
          <Button className="w-full">Open Explainer Page</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
