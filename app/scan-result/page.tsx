// app/scan-result/page.ts

import fs from 'fs'
import path from 'path'
import { ResultCard } from '@/components/result-card'
import { ResultNavigation } from '@/components/result-navigation'
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
    // <div className="container py-10">
    //   <h1 className="text-3xl font-bold mb-6">🦠 Scan Result Viewer</h1>
    //   <ResultNavigation logs={results.map(r => ({ filename: r.filename }))} />
    //   {results.map((r) => (
    //     <div key={r.filename} className="mb-10">
    //       <ResultCard filename={r.filename} data={r.data} />
    //     </div>
    //   ))}
    // </div>
  )
}
