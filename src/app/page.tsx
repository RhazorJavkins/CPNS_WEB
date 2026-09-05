import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LandingAkbarWrapper from "@/components/akbar/LandingAkbarWrapper";
import HeroSection from "@/components/landing/HeroSection";
import TrustMetrics from "@/components/landing/TrustMetrics";
import ProductWalkthrough from "@/components/landing/ProductWalkthrough";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import SkbSection from "@/components/landing/SkbSection";
import ResultPreview from "@/components/landing/ResultPreview";
import PricingFaq from "@/components/landing/PricingFaq";
import TrustSection from "@/components/landing/TrustSection";

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
            <Link href="/leaderboard" className="hidden sm:inline-flex text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2 py-1">Leaderboard</Link>
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Masuk</Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-blue-700">Daftar Gratis</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <HeroSection />
      <TrustMetrics />
      {/* Tryout Akbar — dedicated section Opsi B */}
      <section className="bg-zinc-50 dark:bg-zinc-900 border-y">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">Event Mingguan</p>
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white">Tryout Akbar</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">110 soal • 100 menit • Window Minggu 19.00–21.00 WIB</p>
            </div>
            <Link href="/leaderboard?akbar=true" className="text-xs border bg-white dark:bg-zinc-800 hover:bg-zinc-50 rounded-full px-3 py-1.5">Lihat Leaderboard Akbar →</Link>
          </div>
          <LandingAkbarWrapper />
        </div>
      </section>
      <ProductWalkthrough />
      <FeatureShowcase />
      <SkbSection />
      <ResultPreview />
      <PricingFaq />
      <TrustSection />
      <section className="flex-1 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle className="text-base">Simulasi CAT realistis</CardTitle><CardDescription>Timer, navigasi soal, dan hasil otomatis untuk melatih ritme sebelum hari ujian.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">Analisis yang bisa ditindaklanjuti</CardTitle><CardDescription>Lihat komponen yang perlu diperbaiki, bukan hanya angka skor total.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">SKD sampai SKB</CardTitle><CardDescription>Latihan SKD dan tiga formasi SKB dalam satu akun.</CardDescription></CardHeader></Card>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <span><strong className="text-zinc-900 dark:text-white">900+</strong> soal</span><span><strong className="text-zinc-900 dark:text-white">110</strong> soal simulasi</span><span><strong className="text-zinc-900 dark:text-white">100 menit</strong> timer CAT</span><span><strong className="text-zinc-900 dark:text-white">3</strong> formasi SKB</span>
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
