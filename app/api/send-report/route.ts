// Malwatcher/app/api/send-report/route.ts

import { NextResponse } from 'next/server';
import { sendScanReportToTelegram } from '@/lib/send-tele'; 

/**
 * Interface untuk data yang diharapkan dari request body klien.
 * Ini harus sesuai dengan interface TelegramMessageData di send-telegram-message.ts
 */
interface IncomingScanReportData {
  fileName: string;
  md5: string;
  sha1: string;
  sha256: string;
  detections: string;
  sigmaRulesCount: number;
  yaraRulesCount: number;
  threatLabel?: string;
  score?: number;
  viewReportUrl?: string;
  timestamp?: string;
  fileExtension?: string;
}

/**
 * Handler untuk request POST ke /api/send-report.
 * Menerima data laporan scan dari klien dan memanggil fungsi server-side
 * untuk mengirimkannya ke Telegram.
 *
 * @param request Objek Request dari Next.js App Router.
 * @returns Objek NextResponse dengan status dan pesan respons.
 */
export async function POST(request: Request) {
  try {
    // Memparsing body request sebagai JSON.
    const reportData: IncomingScanReportData = await request.json();

    // Memanggil fungsi inti pengiriman Telegram yang ada di folder lib.
    const result = await sendScanReportToTelegram(reportData);

    // Mengembalikan respons yang sesuai berdasarkan hasil pengiriman.
    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      // Menangani kasus di mana pengiriman Telegram gagal.
      // Anda bisa lebih spesifik dalam kode status berdasarkan pesan error.
      const statusCode = result.message.includes('not configured') ? 500 : 400; // Contoh: 500 jika konfigurasi, 400 jika ada masalah data
      return NextResponse.json({ message: result.message }, { status: statusCode });
    }
  } catch (error) {
    // Menangkap error umum yang mungkin terjadi selama proses.
    console.error('API Route /api/send-report Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server internal saat memproses laporan scan.' }, { status: 500 });
  }
}

// Anda bisa menambahkan handler untuk metode HTTP lain jika diperlukan,
// contoh: export async function GET(request: Request) { ... }
