import { promises as fs } from 'fs'
import path from 'path'

/**
 * Simpan file JSON hasil scan ke folder /logs/
 * @param data - Objek yang akan disimpan sebagai JSON
 * @param filename - Nama file tanpa path
 */
export async function saveLogFile(data: any, filename: string) {
  const logsDir = path.join(process.cwd(), 'logs')

  try {
    // Pastikan folder /logs ada
    await fs.mkdir(logsDir, { recursive: true })

    const filePath = path.join(logsDir, filename)
    const content = JSON.stringify(data, null, 2)

    await fs.writeFile(filePath, content, 'utf8')
    console.log(`[VT Save] Saved log file at: ${filePath}`)

    return { success: true, path: filePath }
  } catch (error) {
    console.error('[VT Save] Error writing log file:', error)
    return { success: false, error }
  }
}
