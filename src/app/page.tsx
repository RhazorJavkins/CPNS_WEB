import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LandingAkbarWrapper from "@/components/akbar/LandingAkbarWrapper";

function FAQSchema() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Berapa passing grade SKD CPNS 2026?", acceptedAnswer: { "@type": "Answer", text: "TWK 65, TIU 80, TKP 166, total 311. SKB 40% bobot akhir." } },
      { "@type": "Question", name: "Berapa soal dan waktu SKD?", acceptedAnswer: { "@type": "Answer", text: "110 soal 100 menit: TWK 30, TIU 35, TKP 45." } },
      { "@type": "Question", name: "Apakah CPNS Web gratis?", acceptedAnswer: { "@type": "Answer", text: "Gratis 1 tryout/hari + 3 latihan/hari, bisa nonton iklan 15 detik untuk tambah kuota." } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />;
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">CPNS</span>
            <span>Web</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Masuk</Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-blue-700">Daftar Gratis</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <LandingAkbarWrapper />
      <section className="flex-1 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Simulasi CAT BKN 2024 • 110 Soal • 100 Menit
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              Latihan CPNS <span className="text-blue-600">Mirip Asli</span> — Skor Langsung, Pembahasan Lengkap
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Bank soal 300+ TWK TIU TKP kurasi, timer 100 menit persis CAT BKN, passing grade real <span className="font-semibold text-zinc-900 dark:text-white">TWK 65 • TIU 80 • TKP 166</span>. Gratis 1x tryout/hari, upgrade premium untuk AI Coach.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="inline-flex items-center justify-center h-12 px-8 text-base bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Mulai Tryout Gratis →</Link>
              <Link href="/login" className="inline-flex items-center justify-center h-12 px-6 border rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">Sudah punya akun? Masuk</Link>
            </div>
            <p className="mt-3 text-xs text-zinc-500">Tanpa kartu kredit • Hasil langsung • Bisa di HP</p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-sm">⏱️</span>
                  Simulasi CAT 1:1
                </CardTitle>
                <CardDescription>110 soal acak, grid 1-110 warna-warni, tombol ragu-ragu, auto-submit. Mirip cat.bkn.go.id 95%</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center text-sm">📚</span>
                  Bank Soal 300+
                </CardTitle>
                <CardDescription>TWK 100 • TIU 100 • TKP 100. Kurasi dari FR 2024, kisi-kisi Permenpan RB No.6/2024 + pembahasan HOTS</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center text-sm">🎯</span>
                  Passing Grade Real
                </CardTitle>
                <CardDescription>Skor TWK 65, TIU 80, TKP 166. Status LULUS/TIDAK per komponen + grafik radar kelemahan</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-white">300+</span> soal kurasi
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-white">100 menit</span> timer CAT
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-white">550</span> skor maksimal
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-white">Gratis</span> selamanya (1 tryout/hari)
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zinc-50 dark:bg-zinc-950 border-t">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="font-semibold text-zinc-900 dark:text-white">Cara kerja — 3 langkah lulus SKD</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <div>
                <p className="font-medium text-sm">Daftar & Pilih Tryout</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Pilih Tryout #1 (110 soal) atau Latihan 10 soal. Soal diacak tiap sesi.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <div>
                <p className="font-medium text-sm">Kerjakan 100 Menit</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Grid 1-110, tandai ragu-ragu, auto-save tiap 10 detik. Refresh tidak hilang.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <div>
                <p className="font-medium text-sm">Lihat Hasil & Pembahasan</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Skor TWK/TIU/TKP + LULUS/TIDAK + pembahasan per soal + rencana 7 hari (AI).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FAQSchema />
      <footer className="bg-white dark:bg-zinc-900 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong>Disclaimer:</strong> Website ini bukan situs resmi BKN. Simulasi hanya untuk latihan. Sumber kisi-kisi: Permenpan RB No.6/2024, Keputusan Menpan RB No.321/2024, dan Field Report CPNS 2023/2024. Passing grade: TWK 65, TIU 80, TKP 166. Waktu: 100 menit (110 soal).
          </p>
          <p className="text-xs text-zinc-400 mt-2">© 2026 CPNS Web • Dibuat untuk pejuang ASN • <Link href="https://github.com/RhazorJavkins/CPNS_WEB" className="underline">GitHub</Link> • <Link href="https://cpns-web-coral.vercel.app" className="underline">Vercel</Link> • Supabase ap-northeast-2</p>
        </div>
      </footer>
    </div>
  );
}
