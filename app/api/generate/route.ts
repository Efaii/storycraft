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

    // Menggunakan model standar gemini-1.5-flash yang cepat dan hemat resource
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Memanggil API Gemini untuk generate konten
    const result = await model.generateContent(prompt);
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
