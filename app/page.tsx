import { Suspense } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
