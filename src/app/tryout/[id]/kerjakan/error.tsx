"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 bg-zinc-50 dark:bg-zinc-950">
      <p className="text-sm font-medium">Terjadi kesalahan — Supabase lambat/down?</p>
      <p className="text-xs text-zinc-500 text-center max-w-md">{error.message || "Gagal memuat data. Cek koneksi atau coba lagi."}</p>
      <div className="flex gap-2">
        <button onClick={() => reset()} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Coba Lagi</button>
        <a href="/dashboard" className="px-4 py-2 border rounded text-sm bg-white">← Dashboard</a>
      </div>
      <p className="text-xs text-zinc-400">Jika terus error, cek Vercel logs atau Supabase ap-northeast-2 status.</p>
    </div>
  );
}
