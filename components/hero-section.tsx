"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Github, Linkedin, Mail, Twitter, Gamepad2, BookOpen, Shield, Speech, Brain, VenetianMask, SquareTerminal, IdCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { TypeAnimation } from "react-type-animation"
import { useInView } from "react-intersection-observer"
import Particles from "react-particles"
import { loadSlim } from "tsparticles-slim"
import type { Engine } from "tsparticles-engine"
import { withBasePath } from "@/lib/utils"

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("hacker")
  const [particlesContainer, setParticlesContainer] = useState<Engine | null>(null)
  const [isParticlesLoaded, setIsParticlesLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine)
    setParticlesContainer(engine)
    setIsParticlesLoaded(true)
  }

  const tabs = [
    {
      id: "hacker",
      label: "Project",
      icon: <SquareTerminal className="w-5 h-5" />,
      color: "neon-text-pink",
    },
    {
      id: "mentor",
      label: "Mentor",
      icon: <VenetianMask className="w-5 h-5" />,
      color: "neon-text-blue",
    },
    {
      id: "student",
      label: "Student",
      icon: <IdCard className="w-5 h-5" />,
      color: "neon-text-green",
    },
  ]
  const memberImages = ["/images/group1/kac0.jpg",
    "/images/group1/rafif.jpg",
    "/images/group1/htet aung.png",
    "/images/group1/Nasha Azmi.jpg",
    "/images/group1/Zwe nyi nyar.jpg",
    "/images/group1/ginseng.jpg"]

  const tabContent = {
    hacker: {
      title: "ACS EDU 3rd Generation",
      subtitle: "Malwatcher project",
      description:
        "This project challenges us to conduct malware analysis, from static inspection to dynamic behavior tracing—aiming to detect threats, extract indicators, and develop tools that enhance digital defense. It’s a journey to deepen our technical expertise while contributing to real-world cybersecurity efforts.",
      stats: [
        { label: "Hours Spent", value: "160+" },
        { label: "Cups of Caffeine", value: "28+" },
        { label: "Code Errors", value: "36+" },
      ],
    },
    mentor: {
      title: "ACS EDU 3rd Generation",
      subtitle: "Led by an Inspiring Mentor",
      description:
        "Guiding us throughout the project, our mentor provides support, insights, and direction — helping us grow and stay on track during this learning journey, thanks to mentor (hanzo).",
      stats: [
        { label: "CVEs", value: "16+" },
        { label: "CTF Trophy", value: "11+" },
        { label: "Rizz Aura", value: "99+" },
      ],
    },
    student: {
      title: "ACS EDU 3rd Generation",
      subtitle: "ACS EDU 3rd Generation",
      description:
        "United through the ACS EDU Advanced track, we are aspiring cybersecurity practitioners on a hands-on mission to explore the world of Malware Analysis. We aim to grow, collaborate, and stand out — with hopes of being chosen as outstanding students and joining the bootcamp in South Korea.",
      stats: [
        { label: "Active Member", value: "7+" },
        { label: "Across Nation", value: "3+" },
        { label: "Bootcamp-bound", value: "?" },
      ],
    },
  }

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-black to-background"
      ref={containerRef}
      style={{ 
        minHeight: "100vh",
        width: "100%",
        padding: "2rem 0",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          width: "100%", 
          height: "100%",
          opacity: isParticlesLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            particles: {
              color: {
                value: ["#9c27b0", "#2196f3", "#ff5722"],
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 1000,
                },
                value: 60,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
          style={{ 
            width: "100%", 
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      </div>

      <motion.div 
        style={{ opacity, y }} 
        className="container relative z-10 mx-auto max-w-7xl h-full"
      >
        <div className="grid items-center h-full gap-8 px-4 lg:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
            style={{ 
              minHeight: "auto",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-primary/20 text-primary">
                <TypeAnimation
                  sequence={["Malware Analysis", 1000, "Threat Scanning", 1000, "File Inspection", 1000, "Real-Time Detection", 1000]}
                  wrapper="span"
                  speed={50}
                  repeat={Number.POSITIVE_INFINITY}
                />
              </div>

              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl lg:text-5xl glitch"
                data-text="Group 1"
              >
                <span
                  className={`${activeTab === "hacker" ? "neon-text-green" : ""} ${activeTab === "mentor" ? "neon-text-blue" : ""} ${activeTab === "student" ? "neon-text-pink" : ""}`}
                >
                  Group 1
                </span>
              </h1>

              <h2 className="text-xl sm:text-2xl font-medium text-muted-foreground">
                {tabContent[activeTab as keyof typeof tabContent].subtitle}
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground">
              {tabContent[activeTab as keyof typeof tabContent].description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex p-1 space-x-1 rounded-full bg-muted">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium transition-all rounded-full ${
                      activeTab === tab.id
                        ? "bg-background text-primary shadow-lg"
                        : "hover:bg-background/50 text-muted-foreground"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {tabContent[activeTab as keyof typeof tabContent].stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-3 text-center rounded-lg bg-background/50 backdrop-blur-sm"
                >
                  <div className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#scan" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full gap-2 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
                >
                  Analyze Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/scan-result" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10"
                >
                  View Logs
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative hidden lg:flex"
            style={{ 
              height: "auto",
              minHeight: "500px",
              width: "100%",
              position: "relative",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {activeTab === "hacker" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md p-6 rounded-lg retro-terminal scanlines">
                      <div className="text-sm">
                        <span className="text-green-400">root@kali:~#</span>{" "}
                        <span className="cursor-blink">./malwatcher.sh</span>
                      </div>
                      <div className="mb-4">
                        <pre className="text-sm">
                          {`___  ___        _                   _          _                 
|  \\/  |       | |                 | |        | |                
| .  . |  __ _ | |__      __  __ _ | |_   ___ | |__    ___  _ __ 
| |\\/| | / _' || |\\ \\ /\\ / / / _' || __| / __|| '_ \\  / _ \\| '__|
| |  | || (_| || | \\ V  V / | (_| || |_ | (__ | | | ||  __/| |   
\\_|  |_/ \\__,_||_|  \\_/\\_/   \\__,_| \\__| \\___||_| |_| \\___||_|                                                                                                                             
Malware Analysis | Threat Scanning | Real-Time Detection
`}
                        </pre>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-400">root@kali:~#</span> whoami
                      </div>
                      <div className="mb-4 text-sm">
                        <pre>
                          {`group1-ACS-EDU-3rdGeneration
`}
                        </pre>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-400">root@kali:~#</span> ls -la group1/
                      </div>
                      <div className="mb-4 text-sm">
                        <pre>
                          {`total 7
drwxr-xr-x  2 root kali 4096 May 22 06:23 .
drwxr-xr-x 10 root kali 4096 May 22 06:23 ..
-rwxr-xr-x  1 root kali 8192 May 22 06:23 Marco_Alfan 🇮🇩
-rwxr-xr-x  1 root kali 6144 May 22 06:23 Ei_Kinsanar_Thwe 🇲🇲
-rwxr-xr-x  1 root kali 5120 May 22 06:23 M_Rafif_Irfan 🇮🇩
-rwxr-xr-x  1 root kali 4096 May 22 06:23 Han_Thar_Htet_Aung 🇲🇲
-rwxr-xr-x  1 root kali 3072 May 22 06:23 Nasha_Azmi 🇧🇳
-rwxr-xr-x  1 root kali 3054 May 22 06:23 Hsu_Wai_Lwin_Hnin 🇲🇲
`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "mentor" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                    <div className="w-full max-w-md p-4 game-card">
                      <div className="mb-4 text-center">
                        <h3 className="mb-2 text-xl font-bold text-blue-400">Our Mentor</h3>
                        <div 
                          className="relative mx-auto mb-3 overflow-hidden rounded-full"
                          style={{ 
                            width: "64px", 
                            height: "64px",
                            aspectRatio: "1/1"
                          }}
                        >
                          <Image
                            src="https://rayhanhanaputra.github.io/assets/profile.jpeg"
                            alt="Rayhan Ramdhany Hanaputra"
                            width={64}
                            height={64}
                            className="object-cover"
                            priority
                            sizes="64px"
                            style={{ 
                              width: "64px", 
                              height: "64px",
                              maxWidth: "100%",
                              display: "block"
                            }}
                          />
                        </div>
                        <p className="text-lg font-semibold">Rayhan Ramdhany Hanaputra</p>
                        <p className="text-xs text-blue-300">Security Researcher</p>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Sessions</span>
                          <span className="text-xs">15/15</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300" 
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Hours</span>
                          <span className="text-xs">30/30</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300" 
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Impact</span>
                          <span className="text-xs">9,642 / 10,000</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-300" 
                            style={{ width: "87%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 text-center rounded-lg bg-blue-900/50">
                          <div className="text-lg font-bold text-blue-400">CTF</div>
                          <div className="text-base">85</div>
                        </div>
                        <div className="p-2 text-center rounded-lg bg-blue-900/50">
                          <div className="text-lg font-bold text-blue-400">PWN</div>
                          <div className="text-base">95</div>
                        </div>
                        <div className="p-2 text-center rounded-lg bg-blue-900/50">
                          <div className="text-lg font-bold text-blue-400">RE</div>
                          <div className="text-base">78</div>
                        </div>
                        <div className="p-2 text-center rounded-lg bg-blue-900/50">
                          <div className="text-lg font-bold text-blue-400">MISC</div>
                          <div className="text-base">42</div>
                        </div>
                      </div>

                      <div className="flex justify-center gap-2">
                        <div className="p-1.5 text-center rounded-full achievement-badge">
                          <Speech className="w-5 h-5 text-black" />
                        </div>
                        <div className="p-1.5 text-center rounded-full achievement-badge">
                          <Brain className="w-5 h-5 text-black" />
                        </div>
                        <div className="p-1.5 text-center rounded-full achievement-badge">
                          <BookOpen className="w-5 h-5 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "student" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900/50 to-purple-900/50">
                    <div className="w-full max-w-md manga-panel bg-white">
                      <div className="p-6">
                        <div className="mb-4 text-center">
                          <h3 className="mb-2 text-2xl font-bold text-black">Faces You Can Count On</h3>
                        </div>

                        <div className="mb-6 speech-bubble">
                          <p className="text-black">
                            "Say hello to the faces behind Group 1; learners, doers, and future cybersecurity experts."
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {memberImages.map((src, i) => (
                            <div 
                              key={i} 
                              className="relative overflow-hidden bg-gray-200 rounded-md shadow-md"
                              style={{ width: "100%", height: "96px" }}
                            >
                              <Image
                                src={src}
                                alt={`member ${i}`}
                                width={64}
                                height={96}
                                className="object-cover w-full h-full"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="pixel-divider"></div>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-black">Tech Interests:</p>
                          <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <span className="px-2 py-1 text-xs text-white bg-pink-500 rounded-full">Malware Analysis</span>
                            <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded-full">Incident Response</span>
                            <span className="px-2 py-1 text-xs text-white bg-purple-500 rounded-full">Threat Intelligence</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="#about">
            <Button variant="ghost" className="mb-10 animate-bounce" aria-label="Scroll down">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
