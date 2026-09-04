"use client";

const metrics = [
  { value: "900+", label: "soal", context: "Bank TWK • TIU • TKP", icon: "📚" },
  { value: "110", label: "soal / simulasi", context: "SKD: TWK 30 • TIU 35 • TKP 45", icon: "📝" },
  { value: "100", label: "menit", context: "Timer CAT BKN — auto-submit", icon: "⏱️" },
  { value: "3", label: "formasi SKB", context: "Guru • Nakes • Teknis — 200 soal each", icon: "🎯" },
];

export default function TrustMetrics() {
  return (
    <section className="bg-white dark:bg-zinc-900 border-y">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">Kenapa CPNS Web</h2>
            <p className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mt-1">Angka yang ada konteksnya</p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Bukan angka dekoratif — semua terhubung ke flow latihan</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border bg-zinc-50 dark:bg-zinc-950 p-4 md:p-5 hover:bg-white dark:hover:bg-zinc-900 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">{m.icon}</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{m.value}</span>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{m.label}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{m.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
