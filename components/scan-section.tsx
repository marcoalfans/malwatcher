"use client"

import { motion } from "framer-motion"
import { Shield, Terminal, Server, Code, Database, Globe, Icon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const skills = [
  {
    category: "Cybersecurity",
    icon: <Shield className="w-6 h-6" />,
    items: ["Penetration Testing", "Vulnerability Assessment", "CTF Competitions", "Security Research"],
  },
  {
    category: "Operating Systems",
    icon: <Terminal className="w-6 h-6" />,
    items: ["Linux", "Windows", "Kali Linux", "Ubuntu"],
  },
  {
    category: "Infrastructure",
    icon: <Server className="w-6 h-6" />,
    items: ["Docker", "Kubernetes", "AWS", "Networking"],
  },
  {
    category: "Programming",
    icon: <Code className="w-6 h-6" />,
    items: ["Python", "JavaScript", "PHP", "Bash", "Go"],
  },
  {
    category: "Databases",
    icon: <Database className="w-6 h-6" />,
    items: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
  },
  {
    category: "Web Technologies",
    icon: <Globe className="w-6 h-6" />,
    items: ["HTML/CSS", "React", "Node.js", "Web Security"],
  },
]

export function ScanSection() {
  
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string>("")

  const handleFileUpload = async () => {
    if (!file) return
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/virustotal/files", {
        method: "POST",
        headers: {
          "x-apikey": "062c041db9838c89f22ef3e5384ecf6e02f636943de399933233c7aab8c320b4"
        },
        body: formData
      })
      const result = await response.json()
      console.log("File Scan Result:", result)
    } catch (err) {
      console.error("File Upload Error:", err)
    }
  }

  const handleUrlScan = async () => {
    if (!url) return
    try {
      const response = await fetch("/api/virustotal/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": "062c041db9838c89f22ef3e5384ecf6e02f636943de399933233c7aab8c320b4"
        },
        body: JSON.stringify({ url })
      })
      const result = await response.json()
      console.log("URL Scan Result:", result)
    } catch (err) {
      console.error("URL Scan Error:", err)
    }
  }

  return (
    <div className="container px-4 py-16 mx-auto max-w-7xl" id="scan">
      <h2 className="mb-6 text-3xl font-bold text-center">Scan with Malwatcher</h2>
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
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="flex justify-center">
            <Button className="text-md font-semibold min-h-[28px]" onClick={handleFileUpload} disabled={!file}>Scan File</Button>
          </div>
        </TabsContent>
        <TabsContent value="url" className="mt-6 space-y-4 text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="84" viewBox="0 0 746 525"> 
            <path style={{ fill: "var(--bs-tertiary-color)" }} d="M596.5 241h-90.2c-.3-11.5-1.1-22.8-2.2-34h-30.2c1.2 11.1 2 22.5 2.3 34H386v-34h-30v34h-90.2c.4-11.5 1.1-22.9 2.3-34h-30.2c-1.1 11.1-1.8 22.5-2.2 34h-90.2c.8-11.5 2.4-22.9 4.8-34h-30.7c-3.1 16-4.7 32.4-4.7 49 0 68.4 26.6 132.7 75 181 48.4 48.4 112.6 75 181 75s132.7-26.6 181-75c48.4-48.4 75-112.6 75-181 0-16.6-1.6-33-4.7-49h-30.7c2.6 11.1 4.2 22.5 5 34zM171.1 361.5c-14.7-27.8-23.4-58.5-25.5-90.4h90.2c.9 31.6 4.8 62.2 11.5 90.4h-76.2zm40.1 54.3c-7.6-7.6-14.6-15.7-21.1-24.3h65.4c4.8 14.8 10.4 28.8 16.9 41.6 6.8 13.5 14.2 25.5 22.2 35.7-31-11.1-59.4-29-83.4-53zm88 3.9c-4.4-8.8-8.4-18.2-12-28.2H356v87.9c-20.7-6.9-40.8-27.8-56.8-59.7zm56.8-58.2h-77.9c-7.1-27.8-11.3-58.5-12.3-90.4H356v90.4zm30-90.5h90.2c-1 32-5.2 62.6-12.3 90.4H386V271zm0 208.4v-87.9h68.7c-3.6 9.9-7.6 19.4-12 28.2-15.9 31.9-36 52.8-56.7 59.7zm144.8-63.6c-24 24-52.4 41.9-83.4 53 8-10.2 15.5-22.1 22.2-35.7 6.4-12.8 12-26.8 16.9-41.6h65.4c-6.5 8.6-13.5 16.7-21.1 24.3zm40.1-54.3h-76.1c6.6-28.2 10.5-58.8 11.5-90.4h90.2c-2.1 31.9-10.8 62.6-25.6 90.4z"></path> 
            <path style={{ fill: "var(--bs-body-color)" }} d="M150.4 207c4.3-19.7 11.3-38.7 20.7-56.5h76.1c-4.2 18-7.3 36.9-9.3 56.5h30.2c2.1-19.7 5.4-38.7 10-56.5H356V207h30v-56.5h77.9c4.5 17.8 7.9 36.8 10 56.5h30.2c-1.9-19.6-5.1-38.5-9.3-56.5h76.1c9.4 17.8 16.3 36.7 20.7 56.5h30.7c-9.6-49.7-33.7-95.4-70.3-132C503.7 26.6 439.4 0 371 0S238.3 26.6 190 75c-36.6 36.6-60.7 82.3-70.3 132h30.7zM530.8 96.2c7.6 7.6 14.6 15.7 21.1 24.3h-65.4c-4.8-14.8-10.4-28.8-16.9-41.6-6.8-13.5-14.2-25.5-22.2-35.7 31 11.1 59.4 29 83.4 53zM386 32.6c20.7 6.9 40.8 27.8 56.7 59.7 4.4 8.8 8.4 18.2 12 28.2H386V32.6zm-30 0v87.9h-68.7c3.6-9.9 7.6-19.4 12-28.2 15.9-31.9 36-52.8 56.7-59.7zM211.2 96.2c24-24 52.4-41.9 83.4-53-8 10.2-15.5 22.1-22.2 35.7-6.4 12.8-12 26.8-16.9 41.6h-65.4c6.5-8.6 13.5-16.7 21.1-24.3z"></path>
            <path style={{ fill: "var(--bs-primary)" }} d="M.5 177h745v30H.5z"></path> </svg>
          </div>
          
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex justify-center">
            <Button className="text-md font-semibold min-h-[28px]" onClick={handleUrlScan} disabled={!url}>Scan URL</Button>
          </div>
        </TabsContent>
      </Tabs>

      <h2 className="mb-12 mt-20 text-3xl font-bold tracking-tight text-center">Skills & Expertise</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true, margin: "-50px" }}
            className="p-6 rounded-lg bg-card min-h-[200px]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">{skill.icon}</div>
              <h3 className="text-xl font-semibold min-h-[28px]">{skill.category}</h3>
            </div>

            <ul className="space-y-2">
              {skill.items.map((item) => (
                <li key={item} className="flex items-center gap-2 min-h-[24px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
