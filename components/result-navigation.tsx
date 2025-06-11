"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ResultNavigationProps {
  logs: { filename: string }[]
  onSelectFile: (filename: string) => void; // Tambahkan prop ini
  activeFilename: string | null; // Tambahkan prop ini untuk highlight
}

export function ResultNavigation({ logs, onSelectFile, activeFilename }: ResultNavigationProps) {
  // `active` state ini tidak lagi diperlukan di sini karena akan dikelola dari parent
  // const [active, setActive] = useState<string | null>(logs?.[0]?.filename ?? null)

  return (
    <div className="flex overflow-x-auto space-x-4 mb-6">
      {logs.map((log) => (
        <button
          key={log.filename}
          onClick={() => onSelectFile(log.filename)} // Panggil prop onSelectFile
          className={cn(
            "px-4 py-2 text-sm rounded-md border flex-shrink-0", // Tambahkan flex-shrink-0
            "max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis",
            activeFilename === log.filename // Gunakan activeFilename dari props
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
