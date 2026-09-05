import Link from "next/link";
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
      { "@type": "Question", name: "Apakah CPNS Web gratis?", acceptedAnswer: { "@type": "Answer", text: "Gratis 3 tryout/hari dan 9 latihan/hari, tanpa kartu kredit." } },
      { "@type": "Question", name: "Apakah perlu kartu kredit?", acceptedAnswer: { "@type": "Answer", text: "Tidak. Daftar pakai email saja." } },
      { "@type": "Question", name: "Berapa soal dan waktu SKD?", acceptedAnswer: { "@type": "Answer", text: "110 soal 100 menit: TWK 30, TIU 35, TKP 45." } },
      { "@type": "Question", name: "Apa perbedaan SKD dan SKB?", acceptedAnswer: { "@type": "Answer", text: "SKD seleksi dasar TWK/TIU/TKP. SKB seleksi bidang sesuai formasi Guru/Nakes/Teknis." } },
      { "@type": "Question", name: "Apakah ada Analisis AI?", acceptedAnswer: { "@type": "Answer", text: "Ada. AI rangkum kelemahan dan buat rencana 7 hari dari riwayat tryout kamu." } },
      { "@type": "Question", name: "Bagaimana iklan reward bekerja?", acceptedAnswer: { "@type": "Answer", text: "Free lihat iklan setelah submit untuk buka pembahasan. Premium tanpa iklan." } },
      { "@type": "Question", name: "Apakah ada leaderboard?", acceptedAnswer: { "@type": "Answer", text: "Ada. Top 100 nasional dan leaderboard khusus Tryout Akbar mingguan." } },
      { "@type": "Question", name: "Apakah CPNS Web situs resmi BKN?", acceptedAnswer: { "@type": "Answer", text: "Bukan. Ini platform latihan mandiri, bukan situs resmi BKN/instansi pemerintah." } },
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
