// app/scan-result/page.ts
import fs from 'fs'
import path from 'path'
import { ResultPageClient } from '@/components/result-page-client'

export const dynamic = "force-dynamic"; // ⬅️ ini penting

export default function ScanResultPage() {
  const logDir = path.resolve('./logs');
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.json'));

  const results = files.map((filename) => {
    const filePath = path.join(logDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return { filename, data };
  });

  if (!results.length) {
    return <div className="p-10 text-center text-muted-foreground">⚠️ No logs found in /logs directory.</div>
  }

  return <ResultPageClient results={results} />;
}
