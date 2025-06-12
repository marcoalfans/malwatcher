"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, File, Gauge, ShieldAlert, ShieldQuestion, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { motion, MotionProps, number } from "framer-motion";

interface VTAnalBehavData {
  filename: string
  timestamp: string
  fileExtension: string
  detailsFile: {
    data?: {
      attributes?: {
        reputation?: number
        type_extension?: string
        type_tags?: string[]
        md5?: string
        sha1?: string
        sha256?: string
        popular_threat_classification:{
          suggested_threat_label: string
        }
        crowdsourced_yara_results?:{
          ruleset_name?: string
          rule_name?: string
          description?: string          
        }[]
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

// Buat komponen MotionCard yang membungkus Card dari Shadcn UI
const MotionCard = motion(Card);
export function ResultCard({ filename, data, children, className, onClick, // Destructure semua props, termasuk yang dari MotionProps
  ...motionAndOtherProps}: ResultCardProps) {

  const formattedTimestamp = data.timestamp
    ? format(new Date(data.timestamp), 'dd MMMM yyyy HH:mm', { locale: enUS }) // Contoh format dengan lokal Indonesia
    : "unknown";
  const md5 = data.detailsFile.data?.attributes?.md5 || "-"
  const sha1 = data.detailsFile.data?.attributes?.sha1 || "-"
  const sha256 = data.detailsFile.data?.attributes?.sha256 || "-"

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
    const severity = technique.severity ?? "UNKNOWN"
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

  // --- Variabel untuk YARA Rules ---
const yaraResults = data?.detailsFile.data?.attributes?.crowdsourced_yara_results ?? [];

// Objek untuk menyimpan YARA rules yang dikelompokkan
const groupedYara: Record<string, { rule_name?: string; description?: string }[]> = yaraResults.reduce((acc, rule) => {
const rulesetName = rule.ruleset_name?.trim() || "unknown_ruleset";

  // Pastikan `acc[rulesetName]` adalah sebuah array sebelum mendorong elemen
  if (!acc[rulesetName]) {
    acc[rulesetName] = [];
  }
  // Tambahkan rule ke array rulesetName tersebut
  // Hanya ambil properti rule_name dan description yang relevan untuk tooltip
  if (rule.rule_name && !acc[rulesetName].some(r => r.rule_name === rule.rule_name)) {
    acc[rulesetName].push({
      rule_name: rule.rule_name,
      description: rule.description,
    });
  }
  return acc;
}, {} as Record<string, { rule_name?: string; description?: string }[]>); // <-- Penting: berikan tipe eksplisit pada initialValue

// Array untuk menjaga urutan ruleset (opsional, jika Anda ingin urutan spesifik)
const yaraRulesetOrder = Object.keys(groupedYara).sort(); // Mengurutkan secara alfabetis sebagai contoh

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
                      <ShieldAlert className="w-4 h-4" />
                      <span>Threat Label: {data.detailsFile.data?.attributes?.popular_threat_classification?.suggested_threat_label}</span>
                    </div>
                    <div className="flex items-center gap-1 mx-1">
                      <Gauge className="w-4 h-4" />
                      <span>Score: {data.detailsFile.data?.attributes?.reputation}</span>
                    </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 mx-1">
                      <File className="w-4 h-4" />
                      <span>.{data.detailsFile.data?.attributes?.type_extension}</span>
                    </div>
                    {/* Memastikan type_tags ada sebelum memprosesnya */}
                    {data.detailsFile.data?.attributes?.type_tags && (
                      <div className="flex items-center gap-1 mx-1">
                        {/* Melakukan map (iterasi) pada array type_tags */}
                        {data.detailsFile.data.attributes.type_tags.map((tag, index) => (
                          <Badge key={index} className="text-xs mx-0 cursor-pointer" style={{ backgroundColor: 'rgba(0, 123, 255, 0.5)'}}>
                            {tag}
                          </Badge>
                        ))}
                    </div>
            )}
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
        {/* YARA */}
        <div className="">
          <span className="font-semibold">YARA Rules:</span>
          {yaraRulesetOrder
            .filter(rulesetName => groupedYara[rulesetName] && groupedYara[rulesetName].length > 0)
            .map((rulesetName) => (
              <TooltipProvider key={rulesetName}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="text-xs mx-1 cursor-pointer bg-red-500 text-white bg-opacity-50" >
                      {rulesetName}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <ul className="text-xs">
                      {groupedYara[rulesetName].map((yaraRule, idx) => (
                        <li key={idx} className="mb-1 last:mb-0">
                          <strong>Rule:</strong> {yaraRule.rule_name || 'N/A'}
                          {yaraRule.description && (
                            <>
                              <br />
                              <strong>Desc:</strong> {yaraRule.description}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          {yaraRulesetOrder.length === 0 && (
            <span className="text-sm text-muted-foreground ml-2">No YARA rules detected.</span>
          )}
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

