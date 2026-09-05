"use client";
import Link from "next/link";

export default function FeatureShowcase() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Fitur Utama</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">Semua yang kamu butuh untuk lulus — bukan cuma soal.</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Simulasi CAT, pembahasan alasan, radar kelemahan, hingga AI Coach dalam satu alur.</p>
        </div>

        {/* Hierarchy row 1: CAT besar + Pembahasan */}
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <div className="md:col-span-3 rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Simulasi CAT • 110 soal • 100 menit</p>
            <h3 className="font-bold mt-1">Rasakan CAT beneran — bukan quiz biasa</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Grid 1–110 hijau/merah/kuning, ragu-ragu berlapis, timer deadline, auto-save bulk.</p>
            <div className="mt-4 rounded-xl border bg-zinc-950 text-white p-3">
              <div className="flex justify-between text-xs"><span className="text-zinc-400">Sisa waktu</span><span className="font-mono font-bold">00:51:02</span></div>
              <div className="mt-2 grid grid-cols-10 gap-1 text-[10px] text-center font-semibold">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <span key={n} className={`rounded py-1 ${n <= 12 ? "bg-emerald-500" : n === 15 ? "bg-amber-400 text-zinc-900" : "bg-zinc-800 text-zinc-400"}`}>{n}</span>
                ))}
              </div>
            </div>
            <Link href="/tryout" className="inline-block mt-3 text-xs font-semibold text-blue-600">Mulai simulasi →</Link>
          </div>

          <div className="md:col-span-2 rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Pembahasan per Soal</p>
            <h3 className="font-bold mt-1 text-sm">Salah langsung tahu kenapa</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Kunci + alasan TWK/TIU/TKP, bukan cuma A/B/C/D.</p>
            <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3 text-xs">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Jawaban C — Benar</p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">Pancasila sebagai dasar negara tercantum di alinea ke-4 UUD…</p>
            </div>
          </div>
        </div>

        {/* Row 2: Radar + Analisis AI */}
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2 rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Radar Kelemahan</p>
            <h3 className="font-bold mt-1 text-sm">Tahu bocornya di mana</h3>
            <div className="mt-3 space-y-2 text-xs">
              {[
                { k: "TIU Analitis", v: 58 },
                { k: "TWK Nasionalisme", v: 34 },
              ].map((r) => (
                <div key={r.k} className="flex items-center gap-2">
                  <span className="w-32 text-zinc-600 dark:text-zinc-400">{r.k}</span>
                  <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${r.v}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Analisis AI Coach</p>
            <h3 className="font-bold mt-1">Rencana 7 hari — bukan nasehat umum</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">AI baca skor + riwayat, kasih jadwal harian + chat tanya jawab.</p>
            <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs">Hari 1–3: TIU Analitis 4 soal/hari • Hari 4–5: TWK • Hari 6–7: Simulasi penuh</div>
          </div>
        </div>

        {/* Strip: Leaderboard | XP | Share */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-4">
            <p className="text-xs font-semibold text-zinc-500">Leaderboard</p>
            <p className="text-sm font-bold mt-1">Top 100 nasional & Akbar</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Filter nasional/Akbar, cache 15s, tanpa bocor jawaban.</p>
            <Link href="/leaderboard" className="text-xs text-blue-600 font-semibold mt-2 inline-block">Lihat leaderboard →</Link>
          </div>
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-4">
            <p className="text-xs font-semibold text-zinc-500">XP & Badge</p>
            <p className="text-sm font-bold mt-1">Streak & level</p>
            <div className="mt-2 flex items-center gap-2 text-xs"><span className="bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-bold">Lv 7</span><span className="text-zinc-500">1,240 XP • 5 hari streak</span></div>
          </div>
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-4">
            <p className="text-xs font-semibold text-zinc-500">Share Card</p>
            <p className="text-sm font-bold mt-1">Pamer skor tanpa pamer soal</p>
            <div className="mt-2 rounded-lg bg-zinc-900 text-white text-xs p-2 flex justify-between"><span>412/550 LULUS</span><span className="text-zinc-400">#247</span></div>
          </div>
        </div>

        {/* Latihan harian + CTA */}
        <div className="mt-4 rounded-2xl border bg-white dark:bg-zinc-950 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Latihan Harian</p>
            <p className="text-sm font-bold mt-1">10 soal / hari — 3 menit selesai</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Tanpa timer panjang, cocok buat jaga streak.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/tryout" className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-semibold">Mulai Tryout Gratis</Link>
            <Link href="/leaderboard" className="rounded-full border bg-white dark:bg-zinc-900 px-5 py-2 text-sm font-semibold">Leaderboard</Link>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 mt-3">Contoh skor & ranking di atas adalah dummy preview — bukan data peserta nyata.</p>
      </div>
    </section>
  );
}
