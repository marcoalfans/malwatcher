import axios from 'axios'

const API_BASE = 'https://www.virustotal.com/api/v3'
const API_KEY = process.env.NEXT_PUBLIC_VT_APIKEY ?? ''

const pollAnalysis = async (id: string, retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    const res = await vtScan.getAnalysis(id)
    if (res?.data?.attributes?.status === 'completed') {
      console.log('[VT Scan][Analysis Completed]', res)
      return res
    }
    console.log(`[VT Scan][Polling] Try ${i + 1}: Status = ${res?.data?.attributes?.status}`)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  throw new Error('Analysis did not complete in time.')
}

const vtScan = {
  postFiles: async (params: { file: File }) => {
    try {
      const formData = new FormData()
      formData.append('file', params.file)

      const response = await axios.post(`${API_BASE}/files`, formData, {
        headers: {
          'x-apikey': API_KEY,
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('[VT Scan][File] Response:', response.data)
      return response.data
    } catch (err) {
      console.error('[VT Scan][File] Error:', err)
      throw err
    }
  },

  scanUrl: async (params: { url: string }) => {
    try {
      const response = await axios.post(`${API_BASE}/urls`, new URLSearchParams({ url: params.url }), {
        headers: {
          'x-apikey': API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      console.log('[VT Scan][URL] Response:', response.data)
      return response.data
    } catch (err) {
      console.error('[VT Scan][URL] Error:', err)
      throw err
    }
  },
  //Get a URL / file analysis
  getAnalysis: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE}/analyses/${id}`, {
        headers: {
          'x-apikey': API_KEY,
          'accept': 'application/json'
        }
      })
      return response.data
    } catch (err) {
      console.error('[VT Scan][Analysis] Error:', err)
      throw err
    }
  },
  pollAnalysis: async (id: string, retries = 20, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
      const res = await vtScan.getAnalysis(id)
      const status = res?.data?.attributes?.status
      if (status === 'completed') {
        console.log('[VT Scan][Analysis Completed] :', res)
        return res
      }
      console.log(`[VT Scan][Polling] Try ${i + 1}: Status = ${status}`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    throw new Error('Analysis did not complete in time.')
  },
  getBehaviours: async (meta: { sha256?: string; sha1?: string; md5?: string }, limit: number = 10, retries = 10, delay = 3000) => {
    const hashes = [meta.sha256, meta.sha1, meta.md5].filter(Boolean)

    for (const hash of hashes) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.get(`${API_BASE}/files/${hash}/behaviours?limit=${limit}`, {
            headers: {
              'x-apikey': API_KEY,
              'accept': 'application/json'
            }
          })
          console.log(`[VT Scan][Behaviours] (${hash}) Response:`, response.data)
          return response.data
        } catch (err: any) {
          if (err.response?.status === 404) {
            console.warn(`[VT Scan][Behaviours] Try ${i + 1}: ${hash} not ready yet`)
            await new Promise(resolve => setTimeout(resolve, delay))
          } else {
            console.error('[VT Scan][Behaviours] Error:', err)
            throw err
          }
        }
      }
    }

    throw new Error('Could not fetch behaviours for any provided hash.')
  }
}

export default vtScan
