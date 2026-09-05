"use client";
import Link from "next/link";

export default function TrustSection() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Kepercayaan</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">Tanpa testimoni palsu — yang ada kami tampilkan jujur.</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Belum ada feedback beta terverifikasi, jadi kami tidak mengarang rating, jumlah pengguna, atau “tingkat kelulusan”.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Transparan</p>
            <h3 className="font-bold mt-1 text-sm">Soal & skor apa adanya</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">900+ SKD + 600 SKB, PG 65/80/166, timer 100 menit — semua sesuai format CAT, bukan soal resmi BKN.</p>
          </div>
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Terukur</p>
            <h3 className="font-bold mt-1 text-sm">Leaderboard & analisis nyata</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">Ranking nasional & Akbar dari skor tryout aktual + radar kelemahan — tanpa bocorkan kunci jawaban.</p>
          </div>
          <div className="rounded-2xl border border-dashed bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Testimoni</p>
            <h3 className="font-bold mt-1 text-sm">Akan hadir setelah beta</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">Testimoni hanya tampil jika ada feedback nyata dengan izin nama/foto. Saat ini belum ditampilkan.</p>
            <Link href="/tryout" className="inline-block mt-3 text-xs font-semibold text-blue-600">Ikut beta & beri feedback →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
