import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function TryoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: pkg } = await supabase.from("tryout_packages").select("id, judul, deskripsi, jumlah_soal, durasi_menit, is_active, is_tryout_akbar, akbar_start, akbar_end").eq("id", id).single();
  if (!pkg) notFound();
  const { count: qCount } = await supabase.from("questions").select("id", { count: "exact", head: true });
  // cek attempt belum selesai
  const { data: ongoing } = await supabase.from("attempts").select("id").eq("user_id", user.id).eq("tryout_id", id).is("waktu_selesai", null).limit(1).maybeSingle();
  // 17.3 window check untuk Tryout Akbar
  const isAkbar = (pkg as any).is_tryout_akbar === true;
  const akbarStart = (pkg as any).akbar_start ? new Date((pkg as any).akbar_start).getTime() : null;
  const akbarEnd = (pkg as any).akbar_end ? new Date((pkg as any).akbar_end).getTime() : null;
  const now = Date.now();
  const isBeforeWindow = isAkbar && akbarStart && now < akbarStart;
  const isAfterWindow = isAkbar && akbarEnd && now > akbarEnd;
  const isLiveWindow = isAkbar && akbarStart && akbarEnd && now >= akbarStart && now <= akbarEnd;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">← Dashboard</Link>
          <span className="text-xs text-zinc-500">{user.email}</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        {isAkbar && <div className={`mb-4 rounded-lg border p-3 text-sm ${isLiveWindow ? "bg-green-50 border-green-300 text-green-800" : isBeforeWindow ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-zinc-100 border-zinc-300 text-zinc-600"}`}>{isLiveWindow ? "🔴 LIVE — Window Akbar aktif (Minggu 19.00-21.00 WIB). Kerjakan sekarang!" : isBeforeWindow ? `🔜 Tryout Akbar — window dibuka ${new Date((pkg as any).akbar_start).toLocaleString("id-ID")} WIB` : `🔒 Window Akbar sudah berakhir ${akbarEnd ? new Date((pkg as any).akbar_end).toLocaleString("id-ID") : ""} — leaderboard freeze`}</div>}
        <h1 className="text-xl font-bold flex items-center gap-2">{pkg.judul} {isAkbar && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Akbar</span>}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{pkg.deskripsi}</p>
        <div className="flex gap-3 mt-3 text-xs">
          <span className="px-2 py-1 bg-white border rounded">{pkg.jumlah_soal} soal</span>
          <span className="px-2 py-1 bg-white border rounded">{pkg.durasi_menit} menit</span>
          <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded">Bank: {qCount} soal</span>
        </div>
        {ongoing ? (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium">Kamu punya pengerjaan belum selesai</p>
            <Link href={`/tryout/${id}/kerjakan?attempt=${ongoing.id}`} className="inline-flex mt-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded px-4 py-2 text-sm">Lanjutkan Mengerjakan →</Link>
          </div>
        ) : null}
        <div className="mt-6 bg-white dark:bg-zinc-900 border rounded-lg p-6">
          <h2 className="font-semibold text-sm">Petunjuk CAT BKN</h2>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 space-y-1 list-disc pl-4">
            <li>110 soal: TWK 30 (PG 65), TIU 35 (PG 80), TKP 45 (PG 166) — harus lulus semua</li>
            <li>Waktu 100 menit, auto-submit saat habis</li>
            <li>Grid 1-110: putih belum, hijau sudah, kuning ragu, biru aktif</li>
            <li>Bisa tandai Ragu-ragu & Hapus Jawaban</li>
          </ul>
          {isBeforeWindow ? (
            <div className="mt-6 p-3 bg-zinc-100 border rounded text-sm text-zinc-600 text-center">Belum waktunya — tombol Mulai aktif saat window 19.00-21.00 WIB</div>
          ) : isAfterWindow ? (
            <div className="mt-6 p-3 bg-zinc-100 border rounded text-sm text-zinc-600 text-center">Window berakhir — lihat leaderboard Akbar <Link href="/leaderboard?akbar=true" className="text-blue-600 underline">di sini</Link></div>
          ) : (
          <Link href={`/tryout/${id}/kerjakan`} className="inline-flex mt-6 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium">
            Mulai Tryout Sekarang →
          </Link>
          )}
          <p className="text-xs text-center text-zinc-400 mt-2">Batch 1: UI dummy (Batch 2 akan sambung ke DB & acak soal)</p>
        </div>
      </main>
    </div>
  );
}
