--- a/lib/swpc.ts
+++ b/lib/swpc.ts
@@
 export async function fetchKpData() {
   try {
     const response = await fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json", {
       cache: "no-store",
       headers: {
         "User-Agent": "Invisible-Space-Atlanta/1.0",
       },
     })
@@
-    return {
-      kp: kpValue,
-      time: lastRow.time_tag, // UTC timestamp from NOAA
-    }
+    // Normalize NOAA UTC like "2025-08-21 00:45:00" -> "2025-08-21T00:45:00Z"
+    const raw = String(lastRow.time_tag)
+    const isoUtc = /Z$/i.test(raw) ? raw : raw.replace(" ", "T") + "Z"
+    return { kp: kpValue, time: isoUtc }
   } catch (error) {
     console.error("[v0] SWPC fetch error:", error)
     // Return fallback data when API fails
-    return {
-      kp: 2.1,
-      time: new Date().toISOString().replace("T", " ").substring(0, 19),
-      isDemo: true,
-    }
+    return { kp: 2.1, time: new Date().toISOString(), isDemo: true }
   }
 }
