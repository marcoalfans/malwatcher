import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, FileText, BookOpen, ScanText, Logs } from "lucide-react"
import { withBasePath } from "@/lib/utils"

export function Footer() {
  return (
    <footer className="py-12 border-t border-muted bg-background/50">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-medium">Malwatcher Project</h3>
            <p className="text-sm text-muted-foreground">
              Malware Analysis Lightweight Watcher for hands-on threat detection and real-time monitoring. <br></br>Built by Group 1, ACS EDU 3rd Gen.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                 <BookOpen className="w-4 h-4" />
                  About
                </Link>
              </li>
              <li>
                <Link href="/#scan" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                 <ScanText className="w-4 h-4" /> 
                  Scan
                </Link>
              </li>
              <li>
                <Link href="/scan-result" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Logs className="w-4 h-4" /> 
                  Logs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Connect</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="https://github.com/marcoalfans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </Link>
              <Link
                href="https://twitter.com/marcoalfans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/marcoalfans/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </Link>
              <Link
                href="mailto:marcoalfan@ui.ac.id"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 text-center border-t border-muted">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Marco Alfan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
