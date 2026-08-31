export default function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] pb-8 sm:pb-10">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-blue-500/20 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/95 text-zinc-900 shadow-2xl shadow-blue-950/40 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 text-xs">
          <div className="flex items-center gap-2 font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Simulasi CAT SKD</div>
          <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">Soal 24 / 110</span>
        </div>
        <div className="grid gap-4 p-4 sm:p-5">
          <div className="flex items-center justify-between rounded-xl bg-zinc-950 px-4 py-3 text-white">
            <div><p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">Sisa waktu</p><p className="mt-1 font-mono text-2xl font-bold tracking-tight">00:47:32</p></div>
            <div className="text-right"><p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">Progress</p><p className="mt-1 text-sm font-semibold">22%</p></div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">TIU · Penalaran Analitis</p>
            <p className="mt-2 text-base font-semibold leading-relaxed">Jika semua peserta rajin berlatih, maka peluang lulus akan ...</p>
            <div className="mt-3 grid gap-2 text-sm">
              {["A. meningkat secara konsisten", "B. tetap sama", "C. tidak dapat diprediksi"].map((option, index) => <div key={option} className={`rounded-lg border px-3 py-2.5 ${index === 0 ? "border-blue-500 bg-blue-50 text-blue-900" : "border-zinc-200 bg-white text-zinc-600"}`}><span className="mr-2 font-semibold">{option.slice(0, 1)}</span>{option.slice(3)}</div>)}
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1.5 rounded-xl bg-zinc-100 p-3 text-center text-[10px] font-semibold">
            {Array.from({ length: 16 }, (_, i) => <span key={i} className={`rounded-md py-1.5 ${i === 0 ? "bg-blue-600 text-white" : i < 8 ? "bg-emerald-100 text-emerald-700" : "bg-white text-zinc-500 ring-1 ring-zinc-200"}`}>{i + 24}</span>)}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 -left-2 w-[180px] rounded-2xl border border-emerald-100 bg-white p-3 text-zinc-900 shadow-xl shadow-blue-950/25 sm:-left-8" aria-label="Contoh hasil simulasi">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Contoh hasil simulasi</p>
        <div className="mt-1 flex items-end justify-between"><span className="text-2xl font-black tracking-tight">412<span className="text-xs font-medium text-zinc-400">/550</span></span><span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">LULUS</span></div>
      </div>
      <div className="absolute -right-2 top-10 rounded-2xl border border-amber-100 bg-white p-3 text-zinc-900 shadow-xl shadow-blue-950/25 sm:-right-8" aria-label="Contoh peringkat simulasi">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Peringkat</p><p className="mt-1 text-xl font-black text-indigo-700">#247</p><p className="text-[10px] text-zinc-500">Nasional · contoh</p>
      </div>
    </div>
  );
}
