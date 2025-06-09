"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ResultNavigationProps {
  logs: { filename: string }[]
}

export function ResultNavigation({ logs }: ResultNavigationProps) {
  const [active, setActive] = useState<string | null>(logs?.[0]?.filename ?? null)

  return (
    <div className="flex overflow-x-auto space-x-4 mb-6">
      {logs.map((log) => (
        <button
          key={log.filename}
          onClick={() => setActive(log.filename)}
          className={cn(
            "px-4 py-2 text-sm rounded-md border",
            active === log.filename
              ? "bg-primary text-white border-primary"
              : "bg-muted text-muted-foreground border-muted"
          )}
        >
          {log.filename}
        </button>
      ))}
    </div>
  )
}
