"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Image from "next/image"

export function DashboardSection() {

  return (
      <motion.div
            className="p-4 sm:p-6 mt-16 mb-16 text-center rounded-lg bg-primary/5"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative max-w-md mx-auto">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image 
                  src="https://avatars.githubusercontent.com/u/60995418" 
                  alt="Marco Alfan Profile" 
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-primary/50 shadow-lg"
                />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </motion.div>
              </div>
              <h3 id="connect" className="mb-2 text-xl font-semibold">Let’s connect and build cool stuff together!</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                I'm always looking for new teammates and collaborators for security research and cybersecurity challenges.
              </p>
              <a href="mailto:marco.alfan@ui.ac.id" className="inline-flex items-center text-primary hover:underline text-sm">
                Slide into my inbox  →
              </a>
            </div>
          </motion.div>
  )
}
