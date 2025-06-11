// app/scan-result/page.ts

import fs from 'fs'
import path from 'path'
import { ResultPageClient } from '@/components/result-page-client'

export default function ScanResultPage() {
  const logDir = path.join(process.cwd(), 'logs')
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.json'))

  const results = files.map((filename) => {
    const filePath = path.join(logDir, filename)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return { filename, data }
  })

  return (
    <ResultPageClient results={results}/>
  )
}
