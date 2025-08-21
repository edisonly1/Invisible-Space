// lib/swpc.ts
// Returns the most recent 3-hour station K value for Fredericksburg (FRD),
// a good regional proxy for Atlanta (mid-lat US East).
// Falls back to planetary 1-minute Kp if needed.

type KResult = { kp: number; time: string; station?: string; source?: string };

export async function fetchKpData(): Promise<KResult> {
  // --- Try FRD station K via SWPC daily text (last 30 days) ---
  try {
    const url = "https://services.swpc.noaa.gov/text/daily-geomagnetic-indices.txt";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`FRD daily text fetch failed: ${res.status}`);
    const txt = await res.text();

    // Keep only data lines starting with "YYYY MM DD"
    const lines = txt
      .split(/\r?\n/)
      .filter((l) => /^\s*\d{4}\s+\d{2}\s+\d{2}\s+/.test(l.trim()));
    if (!lines.length) throw new Error("No data lines found in DGD");

    const last = lines[lines.length - 1].trim();
    const parts = last.split(/\s+/); // tokens are numeric strings

    // Row layout (per SWPC DGD): YYYY MM DD | A_mid | K_mid x8 | A_high | K_high x8 | A_planet | K_planet x8
    const Y = Number(parts[0]);
    const M = Number(parts[1]);
    const D = Number(parts[2]);

    // Middle-latitude (FRD) station K values are the next 8 tokens after A_mid (parts[3])
    const K_mid = parts.slice(4, 12).map((s) => Number(s)); // 8 values, may include -1 for missing

    // Pick the latest completed 3-hour bin (scan from the end for a valid >=0 value)
    let idx = K_mid.length - 1;
    while (idx >= 0 && (!Number.isFinite(K_mid[idx]) || K_mid[idx] < 0)) idx--;
    if (idx < 0) throw new Error("No valid FRD K found for the latest day");

    const k = K_mid[idx];

    // Each K is a 3-hour bin in UTC: [00-03), [03-06), ... [21-24).
    const endHourUTC = (idx + 1) * 3; // bin end
    const endUTC = new Date(Date.UTC(Y, M - 1, D, endHourUTC, 0, 0));
    const timeISO = endUTC.toISOString();

    return {
      kp: k,                    // Note: this is station K (0–9), used as ATL proxy
      time: timeISO,            // ISO UTC; format to EDT/EST in the component
      station: "FRD",
      source: "SWPC daily-geomagnetic-indices.txt",
    };
  } catch (e) {
    console.error("[swpc] FRD parse failed, falling back to planetary 1-minute Kp:", e);
  }

  // --- Fallback: NOAA planetary 1-minute Kp nowcast (near real-time) ---
  try {
    const url = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Planetary 1m fetch failed: ${res.status}`);
    const data: Array<{ time_tag: string; estimated_kp: string }> = await res.json();
    const last = data[data.length - 1];
    const isoUtc = /Z$/i.test(last.time_tag)
      ? last.time_tag
      : last.time_tag.replace(" ", "T") + "Z";
    return {
      kp: Number.parseFloat(last.estimated_kp),
      time: isoUtc,
      source: "SWPC planetary_k_index_1m.json",
    };
  } catch (e2) {
    console.error("[swpc] Planetary fallback failed:", e2);
    // Final safe fallback
    return { kp: 2, time: new Date().toISOString(), source: "fallback" };
  }
}
