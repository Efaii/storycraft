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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-between p-6 md:p-12 font-sans text-slate-800">
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center my-8">
        
        {/* Header */}
        <div className="text-center mb-10 w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              StoryCraft ✨
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Ubah catatan berantakan jadi caption memukau dalam hitungan detik.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="w-full bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-6 md:p-8 shadow-xl mb-8 transition-all hover:shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-bold text-slate-700 mb-2">
                📝 Catatan Kegiatan / Bullet Points:
              </label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Acara BEM berjalan lancar, dihadiri 100 orang. Pembicara keren bahas UI/UX..."
                className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm text-base resize-y"
                required
                disabled={loading}
              />
            </div>

            {/* Area Kontrol: Dropdown & Button sejajar */}
            <div className="flex flex-col md:flex-row gap-4 items-end justify-between pt-2">
              <div className="w-full md:w-1/3">
                <label htmlFor="tone" className="block text-sm font-bold text-slate-700 mb-2">
                  🎨 Tone / Gaya Bahasa:
                </label>
                <div className="relative">
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    <option value="Santai">😊 Santai</option>
                    <option value="Formal">💼 Formal</option>
                    <option value="Inspiratif">🌟 Inspiratif</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyulap...
                    </>
                  ) : (
                    "Buat Caption ✨"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-8 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Output Result Card */}
        {story && (
          <div className="w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 md:p-10 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                🎉 Hasil Sulap StoryCraft
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors border border-indigo-200 shadow-sm"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Salin
              </button>
            </div>
            
            <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap text-base md:text-lg font-medium selection:bg-indigo-200 selection:text-indigo-900">
              {story}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-sm text-slate-500 font-medium">
        <p>&copy; {new Date().getFullYear()} StoryCraft. Dibangun untuk #JuaraVibeCoding.</p>
      </footer>
    </div>
  );
}
