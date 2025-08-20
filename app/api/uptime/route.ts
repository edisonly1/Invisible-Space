import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return null percentage when Supabase is not configured
      return NextResponse.json({ percentage: null })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // First check if the pings table exists by attempting a simple query
    const { data, error } = await supabase
      .from("pings")
      .select("*", { count: "exact" })
      .gte("timestamp", oneDayAgo)
      .eq("status", "ok")
      .limit(1)

    if (error) {
      // If table doesn't exist or any other error, return null
      console.log("Uptime query info: pings table not available or error occurred")
      return NextResponse.json({ percentage: null })
    }

    // Get the full count for calculation
    const { count, error: countError } = await supabase
      .from("pings")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", oneDayAgo)
      .eq("status", "ok")

    if (countError) {
      console.log("Uptime count error:", countError)
      return NextResponse.json({ percentage: null })
    }

    // Calculate uptime percentage (assuming 1 ping per minute = 1440 pings per day)
    const expectedPings = 24 * 60 // 1440 pings per day
    const actualPings = count || 0
    const percentage = Math.min(100, Math.round((actualPings / expectedPings) * 100))

    return NextResponse.json({ percentage })
  } catch (error) {
    console.log("Uptime API error:", error)
    return NextResponse.json({ percentage: null })
  }
}
