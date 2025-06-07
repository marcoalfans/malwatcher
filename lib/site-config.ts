export const siteConfig = {
  name: "Malwatcher",
  description: "Malwatcher is a collaborative malware analysis project that provides a simple web-based interface for scanning files, viewing threat metadata, and tracking detection logs. Designed with clarity and usability in mind, it’s perfect for students, researchers, and cyber enthusiasts.",
  url: "http://localhost:3000/", // Update this with your actual domain
  author: {
    name: "Marco Alfan",
    linkedin: "marcoalfans", // Update with your actual LinkedIn username
    github: "marcoalfans", // Update with your actual GitHub username
    email: "marco.alfan@ui.ac.id", // Update with your actual email
  },
  social: {
    linkedin: "https://linkedin.com/in/marcoalfans", // Update with your actual LinkedIn URL
    github: "https://github.com/marcoalfans", // Update with your actual GitHub URL
  }
} as const

export type SiteConfig = typeof siteConfig
