import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "AIzaSyYOUR_ACTUAL_API_KEY_HERE" || apiKey.trim() === "") {
      return NextResponse.json(
        { error: "API Key Gemini belum dikonfigurasi di file .env.local" },
        { status: 500 }
      );
    }

    // Inisialisasi GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Membaca input prompt dan tone dari request body
    const body = await req.json();
    const { prompt, tone = "Santai" } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Parameter 'prompt' (catatan kegiatan) wajib disertakan dalam request body." },
        { status: 400 }
      );
    }

    // Membangun prompt instruksi sistem yang kaya dan terstruktur untuk StoryCraft
    const systemPrompt = `Kamu adalah "StoryCraft" - Asisten Penulis Konten & Penyulap Catatan Kegiatan organisasi profesional.
Tugasmu adalah mengubah catatan kegiatan mentah, transkrip kasar, atau bullet points acara menjadi materi publikasi media sosial Instagram yang memukau.

Sesuaikan nada bicara (tone) tulisan menjadi: ${tone}.
Karakteristik Nada Bicara:
- **Formal**: Profesional, berwibawa, rapi sesuai kaidah tata bahasa Indonesia yang baik, berkelas, cocok untuk instansi resmi atau publikasi korporat.
- **Santai**: Akrab, ramah, menggunakan bahasa kekinian yang santun, interaktif, disisipkan emoji yang ceria dan hangat.
- **Inspiratif**: Penuh motivasi, berenergi positif, menyentuh hati, menonjolkan dampak sosial/makna mendalam dari kegiatan tersebut untuk menggerakkan audiens.

Format keluaranmu HARUS selalu terbagi menjadi 3 bagian utama menggunakan struktur Markdown berikut secara rapi agar mudah dibaca:

---

### 🪝 Opsi Kalimat Pembuka (Hook)
Berikan 3 pilihan kalimat pembuka alternatif yang sangat menarik perhatian audiens untuk membaca lebih lanjut:
1. **Opsi 1 (Fokus Rasa Ingin Tahu):** [Tulis kalimat pembuka di sini]
2. **Opsi 2 (Fokus Nilai Emosional):** [Tulis kalimat pembuka di sini]
3. **Opsi 3 (Fokus Aksi/Statistik):** [Tulis kalimat pembuka di sini]

---

### 📸 Instagram Caption (Storytelling)
Buatlah sebuah narasi cerita (storytelling) yang memikat berdasarkan catatan acara di bawah. Mulailah cerita dengan alur yang jelas (awal, puncak keseruan, dan akhir/kesimpulan) serta lengkapi dengan Call to Action (CTA) yang natural di akhir paragraf.
[Tulis narasi caption di sini]

---

### 🏷️ Saran Hashtag Populer & Relevan
Berikan kumpulan 8-12 hashtag terbaik (lokal & global) untuk memperluas jangkauan postingan.
[Tulis daftar hashtag di sini]

---

Berikut adalah catatan kegiatan mentah yang harus disulap:
"${prompt}"
`;

    // Daftar model dari yang terbaru/terbaik ke yang paling kompatibel
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash"
    ];

    let result = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Mencoba memproses menggunakan model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(systemPrompt);
        if (result && result.response) {
          console.log(`Sukses menggunakan model: ${modelName}`);
          break; // Berhasil, keluar dari loop
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} gagal atau tidak didukung:`, err.message || err);
        lastError = err;
      }
    }

    if (!result) {
      throw new Error(
        `Semua model Gemini yang dicoba gagal merespons. Error terakhir: ${lastError?.message || "Unknown error"}`
      );
    }

    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      text: responseText,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal pada server saat memproses AI." },
      { status: 500 }
    );
  }
}
