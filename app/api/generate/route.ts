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
    
    // Membaca input prompt dari request body
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Parameter 'prompt' wajib disertakan dalam request body." },
        { status: 400 }
      );
    }

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
        result = await model.generateContent(prompt);
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
