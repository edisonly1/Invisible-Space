import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the base URL from the request
    const protocol = request.headers.get("x-forwarded-proto") || "https"
    const host = request.headers.get("host")
    const baseUrl = `${protocol}://${host}`

    // Call our ping endpoint
    const response = await fetch(`${baseUrl}/api/ping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    return Response.json({
      success: response.ok,
      timestamp: new Date().toISOString(),
      pingResult: result,
    })
  } catch (error) {
    console.error("Cron ping failed:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to ping system",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
