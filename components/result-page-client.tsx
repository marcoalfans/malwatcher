// components/result-page-client.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { ResultNavigation } from "@/components/result-navigation"
import { ResultCard} from "@/components/result-card"
import { motion, AnimatePresence } from "framer-motion" 
import { Sparkles } from "lucide-react"

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

type Props = {
  results: {
    filename: string
    data:VTAnalBehavData
  }[]
}


export function ResultPageClient({ results }: Props) {
  // State untuk melacak file yang sedang aktif (yang dipilih dari navigasi)
  const [activeFile, setActiveFile] = useState<string | null>(null);
  // State untuk mengelola ekspansi Card
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  // Objek untuk menyimpan refs dari setiap ResultCard
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());


  // Handler untuk mengelola ekspansi Card
  const handleResultCardClick = (index: number) => {
    // Memastikan jika card yang sama diklik lagi, dia akan tertutup
    setSelectedCardIndex(prev => (prev === index ? null : index));
  }

  // Handler ketika tombol navigasi diklik
  const handleSelectFile = (filename: string) => {
    setActiveFile(filename);
    // Gulir ke card yang sesuai
    const node = cardRefs.current.get(filename);
    if (node) {
      node.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Gulir ke bagian atas elemen
      });
      // Opsional: Jika Anda ingin mengklik navigasi juga otomatis membuka card
      // const indexToExpand = sortedResults.findIndex(r => r.filename === filename);
      // if (indexToExpand !== -1) {
      //   setSelectedCardIndex(indexToExpand);
      // }
    }
  };

  // Membuat salinan array dan mengurutkannya
  const sortedResults = [...results].sort((a, b) => {
    const dateA = new Date(a.data.timestamp).getTime();
    const dateB = new Date(b.data.timestamp).getTime();
    // Mengurutkan dari yang terbaru ke terlama
    return dateB - dateA;
  });

  // Set file aktif awal saat komponen pertama kali dimuat
  useEffect(() => {
    if (sortedResults.length > 0 && activeFile === null) {
      setActiveFile(sortedResults[0].filename);
    }
  }, [sortedResults, activeFile]);


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

      <ResultNavigation
        logs={sortedResults.map(r => ({ filename: r.filename }))}
        onSelectFile={handleSelectFile}
        activeFilename={activeFile}
      />

      <div className="relative border-l-2 border-muted pl-8 ml-4">
        {sortedResults.map((r, index) => {
          const metadata = r.data?.detailsFile.data?.attributes?.md5 || r.data?.detailsFile.data?.attributes?.sha256 || "-";
          return (
            <div
              key={r.filename}
              className="mb-10"
              // Set ref untuk setiap div pembungkus ResultCard
              ref={(el: HTMLDivElement) => {
                if (el) {
                  cardRefs.current.set(r.filename, el);
                } else {
                  cardRefs.current.delete(r.filename);
                }
              }}
            >
              {/* PENTING: Sekarang ResultCard itu sendiri adalah motion component */}
              <ResultCard
                filename={r.filename}
                data={r.data}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02}}
                className="cursor-pointer w-full"
                onClick={() => handleResultCardClick(index)} // Tetap panggil ini untuk ekspansi
              >
                <AnimatePresence>
                  {selectedCardIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-muted-foreground">
                        🔗 View Full Report for &nbsp;
                        <a
                          href={`https://www.virustotal.com/gui/file/${metadata}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {r.data.filename}
                        </a>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ResultCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
