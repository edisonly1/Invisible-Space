export async function fetchKpData() {
  try {
    const response = await fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json", {
      cache: "no-store",
      headers: {
        "User-Agent": "Invisible-Space-Atlanta/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`SWPC API error: ${response.status}`)
    }

    const data = await response.json()

    // Validate that data is an array
    if (!Array.isArray(data)) {
      console.error("[v0] SWPC API returned non-array data:", typeof data, data)
      throw new Error("Invalid data format from SWPC API")
    }

    if (data.length === 0) {
      throw new Error("No Kp data available")
    }

    const lastRow = data[data.length - 1]

    // Validate that lastRow is an object with required properties
    if (!lastRow || typeof lastRow !== "object" || !lastRow.time_tag || lastRow.estimated_kp === undefined) {
      console.error("[v0] Invalid lastRow format:", lastRow)
      throw new Error("Invalid row format from SWPC API")
    }

    const kpValue = Number.parseFloat(lastRow.estimated_kp)

    // Validate parsed values
    if (isNaN(kpValue)) {
      console.error("[v0] Invalid Kp value:", lastRow.estimated_kp)
      throw new Error("Invalid Kp value from SWPC API")
    }

    return {
      kp: kpValue,
      time: lastRow.time_tag, // UTC timestamp from NOAA
    }
  } catch (error) {
    console.error("[v0] SWPC fetch error:", error)
    // Return fallback data when API fails
    return {
      kp: 2.1,
      time: new Date().toISOString().replace("T", " ").substring(0, 19),
      isDemo: true,
    }
  }
}
