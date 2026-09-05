"use client";

export default function TrustSection() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Tanpa Klaim Palsu</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1">Yang kamu dapatkan — yang belum, kami tulis belum.</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Belum ada testimonial terverifikasi — jadi kami tidak buat rating, jumlah pengguna, atau tingkat kelulusan fiktif.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-sm font-bold">✓ Sudah ada</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 900+ soal SKD + 600 SKB</li>
              <li>• Timer CAT 100 menit + grid 1–110</li>
              <li>• Skor PG 65/80/166 & leaderboard</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5">
            <p className="text-sm font-bold">◌ Dalam progres</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• Tryout Akbar mingguan</li>
              <li>• Analisis AI & radar kelemahan</li>
              <li>• Share card & XP streak</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed bg-white/60 dark:bg-zinc-900 p-5">
            <p className="text-sm font-bold">— Belum ada</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Testimonial & rating peserta — akan tampil hanya jika ada feedback beta nyata dengan izin nama/foto. Saat ini tidak ditampilkan.</p>
            <p className="mt-2 text-[11px] text-zinc-400">Tanpa angka pengguna, tanpa klaim lulus %.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
