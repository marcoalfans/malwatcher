"use client"

import { motion } from "framer-motion"
import { memo, useMemo, Suspense, lazy, useEffect } from "react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FallbackImage } from "@/components/fallback-image"

// Lazy load heavy sections for better initial page load
const HeroSection = lazy(() => import("@/components/hero-section").then(m => ({ default: m.HeroSection })))
const ProjectsSection = lazy(() => import("@/components/projects-section").then(m => ({ default: m.ProjectsSection })))
const ScanSection = lazy(() => import("@/components/scan-section").then(m => ({ default: m.ScanSection })))
const CTFSection = lazy(() => import("@/components/ctf-section").then(m => ({ default: m.CTFSection })))
const ExperienceSection = lazy(() => import("@/components/experience-section").then(m => ({ default: m.ExperienceSection })))

// Memoized About section component
const AboutSection = memo(() => (
      <div className="container px-4 py-16 mx-auto max-w-7xl" id="about">
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="mb-12 text-center"
      >
        <h2 className="mb-8 text-3xl font-bold tracking-tight">About This Project</h2>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 30 }}
              transition={{ 
                duration: 0.4,
                ease: "easeOut"
              }}
              viewport={{ once: false }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
          <div className="margin-right:-10rem; space-y-4">
            <p className="text-base">
              Malwatcher is a TypeScript-based web project designed to perform malware analysis in a simple yet effective way. The application allows users to upload suspicious files and run inspection processes through a clean and responsive web interface.
            </p>
            <p className="text-base">
              Leveraging direct integration with the{" "}
              <Link href="www.virustotal.com" className="text-primary hover:underline">
                VirusTotal API
              </Link>{" "}
              , Malwatcher can scan and display detection results from multiple antivirus engines within seconds. Information such as file status, hashes, and detection details from popular engines are displayed in real time on the dashboard. Built using the 
              <Link href="https://www.typescriptlang.org/" className="text-primary hover:underline">
                {" "}
                modern JavaScript ecosystem (TypeScript + NPM)
              </Link>{" "}
              , the project is structured to be modular and lightweight — making it easy to extend for both local use and collaborative development.
            </p>
            <p className="text-base">
              The Malwatcher dashboard includes scan history tracking, keyword and time-based filtering, as well as simple data visualizations such as {" "}
              <Link href="https://attack.mitre.org/" className="text-primary hover:underline">MITRE ATT&CK</Link>{" "}
              techniques and detection counts. In addition, Malwatcher integrates with {" "}
              <Link href="https://t.me/+S24y6omjHus5NjFl" className="text-primary hover:underline">Telegram Bot</Link>{" "} and {" "}
              <Link href="https://app.slack.com/client/T08CPVA5L4Q/C08PRPMJY5Q" className="text-primary hover:underline">Slack Bot</Link>{" "} to provide automatic notifications, enabling real-time threat monitoring through familiar communication platforms.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Malwatcher was built by Group 1 – ACS EDU 3rd Gen as part of a collaborative learning journey in cybersecurity. We hope it sparks more open-source projects, shared learning, and community-driven innovation.
              <br></br>Thanks for visiting! -{" "}
              <Link href={"#connect"} className="text-primary hover:underline">
                "kac0"
              </Link>
              {" "}
            </p>
          </div>
          </motion.div>
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4,
                ease: "easeOut"
              }}
              viewport={{ once: false }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
            <div className="relative w-64 h-64 overflow-hidden rounded-full border-4 border-primary/20">
              <FallbackImage
                src="https://avatars.githubusercontent.com/u/60995418"
                alt="Kac0 Avatar"
                width={256}
                height={256}
                className="object-cover rounded-full"
                priority
              />
            </div>
          </motion.div>
          </div>
        </div>
      </div>
))

AboutSection.displayName = 'AboutSection'


// Loading fallback component
const SectionFallback = memo(() => (
  <div className="flex items-center justify-center py-16">
    <LoadingSpinner />
  </div>
))

SectionFallback.displayName = 'SectionFallback'

function HomePageClient() {

  useEffect(() => {
    // Handle scroll to hash on page load
    const hash = window.location.hash
    if (hash) {
      // Wait a bit for the content to render
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          const headerOffset = 80 // Account for sticky header
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 500) // Longer delay for home page as sections are lazy loaded
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Suspense fallback={<SectionFallback />}>
        <HeroSection />
      </Suspense>

      <AboutSection />

      <Suspense fallback={<SectionFallback />}>
        <ScanSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ExperienceSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CTFSection />
      </Suspense>
    </div>
  )
}

export default memo(HomePageClient)
