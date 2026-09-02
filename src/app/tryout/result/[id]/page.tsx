import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AnalisisAI from "@/components/ai/AnalisisAI";
import CertificateCard from "@/components/certificate/CertificateCard";
import ShareCard from "@/components/share/ShareCard";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: attempt } = await supabase.from("attempts").select("id, user_id, tryout_id, waktu_mulai, waktu_selesai, durasi_pengerjaan, skor_twk, skor_tiu, skor_tkp, skor_total, status_twk, status_tiu, status_tkp, status_kelulusan, tryout_packages!inner(judul, is_tryout_akbar)").eq("id", id).single();
  if (!attempt) notFound();
  if (attempt.user_id !== user.id) redirect("/dashboard");
  if (!attempt.waktu_selesai) redirect(`/tryout/${attempt.tryout_id}/kerjakan`);

  const isLulus = attempt.status_kelulusan === "LULUS SKD";
  const pct = (v: number, max: number) => Math.min(100, Math.round((v / max) * 100));
  const { data: aiReview } = await supabase.from("ai_reviews").select("id, attempt_id, user_id, kelemahan, rencana_7_hari, motivasi, prediksi_lulus, raw_response, created_at").eq("attempt_id", id).maybeSingle();
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">← Dashboard</Link>
          <Link href={`/tryout/result/${id}/pembahasan`} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded">Lihat Pembahasan →</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className={`rounded-lg p-4 border-2 text-center ${isLulus ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950" : "bg-red-50 border-red-300 text-red-800 dark:bg-red-950"}`}>
          <p className="text-2xl font-bold">{attempt.status_kelulusan || "SELESAI"}</p>
          <p className="text-sm mt-1">{(attempt as any).tryout_packages?.judul || ""} • {attempt.skor_total ?? 0}/550 • {attempt.durasi_pengerjaan ? `${Math.floor(attempt.durasi_pengerjaan/60)}m ${attempt.durasi_pengerjaan%60}s` : ""}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <Card><CardHeader className="py-3"><CardTitle className="text-sm">TWK</CardTitle><p className="text-2xl font-bold">{attempt.skor_twk ?? 0}<span className="text-xs font-normal text-zinc-500"> /150</span></p><Progress value={pct(attempt.skor_twk||0,150)} className="mt-2" /><p className={`text-xs mt-1 ${attempt.status_twk==="LULUS"?"text-green-600":"text-red-600"}`}>{attempt.status_twk} (PG 65)</p></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardTitle className="text-sm">TIU</CardTitle><p className="text-2xl font-bold">{attempt.skor_tiu ?? 0}<span className="text-xs font-normal text-zinc-500"> /175</span></p><Progress value={pct(attempt.skor_tiu||0,175)} className="mt-2" /><p className={`text-xs mt-1 ${attempt.status_tiu==="LULUS"?"text-green-600":"text-red-600"}`}>{attempt.status_tiu} (PG 80)</p></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardTitle className="text-sm">TKP</CardTitle><p className="text-2xl font-bold">{attempt.skor_tkp ?? 0}<span className="text-xs font-normal text-zinc-500"> /225</span></p><Progress value={pct(attempt.skor_tkp||0,225)} className="mt-2" /><p className={`text-xs mt-1 ${attempt.status_tkp==="LULUS"?"text-green-600":"text-red-600"}`}>{attempt.status_tkp} (PG 166)</p></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardTitle className="text-sm">TOTAL</CardTitle><p className="text-2xl font-bold">{attempt.skor_total ?? 0}<span className="text-xs font-normal text-zinc-500"> /550</span></p><Progress value={pct(attempt.skor_total||0,550)} className="mt-2" /><p className="text-xs mt-1 text-zinc-500">{isLulus ? "🎉 Lulus 3 komponen!" : "Fokus ke komponen yang TIDAK LULUS"}</p></CardHeader></Card>
        </div>

        <AnalisisAI attemptId={id} initial={aiReview} />

        {/* 17.4 Sertifikat dummy — tampil untuk semua, khusus Akbar ada badge */}
        <CertificateCard
          nama={(user.email || "").split("@")[0]}
          skor={attempt.skor_total ?? 0}
          twk={attempt.skor_twk ?? 0}
          tiu={attempt.skor_tiu ?? 0}
          tkp={attempt.skor_tkp ?? 0}
          status={attempt.status_kelulusan || "SELESAI"}
          tanggal={attempt.waktu_selesai ? new Date(attempt.waktu_selesai).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : ""}
        />
        {(attempt as any).tryout_packages?.is_tryout_akbar && <p className="text-xs text-center text-zinc-500">🏆 Sertifikat Tryout Akbar — leaderboard freeze 21.00 WIB</p>}

        {/* 18.1-18.2 Shareable Result Card 1080x1920 */}
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2">📸 Share Hasil ke IG Story</CardTitle></CardHeader>
          <CardContent>
            <ShareCard
              skor={attempt.skor_total ?? 0}
              twk={attempt.skor_twk ?? 0}
              tiu={attempt.skor_tiu ?? 0}
              tkp={attempt.skor_tkp ?? 0}
              status={attempt.status_kelulusan || "SELESAI"}
              statusTwk={attempt.status_twk || "-"}
              statusTiu={attempt.status_tiu || "-"}
              statusTkp={attempt.status_tkp || "-"}
              judul={(attempt as any).tryout_packages?.judul || "Tryout SKD"}
              attemptId={id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Rincian</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-zinc-500 border-b"><tr><th className="text-left p-2">Komponen</th><th className="text-right p-2">Skor</th><th className="text-right p-2">Maks</th><th className="text-right p-2">Passing</th><th className="text-center p-2">Status</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2">TWK (30 soal ×5)</td><td className="p-2 text-right font-medium">{attempt.skor_twk??0}</td><td className="p-2 text-right">150</td><td className="p-2 text-right">65</td><td className="p-2 text-center"><span className={`px-2 py-1 rounded text-xs ${attempt.status_twk==="LULUS"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{attempt.status_twk}</span></td></tr>
                <tr className="border-b"><td className="p-2">TIU (35 soal ×5)</td><td className="p-2 text-right font-medium">{attempt.skor_tiu??0}</td><td className="p-2 text-right">175</td><td className="p-2 text-right">80</td><td className="p-2 text-center"><span className={`px-2 py-1 rounded text-xs ${attempt.status_tiu==="LULUS"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{attempt.status_tiu}</span></td></tr>
                <tr><td className="p-2">TKP (45 soal 1-5)</td><td className="p-2 text-right font-medium">{attempt.skor_tkp??0}</td><td className="p-2 text-right">225</td><td className="p-2 text-right">166</td><td className="p-2 text-center"><span className={`px-2 py-1 rounded text-xs ${attempt.status_tkp==="LULUS"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{attempt.status_tkp}</span></td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Link href={`/tryout/result/${id}/pembahasan`} className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-sm font-medium">Lihat Pembahasan →</Link>
          <Link href={`/tryout/${attempt.tryout_id}`} className="flex-1 text-center border bg-white hover:bg-zinc-50 rounded-lg py-3 text-sm font-medium">Kerjakan Lagi</Link>
          <Link href="/dashboard" className="flex-1 text-center border bg-white hover:bg-zinc-50 rounded-lg py-3 text-sm font-medium">Kembali Dashboard</Link>
        </div>
        <p className="text-xs text-zinc-400 text-center">Attempt {id.slice(0,8)} • Selesai {attempt.waktu_selesai ? new Date(attempt.waktu_selesai).toLocaleString("id-ID") : ""}</p>
      </main>
    </div>
  );
}
