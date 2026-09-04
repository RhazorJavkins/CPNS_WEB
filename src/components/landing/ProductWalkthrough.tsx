"use client";

const steps = [
  {
    n: "01",
    title: "Kerjakan CAT",
    desc: "110 soal TWK/TIU/TKP, timer 100 menit, grid 1–110, ragu-ragu & hapus jawaban. Auto-save tiap 1.2s.",
    visual: (
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Simulasi CAT</span>
          <span className="bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 font-medium">Soal 24/110</span>
        </div>
        <div className="mt-3 rounded-lg bg-zinc-950 text-white px-3 py-2 flex justify-between text-xs"><span className="text-zinc-400">Sisa waktu</span><span className="font-mono font-bold">00:47:32</span></div>
        <div className="mt-3 text-sm font-medium">Jika semua peserta rajin berlatih...</div>
        <div className="mt-2 grid grid-cols-8 gap-1 text-[10px] text-center font-semibold">
          {Array.from({ length: 16 }, (_, i) => 24 + i).map((no) => (
            <span key={no} className={`rounded py-1 ${no < 30 ? "bg-emerald-100 text-emerald-700" : no === 24 ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-500"}`}>{no}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Dapatkan skor otomatis",
    desc: "Skor TWK/TIU/TKP langsung keluar + status LULUS/TIDAK per komponen (PG 65/80/166).",
    visual: (
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500">Contoh hasil simulasi</p>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-3xl font-black">412<span className="text-xs font-medium text-zinc-400">/550</span></span>
          <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-1 text-xs font-bold">LULUS</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-2 text-center"><p className="text-zinc-500">TWK</p><p className="font-bold text-sm">78</p><p className="text-emerald-600 text-[10px]">PG 65 ✓</p></div>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-2 text-center"><p className="text-zinc-500">TIU</p><p className="font-bold text-sm">92</p><p className="text-emerald-600 text-[10px]">PG 80 ✓</p></div>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-2 text-center"><p className="text-zinc-500">TKP</p><p className="font-bold text-sm">242</p><p className="text-emerald-600 text-[10px]">PG 166 ✓</p></div>
        </div>
      </div>
    ),
  },
  {
    n: "03",
    title: "Lihat kelemahan",
    desc: "Radar kelemahan + progress 7 hari — tahu sub-materi TWK/TIU/TKP yang paling bocor.",
    visual: (
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4">
        <p className="text-xs font-semibold">Kelemahan Utama</p>
        <div className="mt-3 space-y-2 text-xs">
          {[
            { label: "TWK Pancasila", pct: 72 },
            { label: "TIU Analitis", pct: 48 },
            { label: "TKP Pelayanan", pct: 35 },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="w-28 truncate text-zinc-600 dark:text-zinc-400">{r.label}</span>
              <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${r.pct}%` }} /></div>
              <span className="w-8 text-right font-medium">{r.pct}%</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 mt-2">Contoh hasil simulasi • bukan data real user</p>
      </div>
    ),
  },
  {
    n: "04",
    title: "Perbaiki dengan AI Coach",
    desc: "Rencana 7 hari + chat tutor — latihan terarah, bukan ngulang soal random.",
    visual: (
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4">
        <p className="text-xs font-semibold flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-600 rounded-full" /> AI Coach</p>
        <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs leading-relaxed">Fokus 3 hari ke TIU Analitis (4 soal/hari), 2 hari TWK Pancasila, 2 hari simulasi penuh. Mau mulai dari TIU dulu?</div>
        <div className="mt-2 flex gap-1.5 text-[10px]">
          <span className="rounded-full bg-zinc-900 text-white px-2 py-1">Mulai TIU</span>
          <span className="rounded-full border bg-white px-2 py-1">Lihat jadwal</span>
        </div>
      </div>
    ),
  },
];

export default function ProductWalkthrough() {
  return (
    <section className="bg-white dark:bg-zinc-950 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">Alur Produk</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">CAT → Skor → Kelemahan → AI Coach</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Empat langkah dari mengerjakan sampai tahu apa yang harus diperbaiki — tanpa ngulang soal yang sudah bisa.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <div key={s.n} className={`relative ${idx % 2 === 1 ? "lg:mt-6" : ""}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{s.n}</span>
                <span className="text-xs text-zinc-400">Langkah {s.n}</span>
              </div>
              <h3 className="font-semibold text-sm">{s.title}</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{s.desc}</p>
              <div className="mt-4">{s.visual}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 mt-6">Semua angka & chat di atas adalah contoh hasil simulasi — bukan data peserta nyata.</p>
      </div>
    </section>
  );
}
