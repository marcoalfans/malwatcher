//component/result-page-client.tsx
"use client"

import fs from "fs"
import path from "path"
import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResultNavigation } from "@/components/result-navigation"
import { ResultCard } from "@/components/result-card"
import { useInView } from "react-intersection-observer"
import confetti from "canvas-confetti"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

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
      {results.map((r, index) => (
        <div key={r.filename} className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer w-full"
          >
            <ResultCard filename={r.filename} data={r.data} />
          </motion.div>
        </div>
      ))}
    </div>
  )
}
