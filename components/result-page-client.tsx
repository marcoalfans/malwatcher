//component/result-page-client.tsx
"use client"


import { motion, useScroll, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { ResultNavigation } from "@/components/result-navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResultCard} from "@/components/result-card"
import { useInView } from "react-intersection-observer"

interface LogEntry {
  filename: string
  data: any
}

type Props = {
  results: {
    filename: string
    data: any
  }[]
}


export function ResultPageClient({ results }: Props) {

const [selectedResult, setSelectedResult] = useState<number | null>(null)

const handleResultCardClick = (index: number) => {
  setSelectedResult(prev => (prev === index ? null : index))
}

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-bold mb-6">🦠 Scan Result Viewer</h1>
      </motion.div>
      
      <ResultNavigation logs={results.map(r => ({ filename: r.filename }))} />
      <div className="relative border-l-2 border-muted pl-8 ml-4">
      {results.map((r, index) => {
        const sha256 = r.data?.meta?.file_info?.sha256
        const scanDate = new Date(r.data?.data?.[0]?.attributes?.date * 1000).toLocaleString()

        return (
          <div key={r.filename} className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer w-full"
              onClick={() => handleResultCardClick(index)}
            >
              <ResultCard filename={r.filename} data={r.data}>
              <AnimatePresence>
                {selectedResult === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-muted-foreground">
                      🔗 View Full Report:&nbsp;
                      <a
                        href={`https://www.virustotal.com/gui/file/${sha256}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {r.filename}
                      </a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ResultCard>

            </motion.div>
            
          </div>
        )
      })}
      </div>
    </div>
  )
}
