// /app/api/vt/get-analysis/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Needed to bypass static export restriction

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const vtRes = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
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