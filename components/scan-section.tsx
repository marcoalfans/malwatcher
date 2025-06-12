"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import vtScan from "@/lib/vt-scan"
import { useRouter } from 'next/navigation';

// Interface untuk item individu di dalam behaviours.data
interface BehaviourDataItem {
  attributes?: {
    verdicts?: string[];
    mitre_attack_techniques?: {
      id?: string[] | string;
      severity?: string;
      signature_description?: string;
    }[];
    sigma_analysis_results?: {
      rule_level?: string;
      rule_title?: string;
    }[];
  };
}

// Interface untuk atribut detailsFile dari VirusTotal
interface DetailsFileAttributes {
  reputation?: number;
  type_extension?: string;
  type_tags?: string[];
  md5?: string;
  sha1?: string;
  sha256?: string;
  popular_threat_classification?: { 
    suggested_threat_label?: string; 
  };
  crowdsourced_yara_results?: {
    ruleset_id?: string;
    ruleset_version?: string;
    ruleset_name?: string;
    rule_name?: string;
    match_date?: number;
    description?: string;
    author?: string;
    source?: string;
  }[];
  stats?: Record<string, number>;
}
interface DetailsFileResponse {
  data?: {
    attributes?: DetailsFileAttributes;
  };
}

// Interface untuk hasil scan gabungan yang dibuat di handleFileUpload
interface CombinedScanResult {
  type: 'file-scan' | 'url-scan';
  filename: string;
  timestamp: string;
  fileExtension?: string;
  detailsFile: DetailsFileResponse; 
  behaviours: {
    data: BehaviourDataItem[]; 
  };
}

// Interface untuk data laporan yang akan dikirimkan ke Telegram
interface TelegramMessageData {
  fileName: string;
  timestamp?: string;      
  fileExtension?: string;  // Pastikan ini ada
  type_tags?: string[];  
  md5: string;
  sha1: string;
  sha256: string;
  score?: number;       
  threatLabel?: string;  
  viewReportUrl?: string;
  groupedMitre?: Record<string, { id: string; description: string }[]>;
  groupedSigma?: Record<string, { title: string }[]>; // Menambahkan ini
  yaraRulesetNames?: string[];  
}

interface MitreTechnique {
  id?: string[] | string;
  severity?: string;
  signature_description?: string;
}
interface SigmaAnalysisResult {
  rule_level?: string;
  rule_title?: string;
}

export function ScanSection() {
  const router = useRouter(); // Inisialisasi router
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const MAX_FILE_SIZE_MB = 32
  const isFileTooLarge = file ? file.size / (1024 * 1024) > MAX_FILE_SIZE_MB : false

  const pad = (n: number) => n.toString().padStart(2, '0')

  const saveJsonFile = (data: any, fileName: string) => {
    const date = new Date()
    const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}`

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const downloadUrl = URL.createObjectURL(jsonBlob)

    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `${formattedDate}_file_${fileName}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }

  const saveLogToServer = async (data: any, fileName: string) => {
    const date = new Date()
    const timestamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}`
    const fullFileName = `${timestamp}_file_${fileName}.json`
    const urlsave = '/api/save-log'.replace(/\/+$/, '') // safe URL tanpa trailing slash

    await fetch(urlsave, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, filename: fullFileName })
    })
  };

  const sendReportToTelegramAPI = async (reportData: TelegramMessageData) => {
    try {
      const response = await fetch('/api/send-report', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Laporan Telegram berhasil dikirim:", data.message);
      } else {
        console.error("Gagal mengirim laporan Telegram:", data.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat memanggil API Telegram:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file || isFileTooLarge) return
    try {
      setLoading(true)
      // Step 1: Upload file
      const res = await vtScan.postFiles({ file })
      const analysisId = res?.data?.id
      // Step 2: Poll analysis
      if (analysisId) {
        const analysis = await vtScan.pollAnalysis(analysisId)
        // Step 3: Extract hashes from metadata
        const meta = analysis?.meta?.file_info
        if (meta) {
          // Step 4: Get behaviours using available hash
          const detailsFile = await vtScan.getDetails(meta)
          const behaviours = await vtScan.getBehaviours(meta)

          const combinedResult: CombinedScanResult = {
            type: 'file-scan',
            filename: file.name,
            timestamp: new Date().toISOString(),
            detailsFile,
            behaviours,
          };
          // --- LOGIKA PEMROSESAN MITRE ---
          const mitres = combinedResult.behaviours?.data?.flatMap((item: BehaviourDataItem) => item.attributes?.mitre_attack_techniques ?? []) ?? [];
          const groupedMitre = mitres.reduce((acc: Record<string, { id: string; description: string }[]>, technique: MitreTechnique) => {
          const severity = technique.severity ?? "UNKNOWN";
          const ids = Array.isArray(technique.id) ? technique.id : (technique.id ? [technique.id] : []);
            if (!acc[severity]) acc[severity] = [];
            ids.forEach((id: string) => {
              acc[severity].push({
                  id,
                  description: technique.signature_description ?? "No description"
              });
            });
            return acc;
          }, {} as Record<string, { id: string; description: string }[]>);

          const sigmas = combinedResult.behaviours?.data?.flatMap((item: BehaviourDataItem) => item.attributes?.sigma_analysis_results ?? []) ?? [];
          const groupedSigma = sigmas.reduce((acc: Record<string, { title: string }[]>, rule: SigmaAnalysisResult) => {
            const level = rule.rule_level?.toLowerCase() ?? "unknown";
            const title = rule.rule_title?.trim();
            if (!title) return acc;
            if (!acc[level]) acc[level] = [];
            if (!acc[level].some(t => t.title.toLowerCase() === title.toLowerCase()))
              acc[level].push({ title });
            return acc;
          }, {} as Record<string, { title: string }[]>);

          const yaraResults = combinedResult.detailsFile.data?.attributes?.crowdsourced_yara_results ?? [];
          const yaraRulesetNames = Array.from(new Set(
            yaraResults
              .map(rule => rule.ruleset_name?.trim())
              .filter((name): name is string => typeof name === 'string' && name.length > 0)
          ));

          const telegramData: TelegramMessageData = {
              fileName: combinedResult.filename,
              md5: combinedResult.detailsFile?.data?.attributes?.md5 || 'N/A',
              sha1: combinedResult.detailsFile?.data?.attributes?.sha1 || 'N/A',
              sha256: combinedResult.detailsFile?.data?.attributes?.sha256 || 'N/A',
              threatLabel: combinedResult.detailsFile?.data?.attributes?.popular_threat_classification?.suggested_threat_label,
              score: combinedResult.detailsFile?.data?.attributes?.reputation,
              viewReportUrl: `https://www.virustotal.com/gui/file/${combinedResult.detailsFile?.data?.attributes?.md5}`, // Contoh URL ke halaman detail laporan Anda
              timestamp: combinedResult.timestamp,
              fileExtension: combinedResult.fileExtension, 
              type_tags: combinedResult.detailsFile?.data?.attributes?.type_tags,
              groupedMitre: groupedMitre,
              groupedSigma: groupedSigma, 
              yaraRulesetNames: yaraRulesetNames, 
          };
          // Step 6: Save to local download and to /logs folder via API
          console.log("[Malwatcher][Analysis + Behav]", combinedResult)
          // saveJsonFile(combinedResult, file.name) //download file hasil scan
          await saveLogToServer(combinedResult, file.name)
          await sendReportToTelegramAPI(telegramData);
          router.push('/scan-result');
        }  
      }
    } catch (error) {
      console.error("[Malwatcher][File Error]", error)
    } finally {
      setLoading(false)
    }
  }
  const handleUrlScan = async () => {
    if (!url) return
    try {
      setLoading(true)
      // Step 1: Submit URL ke VirusTotal
      const res = await vtScan.scanUrl({ url })
      const analysisId = res?.data?.id
      // Step 2: Jika ada ID, ambil hasil analisisnya
      if (analysisId) {
        const analysis = await vtScan.pollAnalysis(analysisId)
      }
    } catch (error) {
      console.error("[Malwatcher]", error); 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-16 mb-20 mx-auto max-w-7xl" id="scan">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="mb-12 text-center"
      >
        <h2 className="text-5xl font-bold tracking-tight neon-text-green">Curious About That File or Link?</h2>
        <p className="mt-4 text-xl text-muted-foreground">Before you open it or run it, let Malwatcher scan for hidden malware, threats, or shady behaviors — because it's better safe than sorry.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
      <Tabs defaultValue="file" className="w-full max-w-xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">File</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        <TabsContent value="file" className="mt-6 space-y-4 text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="80" viewBox="0 0 256 170" className="text-primary mb-2">
              <g>
                <path style={{ fill: "var(--bs-body-color)" }} d="M71 8h80.9v29.1c0 2.2 1.8 4 4 4h30V47h8v-9.1c0-1.6-.6-3.1-1.7-4.2L161.1 1.8C160 .6 158.4 0 156.8 0H68c-2.8 0-5 2.2-5 5v42h8V8Zm88.9 4 20.5 21h-20.5V12Z" />
                <path style={{ fill: "var(--bs-tertiary-color)" }} fillRule="evenodd" d="M185.9 161.9H71V59h-8v105.9c0 2.8 2.2 5 5 5h120.9c2.8 0 5-2.2 5-5V59h-8v102.9ZM103 63.3c.7.8 2 .9 2.8.2 1.8-1.6 4.6-3.2 8-4.5h-8.7c-.7.5-1.3 1-1.9 1.5-.9.7-.9 2-.2 2.8Zm49.5.1c.8-.8.7-2.1-.1-2.8l-1.8-1.5h-7.7c2.4 1.1 4.7 2.6 6.8 4.5.7.6 2 .6 2.8-.2Zm-41.1 51.7c-2.6-6.1-3.7-12.8-1.1-18.8 2.9-6.7 8.6-9.6 14.3-10.4 2.9-.4 5.7-.3 8.1.1 2.4.4 4.3 1.1 5.2 1.7 4.7 3.1 9.5 7.7 8.6 16.1-.1 1.1.7 2.1 1.8 2.2 1.1.1 2.1-.7 2.2-1.8 1.1-10.6-5.1-16.5-10.4-19.9-1.6-1-4-1.8-6.7-2.3-2.8-.5-6-.6-9.3-.1-6.7 1-13.8 4.5-17.4 12.8-3.2 7.4-1.7 15.4 1.1 21.9 2.8 6.6 7 12.2 9.8 15.2.7.8 2 .9 2.8.1.8-.7.9-2 .1-2.8-2.6-2.7-6.5-7.9-9.1-14ZM128 71.5c4.4-.1 11.3 1.2 17.5 4.9 6.3 3.8 12 10.2 13.9 20.3 1.2 6.1.7 10.7-1.2 13.9-1.9 3.2-5.1 4.6-8.3 4.6-3.2 0-6.5-1.3-9.1-3.3-2.6-2.1-4.7-5-5.3-8.5-.8-4.7-4.7-7.4-8.6-7.3-2 0-3.8.7-5.2 2.1-1.5 1.4-2.6 3.6-2.8 7-.4 6.6 3.6 12.4 8.7 16.8 2.5 2.1 5.1 3.9 7.4 5.1 2.3 1.2 4 1.8 4.6 1.9 1.1.1 1.8 1.1 1.7 2.2-.1 1.1-1.1 1.8-2.2 1.7-1.3-.2-3.6-1.1-6-2.4-2.4-1.3-5.4-3.2-8.1-5.6-5.5-4.7-10.7-11.7-10.1-20.1.2-4.1 1.7-7.3 3.9-9.5s5.1-3.3 7.9-3.3c5.6-.1 11.4 3.8 12.6 10.6.4 2.3 1.9 4.4 3.9 6 2 1.6 4.5 2.5 6.6 2.5 2.1 0 3.8-.8 4.9-2.7 1.2-2 1.8-5.5.7-11.1-1.7-8.7-6.6-14.2-12.1-17.5-5.6-3.4-11.7-4.5-15.4-4.4h-.1c-5.3-.2-17.6 2.1-24.3 12.1-3.2 5-4.3 11.2-4.2 17.2.1 6 1.4 11.5 2.5 14.6.4 1-.2 2.1-1.2 2.5-1 .4-2.1-.2-2.5-1.2-1.2-3.5-2.6-9.4-2.7-15.8-.1-6.4 1-13.5 4.9-19.4C108 73.8 122 71.3 128 71.5Zm5.8 42.5c3.1 3.6 8.7 6.6 18.6 6 1.1-.1 2 .8 2.1 2 0 1.1-.8 2-1.9 2.1-10.9.6-17.8-2.7-21.9-7.4-4-4.7-5-10.4-4.7-14.3 0-1.1 1-2 2.1-1.9 1.1 0 2 1 1.9 2.1-.2 3.1.6 7.7 3.8 11.4ZM95.2 83.5c-.5 1-1.8 1.3-2.7.7-1-.6-1.3-1.8-.7-2.7 4-6.5 17-19 38.2-19 18 0 30.5 12.6 34.7 18.9.6.9.3 2.2-.6 2.8-.9.6-2.2.3-2.8-.6-3.8-5.7-15.2-17.1-31.3-17.1-19.6 0-31.4 11.5-34.8 17Z" clipRule="evenodd" />
                <path style={{ fill: "var(--bs-primary)" }} d="M185.9 47H0v12h256V47h-70.1Z" />
              </g>
            </svg>
          </div>
          <div className="flex items-center w-full border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm">
              <label className="cursor-pointer text-muted-foreground font-medium">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="mx-2 text-muted">|</span>
              <span className="truncate text-muted-foreground flex-1 text-left">
                {file ? file.name : "No file chosen"}
              </span>
            </div>
            {file && (
              isFileTooLarge ? (
                <p className="text-sm text-destructive text-left">Cannot be scanned: file is bigger than 32MB</p>
              ) : (
                <p className="text-sm text-muted-foreground text-right text-primary">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )
            )}
          <div className="flex justify-center">
            <Button className="text-md font-semibold min-h-[28px]" onClick={handleFileUpload} disabled={!file || loading || isFileTooLarge}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Scanning...</> : "Scan File"}
              </Button>
          </div>
        </TabsContent>
        <TabsContent value="url" className="mt-6 space-y-4 text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="84" viewBox="0 0 746 525"> 
            <path style={{ fill: "var(--bs-tertiary-color)" }} d="M596.5 241h-90.2c-.3-11.5-1.1-22.8-2.2-34h-30.2c1.2 11.1 2 22.5 2.3 34H386v-34h-30v34h-90.2c.4-11.5 1.1-22.9 2.3-34h-30.2c-1.1 11.1-1.8 22.5-2.2 34h-90.2c.8-11.5 2.4-22.9 4.8-34h-30.7c-3.1 16-4.7 32.4-4.7 49 0 68.4 26.6 132.7 75 181 48.4 48.4 112.6 75 181 75s132.7-26.6 181-75c48.4-48.4 75-112.6 75-181 0-16.6-1.6-33-4.7-49h-30.7c2.6 11.1 4.2 22.5 5 34zM171.1 361.5c-14.7-27.8-23.4-58.5-25.5-90.4h90.2c.9 31.6 4.8 62.2 11.5 90.4h-76.2zm40.1 54.3c-7.6-7.6-14.6-15.7-21.1-24.3h65.4c4.8 14.8 10.4 28.8 16.9 41.6 6.8 13.5 14.2 25.5 22.2 35.7-31-11.1-59.4-29-83.4-53zm88 3.9c-4.4-8.8-8.4-18.2-12-28.2H356v87.9c-20.7-6.9-40.8-27.8-56.8-59.7zm56.8-58.2h-77.9c-7.1-27.8-11.3-58.5-12.3-90.4H356v90.4zm30-90.5h90.2c-1 32-5.2 62.6-12.3 90.4H386V271zm0 208.4v-87.9h68.7c-3.6 9.9-7.6 19.4-12 28.2-15.9 31.9-36 52.8-56.7 59.7zm144.8-63.6c-24 24-52.4 41.9-83.4 53 8-10.2 15.5-22.1 22.2-35.7 6.4-12.8 12-26.8 16.9-41.6h65.4c-6.5 8.6-13.5 16.7-21.1 24.3zm40.1-54.3h-76.1c6.6-28.2 10.5-58.8 11.5-90.4h90.2c-2.1 31.9-10.8 62.6-25.6 90.4z"></path> 
            <path style={{ fill: "var(--bs-body-color)" }} d="M150.4 207c4.3-19.7 11.3-38.7 20.7-56.5h76.1c-4.2 18-7.3 36.9-9.3 56.5h30.2c2.1-19.7 5.4-38.7 10-56.5H356V207h30v-56.5h77.9c4.5 17.8 7.9 36.8 10 56.5h30.2c-1.9-19.6-5.1-38.5-9.3-56.5h76.1c9.4 17.8 16.3 36.7 20.7 56.5h30.7c-9.6-49.7-33.7-95.4-70.3-132C503.7 26.6 439.4 0 371 0S238.3 26.6 190 75c-36.6 36.6-60.7 82.3-70.3 132h30.7zM530.8 96.2c7.6 7.6 14.6 15.7 21.1 24.3h-65.4c-4.8-14.8-10.4-28.8-16.9-41.6-6.8-13.5-14.2-25.5-22.2-35.7 31 11.1 59.4 29 83.4 53zM386 32.6c20.7 6.9 40.8 27.8 56.7 59.7 4.4 8.8 8.4 18.2 12 28.2H386V32.6zm-30 0v87.9h-68.7c3.6-9.9 7.6-19.4 12-28.2 15.9-31.9 36-52.8-56.7-59.7zM211.2 96.2c24-24 52.4-41.9 83.4-53-8 10.2-15.5 22.1-22.2 35.7-6.4 12.8-12 26.8-16.9-41.6h-65.4c6.5-8.6 13.5-16.7 21.1-24.3z"></path>
            <path style={{ fill: "var(--bs-primary)" }} d="M.5 177h745v30H.5z"></path> </svg>
          </div>
          
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex justify-center">
            <Button className="text-md font-semibold min-h-[28px]" onClick={handleUrlScan} disabled={!url || loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Scanning...</> : "Scan URL"}</Button>
          </div>
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>
  )
}
