"use client";
import Link from "next/link";

const skb = [
  { title: "Guru", soal: "200 soal", tags: ["Pedagogik", "Profesional"], desc: "Simulasi SKB Guru — cakupan materi pedagogik & bidang." },
  { title: "Tenaga Kesehatan", soal: "200 soal", tags: ["Keperawatan", "Farmasi"], desc: "Simulasi SKB Nakes — 2 rumpun utama." },
  { title: "Teknis", soal: "200 soal", tags: ["Hukum", "TIK"], desc: "Simulasi SKB Teknis — hukum & teknologi informasi." },
];

export default function SkbSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Tahap Lanjutan</p>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">Siap lanjut ke tahap SKB?</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">600 soal SKB terbagi 3 formasi — lanjut setelah SKD, tanpa klaim mirip soal resmi.</p>
          </div>
          <Link href="/tryout?kategori=skb" className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-semibold shrink-0">Lihat Latihan SKB →</Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {skb.map((s) => (
            <div key={s.title} className="rounded-2xl border bg-zinc-50 dark:bg-zinc-900 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{s.title}</h3>
                <span className="text-xs font-semibold bg-white dark:bg-zinc-800 border rounded-full px-2 py-1">{s.soal}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">{s.desc}</p>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {s.tags.map((t) => (
                  <span key={t} className="text-[11px] bg-white dark:bg-zinc-800 border rounded-full px-2 py-0.5">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-zinc-400 mt-3">Bank soal latihan SKB internal — bukan soal resmi instansi.</p>
      </div>
    </section>
  );
}
