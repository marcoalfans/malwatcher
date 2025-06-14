// /app/api/vt/scan-file/route.ts
import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import { request } from 'undici'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const form = new FormData()
  form.append('file', buffer, file.name)

  try {
    const { body, statusCode } = await request('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': process.env.NEXT_PUBLIC_VT_APIKEY!,
        ...form.getHeaders(),
      },
      body: form,
    })

    const chunks: Buffer[] = []
    for await (const chunk of body) {
      chunks.push(chunk as Buffer)
    }
    const responseText = Buffer.concat(chunks).toString('utf-8')
    const json = JSON.parse(responseText)

    if (statusCode >= 400) {
      return NextResponse.json({ error: 'Failed', detail: json }, { status: statusCode })
    }

    return NextResponse.json(json)
  } catch (err: any) {
    console.error('VT Upload Error:', err)
    return NextResponse.json({ error: 'Unexpected Error', detail: err.message }, { status: 500 })
  }
}
