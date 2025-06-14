// /lib/vt-scan.ts (refactored)
const vtScan = {
  async postFiles({ file }: { file: File }) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/vt/scan-file', {
      method: 'POST',
      body: formData,
    })
    return await res.json()
  },

  async scanUrl({ url }: { url: string }) {
    const res = await fetch('/api/vt/scan-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    return await res.json()
  },

  async pollAnalysis(id: string) {
    const res = await fetch(`/api/vt/get-analysis?id=${id}`)
    return await res.json()
  },

  async getDetails(meta: any) {
    const res = await fetch(`/api/vt/get-details?sha256=${meta.sha256}`)
    return await res.json()
  },

  async getBehaviours(meta: any) {
    const res = await fetch(`/api/vt/get-behaviours?sha256=${meta.sha256}`)
    return await res.json()
  },
}

export default vtScan
