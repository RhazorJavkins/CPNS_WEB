import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressChart from "@/components/charts/ProgressChart";
import RadarKelemahan from "@/components/charts/RadarKelemahan";

function mapSubMateriToRadarGroup(kategori: string, subMateri: string): string {
  const sm = (subMateri || "").toLowerCase();
  if (kategori === "TKP") return "TKP";
  if (kategori === "TWK") {
    if (sm.includes("pancasila") || sm.includes("bela negara") || sm.includes("nasionalisme") || sm.includes("cinta tanah")) return "Pancasila";
    if (sm.includes("uud") || sm.includes("amandemen") || sm.includes("lembaga negara") || sm.includes("hak asasi")) return "UUD 1945";
    // Other TWK goes to Pancasila group
    return "Pancasila";
  }
  if (kategori === "TIU") {
    if (sm.includes("analogi") || sm.includes("sinonim") || sm.includes("antonim") || sm.includes("verbal")) return "Verbal";
    if (sm.includes("deret") || sm.includes("berhitung") || sm.includes("soal cerita") || sm.includes("numerik")) return "Numerik";
    if (sm.includes("analitis") || sm.includes("silogisme") || sm.includes("figural") || sm.includes("logika")) return "Logika";
    return "Verbal";
  }
  return kategori;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch tryout_packages
  const { data: packages } = await supabase.from("tryout_packages").select("*").eq("is_active", true).order("created_at");
  // Fetch attempts for user (all for chart, limit 10 for table)
  const { data: attempts } = await supabase.from("attempts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
  const { data: attemptsAll } = await supabase.from("attempts").select("id, skor_twk, skor_tiu, skor_tkp, skor_total, status_kelulusan, created_at").eq("user_id", user.id).order("created_at", { ascending: true });
  // Count questions
  const { count: qCount } = await supabase.from("questions").select("id", { count: "exact", head: true });

  // Stats
  const totalAttempts = attemptsAll?.length ?? 0;
  const avgTotal = totalAttempts ? Math.round((attemptsAll!.reduce((s, a: any) => s + (a.skor_total || 0), 0) / totalAttempts)) : 0;
  const avgTwk = totalAttempts ? Math.round((attemptsAll!.reduce((s, a: any) => s + (a.skor_twk || 0), 0) / totalAttempts)) : 0;
  const avgTiu = totalAttempts ? Math.round((attemptsAll!.reduce((s, a: any) => s + (a.skor_tiu || 0), 0) / totalAttempts)) : 0;
  const avgTkp = totalAttempts ? Math.round((attemptsAll!.reduce((s, a: any) => s + (a.skor_tkp || 0), 0) / totalAttempts)) : 0;
  const lulusCount = attemptsAll?.filter((a: any) => a.status_kelulusan === "LULUS SKD").length ?? 0;
  const lulusRate = totalAttempts ? Math.round((lulusCount / totalAttempts) * 100) : 0;
  const bestScore = totalAttempts ? Math.max(...attemptsAll!.map((a: any) => a.skor_total || 0)) : 0;

  // Streak: count consecutive days with attempt (simple: distinct dates last 7 days)
  const dates = new Set((attemptsAll || []).map((a: any) => new Date(a.created_at).toISOString().slice(0, 10)));
  const streak = (() => {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 7; i++) {
      const key = d.toISOString().slice(0, 10);
      if (dates.has(key)) s++;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return s;
  })();

  // Progress chart data
  const progressData = (attemptsAll || []).map((a: any, idx: number) => ({
    name: `#${idx + 1}`,
    twk: a.skor_twk || 0,
    tiu: a.skor_tiu || 0,
    tkp: a.skor_tkp || 0,
    total: a.skor_total || 0,
  }));

  // Radar data: fetch attempt_answers for last up to 3 attempts
  let radarData: { subject: string; value: number }[] = [
    { subject: "Pancasila", value: 0 },
    { subject: "UUD 1945", value: 0 },
    { subject: "Verbal", value: 0 },
    { subject: "Numerik", value: 0 },
    { subject: "Logika", value: 0 },
    { subject: "TKP", value: 0 },
  ];
  if (attempts && attempts.length > 0) {
    const lastIds = attempts.slice(0, 3).map((a: any) => a.id);
    const { data: answers } = await supabase
      .from("attempt_answers")
      .select("is_benar, question_id, questions(kategori, sub_materi)")
      .in("attempt_id", lastIds)
      .limit(500);

    if (answers && answers.length > 0) {
      const groups: Record<string, { benar: number; total: number }> = {
        Pancasila: { benar: 0, total: 0 },
        "UUD 1945": { benar: 0, total: 0 },
        Verbal: { benar: 0, total: 0 },
        Numerik: { benar: 0, total: 0 },
        Logika: { benar: 0, total: 0 },
        TKP: { benar: 0, total: 0 },
      };
      for (const ans of answers as any[]) {
        const q = ans.questions;
        if (!q) continue;
        const g = mapSubMateriToRadarGroup(q.kategori, q.sub_materi);
        if (groups[g]) {
          groups[g].total++;
          if (ans.is_benar) groups[g].benar++;
        }
      }
      radarData = Object.entries(groups).map(([subject, v]) => ({
        subject,
        value: v.total ? Math.round((v.benar / v.total) * 100) : 0,
      }));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">CPNS</span> Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600 hidden sm:block">{user.email}</span>
            <form action={logoutAction}>
              <button className="text-xs border rounded px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">Keluar</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* CTA Latihan Harian */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="py-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">⚡ Latihan Harian — 10 Soal / 10 Menit</p>
              <p className="text-xs opacity-90">Cepat, fokus, tanpa beban 110 soal. Pilih TWK / TIU / TKP atau campur.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/latihan" className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100">Latihan →</Link>
              <Link href="/leaderboard" className="bg-yellow-400 text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300">🏆 Rank</Link>
            </div>
          </CardContent>
        </Card>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Bank Soal</CardDescription><CardTitle className="text-xl">{qCount ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Tryout Tersedia</CardDescription><CardTitle className="text-xl">{packages?.length ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Percobaan Kamu</CardDescription><CardTitle className="text-xl">{attempts?.length ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Passing Grade</CardDescription><CardTitle className="text-sm">TWK 65 • TIU 80 • TKP 166</CardTitle></CardHeader></Card>
        </div>

        {/* New stats: rata-rata, % lulus, streak */}
        {totalAttempts > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-blue-50/50 dark:bg-blue-950/20"><CardHeader className="py-3"><CardDescription className="text-xs">Rata-rata Skor</CardDescription><CardTitle className="text-lg">{avgTotal} <span className="text-xs font-normal text-zinc-500">/ 550</span></CardTitle><p className="text-xs text-zinc-500">TWK {avgTwk} • TIU {avgTiu} • TKP {avgTkp}</p></CardHeader></Card>
            <Card className="bg-green-50/50 dark:bg-green-950/20"><CardHeader className="py-3"><CardDescription className="text-xs">% Lulus SKD</CardDescription><CardTitle className="text-lg">{lulusRate}% <span className="text-xs font-normal text-zinc-500">({lulusCount}/{totalAttempts})</span></CardTitle><p className="text-xs text-zinc-500">Best: {bestScore}</p></CardHeader></Card>
            <Card className="bg-orange-50/50 dark:bg-orange-950/20"><CardHeader className="py-3"><CardDescription className="text-xs">Streak</CardDescription><CardTitle className="text-lg">{streak} hari 🔥</CardTitle><p className="text-xs text-zinc-500">Latihan beruntun</p></CardHeader></Card>
            <Card className="bg-purple-50/50 dark:bg-purple-950/20"><CardHeader className="py-3"><CardDescription className="text-xs">Progress</CardDescription><CardTitle className="text-sm">{totalAttempts >= 3 ? "Cukup data" : `${3 - totalAttempts} lagi untuk grafik`}</CardTitle><p className="text-xs text-zinc-500">Kerjakan 3x biar analisis akurat</p></CardHeader></Card>
          </div>
        )}

        {/* Charts: Progress + Radar */}
        {totalAttempts > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">📈 Progress Skor (Tryout #1 → #{totalAttempts})</CardTitle><CardDescription className="text-xs">TWK biru • TIU hijau • TKP orange • Total ungu • Garis putus = passing grade</CardDescription></CardHeader>
              <CardContent><ProgressChart data={progressData} /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🎯 Radar Kelemahan (3 tryout terakhir)</CardTitle><CardDescription className="text-xs">% benar per materi — 6 axis: Pancasila/UUD/Verbal/Numerik/Logika/TKP</CardDescription></CardHeader>
              <CardContent><RadarKelemahan data={radarData} /></CardContent>
            </Card>
          </div>
        )}

        {/* Tryout list */}
        <div>
          <h2 className="font-semibold mb-3">Tryout Tersedia</h2>
          {packages && packages.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {packages.map((p: any) => (
                <Card key={p.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-base">{p.judul}</CardTitle>
                    <CardDescription>{p.deskripsi || `${p.jumlah_soal} soal • ${p.durasi_menit} menit • CAT BKN`}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{p.jumlah_soal} soal • {p.durasi_menit} menit</span>
                    <Link href={`/tryout/${p.id}`} className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-blue-700">Mulai →</Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card><CardContent className="py-8 text-center text-sm text-zinc-500">
              Belum ada paket tryout. {qCount === 0 ? "Bank soal masih kosong — import dulu via scripts/import_soal.py" : "Buat paket di Supabase: insert into tryout_packages (judul,jumlah_soal,durasi_menit) values ('Tryout SKD #1',110,100)"}
            </CardContent></Card>
          )}
        </div>

        {/* History */}
        <div>
          <h2 className="font-semibold mb-3">History Tryout</h2>
          {attempts && attempts.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-zinc-500 border-b">
                    <tr><th className="text-left p-3">Tanggal</th><th className="text-right p-3">Total</th><th className="text-right p-3">TWK</th><th className="text-right p-3">TIU</th><th className="text-right p-3">TKP</th><th className="text-center p-3">Status</th><th className="p-3"></th></tr>
                  </thead>
                  <tbody>
                    {attempts.map((a: any) => (
                      <tr key={a.id} className="border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <td className="p-3 text-xs">{new Date(a.created_at).toLocaleString("id-ID")}</td>
                        <td className="p-3 text-right font-medium">{a.skor_total ?? "-"}</td>
                        <td className="p-3 text-right">{a.skor_twk ?? "-"} <span className={`text-xs ${a.status_twk === "LULUS" ? "text-green-600" : a.status_twk ? "text-red-600" : ""}`}>{a.status_twk || ""}</span></td>
                        <td className="p-3 text-right">{a.skor_tiu ?? "-"} <span className={`text-xs ${a.status_tiu === "LULUS" ? "text-green-600" : a.status_tiu ? "text-red-600" : ""}`}>{a.status_tiu || ""}</span></td>
                        <td className="p-3 text-right">{a.skor_tkp ?? "-"} <span className={`text-xs ${a.status_tkp === "LULUS" ? "text-green-600" : a.status_tkp ? "text-red-600" : ""}`}>{a.status_tkp || ""}</span></td>
                        <td className="p-3 text-center"><span className={`text-xs px-2 py-1 rounded ${a.status_kelulusan === "LULUS SKD" ? "bg-green-100 text-green-700" : a.status_kelulusan ? "bg-red-100 text-red-700" : "bg-zinc-100"}`}>{a.status_kelulusan || "PROSES"}</span></td>
                        <td className="p-3 text-right"><Link href={`/tryout/result/${a.id}`} className="text-xs text-blue-600 underline">Lihat</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card><CardContent className="py-6 text-center text-sm text-zinc-500">Belum ada percobaan. Mulai tryout di atas!</CardContent></Card>
          )}
        </div>

        <Card className="border-dashed">
          <CardContent className="py-4 text-xs text-zinc-500">
            Tips: TWK 65 (13 benar), TIU 80 (16 benar), TKP 166 (butuh rata-rata 3.7 per soal). Fokus ke kelemahan per komponen, bukan total saja.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

async function logoutAction() {
  "use server";
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  const { redirect } = await import("next/navigation");
  redirect("/login");
}
