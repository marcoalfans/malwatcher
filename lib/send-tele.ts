// Malwatcher/lib/send-telegram-message.ts

/**
 * Interface untuk data laporan scan yang akan dikirimkan ke Telegram.
 * Sesuaikan properti ini agar sesuai dengan struktur data hasil scan Anda.
 */
interface TelegramMessageData {
  fileName: string;
  timestamp?: string;      
  type_tags?: string[];  
  md5: string;
  sha1: string;
  sha256: string;
  score?: number;          
  threatLabel?: string;   
  sigmaRulesCount: number; 
  yaraRulesCount: number;   
  viewReportUrl?: string;  
  groupedMitre?: Record<string, { id: string; description: string }[]>;
  groupedSigma?: Record<string, { title: string }[]>;
  yaraRulesetNames?: string[];  
}

/**
 * Mengirimkan laporan scan malware ke grup/chat Telegram tertentu.
 * Fungsi ini harus dipanggil dari lingkungan server (misalnya, Next.js API Route)
 * karena mengakses token bot dari variabel lingkungan.
 *
 * @param reportData Objek berisi data laporan scan yang akan dikirim.
 * @returns Objek yang menunjukkan keberhasilan pengiriman dan pesan terkait.
 */
export async function sendScanReportToTelegram(reportData: TelegramMessageData): Promise<{ success: boolean; message: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Memeriksa apakah variabel lingkungan sudah dikonfigurasi.
  if (!botToken || !chatId) {
    console.error('sendScanReportToTelegram Error: Telegram bot token or chat ID is not configured in environment variables.');
    return { success: false, message: 'Telegram bot not configured. Please check your .env file.' };
  }

  const {
    fileName,
    md5,
    sha1,
    sha256,
    threatLabel,
    score,
    viewReportUrl,
    timestamp,
    type_tags,
    groupedMitre,
    groupedSigma,
    yaraRulesetNames 
  } = reportData;


  const emojiMap: Record<string, string> = {
    IMPACT_SEVERITY_CRITICAL: '🔴',
    IMPACT_SEVERITY_HIGH: '🟠',
    IMPACT_SEVERITY_MEDIUM: '🟡',
    IMPACT_SEVERITY_LOW: '🔵',
    IMPACT_SEVERITY_INFO: '⚪', // Putih atau abu-abu untuk info, sesuaikan jika ada preferensi lain
    IMPACT_SEVERITY_UNKNOWN: '⚫',
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
    info: '⚪', // Putih atau abu-abu untuk info, sesuaikan jika ada preferensi lain
    unknown: '⚫',
  };
  const escapeMarkdown = (text: string): string => {
    // Escape underscores that are not part of a markdown italic/bold block
    // This is a simplified version, for full markdown escaping, more characters might be needed.
    return text.replace(/_/g, '\\_');
  };
  const escapedFileName = escapeMarkdown(fileName);

  // Membangun pesan teks yang akan dikirim ke Telegram.
  // Menggunakan Markdown untuk pemformatan.
  let message = `\t\t🚨 *New Scan Alert!* 🚨\n\n`;
  if (timestamp){
    message += `*📅* ${new Date(timestamp).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}\n`;
  }
  if (type_tags && type_tags.length > 0) {
    message += `*📄* ${escapedFileName}  | ${type_tags.join(', ')}\n`; 
  }
  else{
    message += `*📄* ${escapedFileName}  \n`;
  }

  if (threatLabel && score !== undefined) {
    message += `*🦠Threat Label:* ${threatLabel} | *⏲ Score:* ${score}\n\n`;
  }else{
    message += `\n*CLEAN✅ - No threats detected!*🛡️ \n\n`;
  }

  message += `---------------------------------------------------\n`;

  if (groupedMitre && Object.keys(groupedMitre).length > 0) {
    message += `*MITRE Signatures:*\n`;
    const severityOrder = ["IMPACT_SEVERITY_CRITICAL", "IMPACT_SEVERITY_HIGH", "IMPACT_SEVERITY_MEDIUM", "IMPACT_SEVERITY_LOW", "IMPACT_SEVERITY_INFO", "UNKNOWN"];

    severityOrder.forEach(severity => {
      if (groupedMitre[severity] && groupedMitre[severity].length > 0) {
        const displaySeverity = severity.replace("IMPACT_SEVERITY_", "").replace(/_/g, " "); 
        const emoji = emojiMap[severity] || '';
        message += `  - ${emoji} *${displaySeverity}:* ${groupedMitre[severity].length} techniques\n`;
        // groupedMitre[severity].forEach(technique => {
        //   const formattedId = technique.id ? (Array.isArray(technique.id) ? `[${technique.id.join(', ')}]` : `[${technique.id}]`) : '';
        //   message += `    • ${formattedId} ${technique.description}\n`;
        // });
      }
    });
  }
  if (groupedSigma && Object.keys(groupedSigma).length > 0) {
    message += `\n*Sigma Rules:*\n`;
    const sigmaLevelOrder = ["critical", "high", "medium", "low", "info", "unknown"];

    sigmaLevelOrder.forEach(level => {
      if (groupedSigma[level] && groupedSigma[level].length > 0) {
        const emoji = emojiMap[level] || '';
        message += `  - ${emoji} *${level.toUpperCase()}:* ${groupedSigma[level].length} rules\n`;
        // groupedSigma[level].forEach(rule => {
        //   message += `    • ${rule.title}\n`;
        // });
      }
    });
  }
  if (yaraRulesetNames && yaraRulesetNames.length > 0) {
    message += `\n*YARA Rules:*\n`;
    message += `  - ${yaraRulesetNames.join(', ')}\n`; 
  } 
//   else {
//     message += `\n*YARA Rules:* No YARA rules detected.\n`; 
//   }
  message += `\n•*MD5:* \`${md5}\` \n`;
  message += `•*SHA1:* \`${sha1}\` \n`;
  message += `•*SHA256:* \`${sha256}\`\n`;

  if (viewReportUrl) {
    message += `\n[🔗 View Full Report for ${fileName}](${viewReportUrl})\n`;
  }

  // URL API Telegram Bot.
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown', 
      }),
    });

    const data = await response.json();

    if (response.ok) {
    //   console.log('sendScanReportToTelegram Success: Telegram message sent successfully:', data);
      return { success: true, message: 'Telegram message sent successfully.' };
    } else {
    //   console.error('sendScanReportToTelegram Error: Failed to send Telegram message:', data);
      return { success: false, message: `Failed to send Telegram message: ${data.description || JSON.stringify(data)}` };
    }
  } catch (error) {
    // console.error('sendScanReportToTelegram Critical Error:', error);
    return { success: false, message: `Terjadi kesalahan internal saat mengirim laporan: ${(error as Error).message}` };
  }
}
