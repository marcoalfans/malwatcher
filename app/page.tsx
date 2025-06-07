import { Metadata } from "next"
import HomePageClient from "@/components/home-page-client"

// Environment variables with fallbacks
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
const fullUrl = `${baseUrl}${basePath}`

export const metadata: Metadata = {
  title: "Malwatcher | Project ACS EDU 3rd Generation",
  description: "Malwatcher is a collaborative malware analysis project that provides a simple web-based interface for scanning files, viewing threat metadata, and tracking detection logs. Designed with clarity and usability in mind, it’s perfect for students, researchers, and cyber enthusiasts.",
  keywords: ["cybersecurity", "malware analysis", "threat detection", "security research", "vulnerability", "ACS EDU", "hacking", "Indonesia"],
  authors: [{ name: "Marco Alfan", url: baseUrl }],
  creator: "Marco Alfan",
  publisher: "Marco Alfan",
  alternates: {
    canonical: fullUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: fullUrl,
    siteName: "Malwatcher",
    title: "Malwatcher | Project ACS EDU 3rd Generation",
    description: "Malwatcher is a collaborative malware analysis project that provides a simple web-based interface for scanning files, viewing threat metadata, and tracking detection logs. Designed with clarity and usability in mind, it’s perfect for students, researchers, and cyber enthusiasts.",
    images: [
      {
        url: `${fullUrl}/favicon.jpg`,
        width: 1200,
        height: 630,
        alt: "Malwatcher | Project ACS EDU 3rd Generation",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kac0",
    creator: "@kac0",
    title: "Malwatcher | Project ACS EDU 3rd Generation",
    description: "Malwatcher is a collaborative malware analysis project that provides a simple web-based interface for scanning files, viewing threat metadata, and tracking detection logs. Designed with clarity and usability in mind, it’s perfect for students, researchers, and cyber enthusiasts.",
    images: [`${fullUrl}/favicon.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomePage() {
  return (
    <>
      <HomePageClient />
    </>
  )
}
