"use client";
import { useState } from "react";
import { Timer } from "@/components/tryout/Timer";
import { NumberGrid } from "@/components/tryout/NumberGrid";
import { QuestionCard } from "@/components/tryout/QuestionCard";
import Link from "next/link";

// Mock 110 soal dummy untuk preview Batch 1
const MOCK = Array.from({ length: 110 }, (_, i) => ({
  kategori: i < 30 ? "TWK" : i < 65 ? "TIU" : "TKP",
  pertanyaan: `Contoh soal ${i + 1} [${i < 30 ? "TWK" : i < 65 ? "TIU" : "TKP"}] — Ini preview dummy Batch 1. Batch 2 akan load soal asli dari Supabase (300 soal). Soal ini hanya untuk cek layout Grid 1-110 & QuestionCard.`,
  opsi: [
    { key: "A", text: "Opsi A — jawaban pertama (dummy)" },
    { key: "B", text: "Opsi B — jawaban kedua (dummy)" },
    { key: "C", text: "Opsi C — jawaban ketiga (dummy)" },
    { key: "D", text: "Opsi D — jawaban keempat (dummy)" },
    { key: "E", text: "Opsi E — jawaban kelima (dummy)" },
  ],
}));

export default function KerjakanPage({ params }: { params: { id: string } }) {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  const gridItems = MOCK.map((_, idx) => ({
    index: idx,
    answered: !!answers[idx],
    flagged: !!flagged[idx],
    current: idx === cur,
  }));

  const q = MOCK[cur];
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
      {/* Header CAT */}
      <header className="h-14 bg-white dark:bg-zinc-900 border-b flex items-center px-3 md:px-4 gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="text-xs border rounded px-2 py-1 hover:bg-zinc-50">Keluar</Link>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-xs text-zinc-500 hidden sm:inline">Sisa Waktu</span>
          <Timer seconds={6000} />
        </div>
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">Soal {cur + 1}/110</span>
        <button className="text-xs bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1.5 font-medium">Selesai Ujian</button>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[260px_1fr_220px] gap-3 p-3">
        {/* Kiri: Grid */}
        <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 h-fit lg:sticky lg:top-[68px]">
          <p className="text-xs font-semibold mb-2">Daftar Soal — 110</p>
          <NumberGrid items={gridItems} onSelect={setCur} />
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border rounded"></span> Belum</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Sudah</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span> Ragu</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded"></span> Aktif</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Batch 1: dummy 110 soal. Batch 2: soal asli acak dari DB.</p>
        </div>

        {/* Tengah: Soal */}
        <div className="space-y-3">
          <QuestionCard
            number={cur + 1}
            kategori={q.kategori}
            pertanyaan={q.pertanyaan}
            opsi={q.opsi}
            selected={answers[cur]}
            onSelect={(k) => setAnswers((a) => ({ ...a, [cur]: k }))}
          />
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setCur((c) => Math.max(0, c - 1))} disabled={cur === 0} className="px-4 py-2 border rounded text-sm bg-white disabled:opacity-50">← Sebelumnya</button>
            <div className="flex gap-2">
              <button
                onClick={() => setFlagged((f) => ({ ...f, [cur]: !f[cur] }))}
                className={`px-3 py-2 rounded text-sm border ${flagged[cur] ? "bg-yellow-400 border-yellow-500" : "bg-white"}`}
              >
                {flagged[cur] ? "★ Ragu-ragu" : "☆ Tandai Ragu"}
              </button>
              <button onClick={() => setAnswers((a) => { const n = { ...a }; delete n[cur]; return n; })} className="px-3 py-2 rounded text-sm border bg-white">Hapus Jawaban</button>
            </div>
            <button onClick={() => setCur((c) => Math.min(109, c + 1))} disabled={cur === 109} className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50">Selanjutnya →</button>
          </div>
        </div>

        {/* Kanan: Info */}
        <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 h-fit lg:sticky lg:top-[68px] space-y-3">
          <p className="text-xs font-semibold">Info Ujian</p>
          <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
            <p>Terjawab: {Object.keys(answers).length}/110</p>
            <p>Ragu-ragu: {Object.values(flagged).filter(Boolean).length}</p>
            <p>Belum: {110 - Object.keys(answers).length}</p>
          </div>
          <div className="pt-3 border-t">
            <p className="text-xs font-medium">Passing Grade</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">TWK 65 • TIU 80 • TKP 166</p>
            <p className="text-xs text-zinc-400 mt-1">Harus lulus 3 komponen.</p>
          </div>
          <div className="pt-3 border-t">
            <p className="text-xs text-zinc-500">Batch 1 preview — belum simpan ke DB. Refresh akan reset.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
