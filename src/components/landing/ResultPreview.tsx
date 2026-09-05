"use client";
import Link from "next/link";

export default function ResultPreview() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Outcome</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">Selesai tryout — langsung tahu hasilnya</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Preview hasil: skor, passing grade, ranking, dan saran belajar — semua dummy.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-5 mt-8">
          {/* Result card besar */}
          <div className="md:col-span-3 rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500">Contoh hasil simulasi</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-3xl font-black">428<span className="text-sm font-medium text-zinc-400">/550</span></p>
                <p className="text-xs text-zinc-500">Total • 110 soal</p>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">LULUS PG ✓</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {[
                { k: "TWK", v: 82, pg: 65 },
                { k: "TIU", v: 96, pg: 80 },
                { k: "TKP", v: 250, pg: 166 },
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border p-3 text-center">
                  <p className="text-zinc-500">{s.k}</p>
                  <p className="font-bold text-base">{s.v}</p>
                  <p className="text-[10px] text-emerald-600">PG {s.pg} ✓</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 text-xs">
              <p className="font-semibold">Rekomendasi belajar</p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">Fokus TIU Analitis 2 hari, TWK Nasionalisme 1 hari, lalu simulasi ulang.</p>
            </div>
          </div>

          {/* Ranking + radar mini */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5">
              <p className="text-xs font-semibold text-zinc-500">Ranking Nasional — contoh</p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { rk: 1, nm: "—", sc: 472, me: false },
                  { rk: 2, nm: "—", sc: 451, me: false },
                  { rk: 247, nm: "Kamu (contoh)", sc: 428, me: true },
                ].map((r) => (
                  <div key={r.rk} className={`flex justify-between rounded-lg px-3 py-2 ${r.me ? "bg-blue-600 text-white font-semibold" : "bg-zinc-50 dark:bg-zinc-900 border"}`}>
                    <span>#{r.rk} {r.nm}</span><span>{r.sc}</span>
                  </div>
                ))}
              </div>
              <Link href="/leaderboard" className="text-xs text-blue-600 font-semibold mt-3 inline-block">Lihat leaderboard →</Link>
            </div>
            <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5">
              <p className="text-xs font-semibold text-zinc-500">Radar kelemahan mini</p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { k: "TWK Pancasila", v: 68 },
                  { k: "TIU Analitis", v: 52 },
                ].map((r) => (
                  <div key={r.k} className="flex items-center gap-2">
                    <span className="w-28 text-zinc-600 dark:text-zinc-400">{r.k}</span>
                    <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${r.v}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link href="/tryout" className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-semibold">Coba Tryout Gratis</Link>
          <Link href="/leaderboard" className="rounded-full border bg-white dark:bg-zinc-900 px-5 py-2 text-sm font-semibold">Leaderboard</Link>
        </div>
        <p className="text-[10px] text-zinc-400 mt-3">Semua angka & ranking adalah contoh hasil simulasi — bukan data peserta nyata.</p>
      </div>
    </section>
  );
}
