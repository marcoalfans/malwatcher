// app/api/save-log/route.ts
import { saveLogFile } from '@/lib/vt-save-log-file'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { data, filename } = await req.json()

  if (!data || !filename) {
    return NextResponse.json({ message: 'Missing data or filename' }, { status: 400 })
  }

  const result = await saveLogFile(data, filename)

  if (result.success) {
    return NextResponse.json({ message: 'Log saved', path: result.path }, { status: 200 })
  } else {
    return NextResponse.json({ message: 'Failed to save log', error: result.error }, { status: 500 })
  }
}
