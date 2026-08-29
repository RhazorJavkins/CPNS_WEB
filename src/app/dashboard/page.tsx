import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch tryout_packages
  const { data: packages } = await supabase.from("tryout_packages").select("*").eq("is_active", true).order("created_at");
  // Fetch attempts for user
  const { data: attempts } = await supabase.from("attempts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
  // Count questions
  const { count: qCount } = await supabase.from("questions").select("id", { count: "exact", head: true });

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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Bank Soal</CardDescription><CardTitle className="text-xl">{qCount ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Tryout Tersedia</CardDescription><CardTitle className="text-xl">{packages?.length ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Percobaan Kamu</CardDescription><CardTitle className="text-xl">{attempts?.length ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription className="text-xs">Passing Grade</CardDescription><CardTitle className="text-sm">TWK 65 • TIU 80 • TKP 166</CardTitle></CardHeader></Card>
        </div>

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
