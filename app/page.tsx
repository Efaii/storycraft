"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Santai");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setStory("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyulap catatan. Silakan coba lagi.");
      }

      setStory(data.text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!story) return;
    navigator.clipboard.writeText(story);
    alert("Salinan berhasil dibuat ke clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 md:p-12 font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-4xl flex-grow flex flex-col justify-center my-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            StoryCraft
          </h1>
          <p className="mt-3 text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            ✨ Penyulap Catatan Kegiatan Mentah & Bullet Points menjadi Instagram Caption, Hashtag Relevan, dan Kalimat Hook Menarik dalam Hitungan Detik!
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:border-slate-700/50">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-semibold text-slate-300 mb-2">
                Tempel Catatan Kegiatan Kasar / Bullet Points Acara Anda:
              </label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Contoh catatan kasar:
- Acara: Workshop Desain Grafis Organisasi BEM
- Pembicara: Budi (UI/UX Designer Tokopedia)
- Bahasan: Pentingnya portofolio untuk mahasiswa magang
- Kehadiran: 150 peserta sangat antusias, ada sesi tanya jawab interaktif
- Harapan: Peserta mulai praktek bikin desain portofolio sendiri`}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 resize-y text-sm md:text-base leading-relaxed"
                required
                disabled={loading}
              />
            </div>

            {/* Selector Tone & Action Button */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-2">
              <div className="w-full md:w-auto flex items-center gap-3">
                <label htmlFor="tone" className="text-sm font-medium text-slate-400 shrink-0">
                  Nada Bicara (Tone):
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer"
                >
                  <option value="Santai">😊 Santai (Akrab & Ceria)</option>
                  <option value="Formal">💼 Formal (Profesional & Rapi)</option>
                  <option value="Inspiratif">🌟 Inspiratif (Penuh Motivasi)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full md:w-auto relative inline-flex items-center justify-center px-6 py-3 text-sm md:text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-purple-900/20 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyulap Catatan...
                  </span>
                ) : (
                  "Sulap Catatan ✨"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
            <svg className="h-5 w-5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Output Result Card */}
        {story && (
          <div className="mt-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:border-slate-800 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                ✍️ Hasil Sulap Media Sosial:
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/50"
                title="Salin Seluruh Konten"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Salin Semua
              </button>
            </div>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base">
              {story}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs md:text-sm text-slate-600 border-t border-slate-900/60 pt-6">
        <p>&copy; {new Date().getFullYear()} StoryCraft. Ditenagai oleh Next.js & Gemini AI.</p>
      </footer>
    </div>
  );
}
