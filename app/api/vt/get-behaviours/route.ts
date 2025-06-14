// /app/api/vt/get-behaviours/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const sha256 = req.nextUrl.searchParams.get('sha256')
  if (!sha256) {
    return NextResponse.json({ error: 'Missing sha256' }, { status: 400 })
  }

  const vtRes = await fetch(`https://www.virustotal.com/api/v3/files/${sha256}/behaviours`, {
    headers: {
      'x-apikey': process.env.NEXT_PUBLIC_VT_APIKEY!,
    },
    cache: 'no-store'
  })

  const data = await vtRes.json()

  if (!vtRes.ok) {
    return NextResponse.json({ error: 'Failed', detail: data }, { status: vtRes.status })
  }

  return NextResponse.json(data)
}
