"use client"

import fs from "fs"
import path from "path"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResultNavigation } from "@/components/result-navigation"
import { ResultCard } from "@/components/result-card"

interface LogEntry {
  filename: string
  data: any
}

export default function ResultPageClient() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/logs")
        const data = await response.json()
        setLogs(data.logs)
      } catch (error) {
        console.error("Failed to fetch logs", error)
      }
    }

    fetchLogs()
  }, [])

  return (
    <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Scan Results</h1>
      <ResultNavigation logs={logs} />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-6">
          {logs.map((entry) => (
            <ResultCard key={entry.filename} data={entry.data} filename={entry.filename} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
