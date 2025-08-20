import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return success but don't actually log - uptime will show N/A
      return NextResponse.json({ ok: true })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert heartbeat ping
    const { error } = await supabase.from("pings").insert([
      {
        timestamp: new Date().toISOString(),
        status: "ok",
      },
    ])

    if (error) {
      console.error("Ping insert error:", error)
      return NextResponse.json({ ok: false }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Ping API error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
