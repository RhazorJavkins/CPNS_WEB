"use client";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  { q: "Apakah gratis?", a: "Ya. Free dapat 3 tryout/hari, 9 latihan/hari, tanpa kartu kredit." },
  { q: "Apakah perlu kartu kredit?", a: "Tidak. Daftar pakai email saja." },
  { q: "Berapa soal dan durasi?", a: "SKD 110 soal (TWK 30, TIU 35, TKP 45) — 100 menit. SKB 200 soal per formasi." },
  { q: "Apa perbedaan SKD dan SKB?", a: "SKD seleksi dasar (TWK/TIU/TKP). SKB seleksi bidang sesuai formasi Guru/Nakes/Teknis." },
  { q: "Apakah ada Analisis AI?", a: "Ada. AI rangkum kelemahan + buat rencana 7 hari dari riwayat tryout kamu." },
  { q: "Bagaimana iklan reward bekerja?", a: "Free lihat iklan setelah submit untuk buka pembahasan — Premium tanpa iklan." },
  { q: "Apakah ada leaderboard?", a: "Ada. Top 100 nasional & leaderboard khusus Tryout Akbar mingguan." },
  { q: "Apakah CPNS Web situs resmi BKN?", a: "Bukan. Ini platform latihan mandiri — bukan situs resmi BKN/instansi pemerintah." },
];

export default function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="harga" className="bg-white dark:bg-zinc-950 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Pricing preview */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Paket</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">Mulai gratis, upgrade kalau butuh</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Harga sama dengan halaman /pricing — pembayaran uji coba, aktivasi manual via admin sementara.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          <div className="rounded-2xl border bg-zinc-50 dark:bg-zinc-900 p-6">
            <h3 className="font-bold">Free</h3>
            <p className="text-2xl font-black mt-1">Rp 0<span className="text-sm font-medium text-zinc-600">/bulan</span></p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 900 bank soal SKD+SKB</li>
              <li>• 3 tryout / hari</li>
              <li>• 9 latihan / hari</li>
              <li>• Pembahasan setelah iklan</li>
            </ul>
            <Link href="/dashboard" className="mt-5 inline-flex w-full justify-center rounded-full border bg-white dark:bg-zinc-800 py-2.5 text-sm font-semibold min-h-11">Mulai Gratis</Link>
          </div>
          <div className="rounded-2xl border-2 border-blue-600 bg-white dark:bg-zinc-900 p-6 relative">
            <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">POPULER</span>
            <h3 className="font-bold">Premium</h3>
            <p className="text-2xl font-black mt-1">Rp 49k<span className="text-sm font-medium text-zinc-600">/bulan</span></p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 3.000 bank soal SKD+SKB</li>
              <li>• Unlimited tryout & latihan</li>
              <li>• Tanpa iklan</li>
              <li>• Analisis AI prioritas</li>
            </ul>
            <Link href="/pricing" className="mt-5 inline-flex w-full justify-center rounded-full bg-blue-600 text-white py-2.5 text-sm font-semibold min-h-11">Lihat Paket Premium →</Link>
            <p className="text-[11px] text-zinc-500 mt-2 text-center">Pembayaran uji coba — hubungi admin untuk aktivasi</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="font-bold text-center">Pertanyaan umum</h3>
          <div className="mt-6 divide-y border rounded-2xl bg-zinc-50 dark:bg-zinc-900">
            {faqs.map((f, i) => (
              <div key={f.q} className="px-4">
                <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center py-3 text-left text-sm font-medium min-h-11">
                  <span>{f.q}</span><span className="text-zinc-400 ml-3 shrink-0" aria-hidden="true">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p className="pb-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
