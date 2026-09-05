import Link from "next/link";
import ProductPreview from "@/components/landing/ProductPreview";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#07152f] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.34),transparent_35%),radial-gradient(circle_at_20%_100%,rgba(79,70,229,0.24),transparent_35%)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Persiapan CPNS 2026</p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Latihan lebih terarah.<br /><span className="text-blue-300">Hadapi ujian</span> dengan percaya diri.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-blue-100/75 sm:text-lg">Simulasi CAT, latihan SKD dan SKB, analisis kelemahan, serta leaderboard dalam satu tempat — supaya kamu tahu apa yang perlu diperbaiki sebelum hari ujian.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#07152f] shadow-lg shadow-black/20 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Mulai Tryout Gratis <span className="ml-2">→</span></Link>
            <Link href="/latihan" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Coba 10 Soal</Link>
          </div>
          <p className="mt-4 text-xs text-blue-100/55">Free 900 soal · Premium 3.000 soal · 110 soal simulasi · 100 menit</p>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}
