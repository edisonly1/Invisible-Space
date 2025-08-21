export const runtime = "nodejs"
export const revalidate = 0
export const dynamic = "force-dynamic"

const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Content-Type": "text/plain; charset=utf-8",
}

export async function GET() {
  return new Response("OK", {
    status: 200,
    headers,
  })
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers,
  })
}
