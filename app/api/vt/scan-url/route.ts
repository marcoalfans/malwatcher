// /app/api/vt/scan-url/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
  }

  const form = new URLSearchParams()
  form.append('url', url)

  const vtRes = await fetch('https://www.virustotal.com/api/v3/urls', {
    method: 'POST',
    headers: {
      'x-apikey': process.env.NEXT_PUBLIC_VT_APIKEY!,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
    cache: 'no-store'
  })

  const data = await vtRes.json()

  if (!vtRes.ok) {
    return NextResponse.json({ error: 'Failed', detail: data }, { status: vtRes.status })
  }

  return NextResponse.json(data)
}