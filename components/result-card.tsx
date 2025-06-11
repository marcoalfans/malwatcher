"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, File, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { motion, MotionProps } from "framer-motion";

interface VTAnalBehavData {
  filename: string
  timestamp: string
  fileExtension: string
  analysis: {
    meta?: {
      file_info?: {
        md5?: string
        sha1?: string
        sha256?: string
      }
    }
    data?: {
      attributes?: {
        stats?: Record<string, number>
      }
    }
  }
  behaviours: {
    data: {
      attributes?: {
        verdicts?: string[]
        mitre_attack_techniques?: {
          id?: string[] | string
          severity?: string
          signature_description?: string
        }[]
        sigma_analysis_results?: {
          rule_level?: string
          rule_title?: string
        }[]
      }
    }[]
  }
}
interface ResultCardProps extends MotionProps{
  filename: string;
  data: VTAnalBehavData;
  children?: React.ReactNode;
  className?: string; // MotionProps sudah mencakup className
  onClick?: () => void; // MotionProps sudah mencakup onClick
}

// Kamus data untuk deskripsi ekstensi
const extensionDescriptions: Record<string, string> = {
  ".exe": "Executable",
  ".zip": "Compressed Archive",
  ".gz": "Gnu Zip Archive",
  ".pdf": "Portable Document Format",
  ".docx": "Microsoft Word Document",
  ".txt": "Plain Text File",
  ".png": "Portable Network Graphics",
  ".jpg": "JPEG Image",
  ".jpeg": "JPEG Image",
  ".gif": "Graphics Interchange Format",
  ".svg": "Scalable Vector Graphics",
  ".mp3": "MP3 Audio File",
  ".mp4": "MPEG-4 Video File",
  ".avi": "Audio Video Interleave",
  ".rar": "Roshal ARchive",
  ".7z": "7-Zip Archive",
  ".iso": "Disc Image",
  ".dmg": "Apple Disk Image",
  ".ppt": "Microsoft PowerPoint Presentation",
  ".pptx": "Microsoft PowerPoint Presentation",
  ".xls": "Microsoft Excel Spreadsheet",
  ".xlsx": "Microsoft Excel Spreadsheet",
  ".html": "Hypertext Markup Language",
  ".htm": "Hypertext Markup Language",
  ".css": "Cascading Style Sheet",
  ".js": "JavaScript File",
  ".json": "JavaScript Object Notation",
  ".xml": "Extensible Markup Language",
  ".dll": "Dynamic Link Library",
  ".sys": "System File",
  ".tmp": "Temporary File",
  ".bat": "Windows Batch File",
  ".ps1": "PowerShell Script",
  ".sh": "Shell Script",
  ".bak": "Backup File",
  ".reg": "Windows Registry File",
  // Tambahkan ekstensi lain sesuai kebutuhan Anda
};


// Buat komponen MotionCard yang membungkus Card dari Shadcn UI
const MotionCard = motion(Card);
export function ResultCard({ filename, data, children, className, onClick, // Destructure semua props, termasuk yang dari MotionProps
  ...motionAndOtherProps}: ResultCardProps) {

  const formattedTimestamp = data.timestamp
    ? format(new Date(data.timestamp), 'dd MMMM yyyy HH:mm', { locale: enUS }) // Contoh format dengan lokal Indonesia
    : "unknown";
  const fileExtension = data.fileExtension || '';
  const cleanedExtension = fileExtension.toLowerCase(); // Konversi ke lowercase untuk pencarian yang konsisten
  const description = extensionDescriptions[cleanedExtension] || ""; // Dapatkan deskripsi, default ''
  const md5 = data.analysis.meta?.file_info?.md5 || "-"
  const sha1 = data.analysis.meta?.file_info?.sha1 || "-"
  const sha256 = data.analysis.meta?.file_info?.sha256 || "-"

  // Ambil dan gabungkan semua verdict unik
  const allVerdicts: string[] =
    data?.behaviours?.data
      ?.flatMap(item => item.attributes?.verdicts?? [])
      ?.filter((v, i, arr) => arr.indexOf(v) === i) ?? []
  const verdictText = allVerdicts.length > 0 ? allVerdicts.join(", ") : "NOT FOUND 🔎"

  const severityOrder = ["IMPACT_SEVERITY_CRITICAL", "IMPACT_SEVERITY_HIGH", "IMPACT_SEVERITY_MEDIUM", "IMPACT_SEVERITY_LOW", "IMPACT_SEVERITY_INFO","UNKNOWN"]
  const sigmaOrder = ["critical", "high", "medium", "low", "info","unknown"]

  const severityColorMap: Record<string, string> = {
    IMPACT_SEVERITY_CRITICAL: "bg-red-600/40 text-white hover:bg-red-700/90",
    IMPACT_SEVERITY_HIGH: "bg-orange-500/40 text-white hover:bg-orange-600/90",
    IMPACT_SEVERITY_MEDIUM: "bg-yellow-400/40 text-white hover:bg-yellow-500/90",
    IMPACT_SEVERITY_LOW: "bg-blue-500/40 text-white hover:bg-blue-600/90",
    IMPACT_SEVERITY_INFO: "bg-gray-500/40 text-white hover:bg-gray-600/90",
    UNKNOWN: "bg-muted"
  }

  const sigmaLevelColorMap: Record<string, string> = {
    critical: severityColorMap["IMPACT_SEVERITY_CRITICAL"],
    high: severityColorMap["IMPACT_SEVERITY_HIGH"],
    medium: severityColorMap["IMPACT_SEVERITY_MEDIUM"],
    low: severityColorMap["IMPACT_SEVERITY_LOW"],
    info: severityColorMap["IMPACT_SEVERITY_INFO"],
    unknown: "bg-muted"
  }
  // Kelompokkan MITRE berdasarkan severity
  const mitres = data?.behaviours?.data?.flatMap(item => item.attributes?.mitre_attack_techniques ?? []) ?? []
  const groupedMitre = mitres.reduce((acc, technique) => {
    const severity = technique.severity ?? "IMPACT_SEVERITY_"
    const ids = Array.isArray(technique.id) ? technique.id : technique.id ? [technique.id] : []

    if (!acc[severity]) acc[severity] = []
    ids.forEach((id: string) => {
      acc[severity].push({
        id,
        description: technique.signature_description ?? "No description"
      })
    })
    return acc
  }, {} as Record<string, { id: string; description: string }[]>)

  // Kelompokkan Sigma berdasarkan rule_level
  const sigmas = data?.behaviours?.data?.flatMap(item => item.attributes?.sigma_analysis_results ?? []) ?? []
  const groupedSigma = sigmas.reduce((acc, rule) => {
    const level = rule.rule_level?.toLowerCase() ?? "unknown"
    const title = rule.rule_title?.trim()
    if (!title) return acc
    acc[level] ??= []
    if (!acc[level].some(t => t.title.toLowerCase() === title.toLowerCase()))
      acc[level].push({ title })
    return acc
  }, {} as Record<string, { title: string }[]>)

  return (
    <MotionCard
      className={className} 
      onClick={onClick}    
      {...motionAndOtherProps}
    >
      <CardHeader className=" p-3 sm:p-3">
        <CardTitle className="text-base !text-base">📃{filename}</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 mx-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedTimestamp}</span>
                    </div>
                    <div className="flex items-center gap-1 mx-1">
                      <File className="w-4 h-4" />
                      <span>{data.filename} ({description})</span>
                    </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">MD5: <span className="mx-1 text-muted-foreground">{md5 || "-"}</span></Badge>
          <Badge variant="outline">SHA1: <span className="mx-1 text-muted-foreground">{sha1 || "-"}</span></Badge>
          <Badge variant="outline">SHA256: <span className="mx-1 text-muted-foreground">{sha256 || "-"}</span></Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-2 mx-3 text-sm text-muted-foreground space-y-2">
        <div><strong>Detections:</strong> {verdictText}</div>
        {/* MITRE Techniques */}
        <div>
          <strong>MITRE Signatures:</strong>
          <TooltipProvider>
            {severityOrder.filter(s => groupedMitre[s]?.length).map(sev => (
              <Tooltip key={sev}>
                <TooltipTrigger asChild>
                  <Badge className={`${severityColorMap[sev]} text-xs mx-1 cursor-pointer`}>
                    {sev.replace("IMPACT_SEVERITY_", "")}: {groupedMitre[sev].length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <ul className="text-xs space-y-1">
                    {groupedMitre[sev].map((m, i) => (
                      <li key={i}><strong>{m.id}</strong>: {m.description}</li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Sigma */}
        <div className="">
          <span className="font-semibold">Sigma Rules:</span>
          {sigmaOrder
            .filter(level => groupedSigma[level])
            .map((level) => (
              <TooltipProvider key={level}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={`${sigmaLevelColorMap[level]} text-xs mx-1 cursor-pointer`}>
                      {level.toUpperCase()}: {groupedSigma[level].length}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <ul className="text-xs">
                      {groupedSigma[level].map((s, idx) => (
                        <li key={idx}>{s.title}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </div>

        {/* Children (e.g. expandable VT link) */}
        {children && (
          <div className="pt-2 border-t border-muted text-xs">
            {children}
          </div>
        )}
      </CardContent>
    </MotionCard>
  );
}

