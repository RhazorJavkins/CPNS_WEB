import Link from "next/link";
export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="border-b bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold flex items-center gap-2"><span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">CPNS</span> Web</Link>
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">Dashboard →</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Tentang CPNS Web</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          CPNS Web adalah simulasi CAT BKN 1:1 untuk latihan SKD (TWK 30, TIU 35, TKP 45 — total 110 soal, 100 menit, passing grade TWK 65 TIU 80 TKP 166). Dibuat sebagai project personal Fase 1 MVP 2-3 minggu dengan Next.js 16.3 + Supabase + Vercel.
        </p>
        <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 space-y-2 text-sm">
          <p><strong>Bank soal:</strong> 300 soal kurasi (TWK 100, TIU 100, TKP 100) dari FR 2024 & Permenpan RB No.6/2024 + Keputusan No.321/2024.</p>
          <p><strong>Skor:</strong> TWK/TIU benar 5 salah 0, TKP 1-5 (skor tertinggi = jawaban paling profesional).</p>
          <p><strong>Fitur:</strong> Timer 100m, Grid 1-110, Ragu-ragu, Auto-save, Auto-submit, Hasil LULUS/TIDAK per komponen + pembahasan filter.</p>
        </div>
        <p className="text-xs text-zinc-500">Disclaimer: Bukan situs resmi BKN. Hanya untuk latihan. Sumber: cat.bkn.go.id & Permenpan RB.</p>
        <div className="flex gap-2">
          <Link href="/kontak" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Kontak →</Link>
          <Link href="/" className="px-4 py-2 border rounded text-sm bg-white">← Beranda</Link>
        </div>
      </main>
    </div>
  );
}
