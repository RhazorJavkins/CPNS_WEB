import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ADMIN_EMAILS = ["rhezarachmat_mkt", "rhezarachmat", "rhazorjavkins"];
function isAdmin(email?: string) {
  if (!email) return false;
  const e = email.toLowerCase();
  return ADMIN_EMAILS.some((a) => e.includes(a));
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.email || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <Card className="max-w-md w-full"><CardContent className="py-8"><p className="font-semibold">403 — Admin Only</p><p className="text-sm text-zinc-500 mt-1">Akun {user.email} bukan admin. Hubungi rhezarachmat_mkt.</p><Link href="/dashboard" className="inline-flex mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm">Ke Dashboard</Link></CardContent></Card>
      </div>
    );
  }
  const { data: pkgs } = await supabase.from("tryout_packages").select("id, judul, jumlah_soal, durasi_menit, is_tryout_akbar, akbar_start, akbar_end, created_at").order("created_at", { ascending: false }).limit(20);
  const { count: qCount } = await supabase.from("questions").select("id", { count: "exact", head: true });
  const { count: attemptsCount } = await supabase.from("attempts").select("id", { count: "exact", head: true });
  const { count: subsCount } = await supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status","active");
  const { count: aiCount } = await supabase.from("ai_reviews").select("id", { count: "exact", head: true });
  const since = new Date(Date.now()-24*3600*1000).toISOString();
  const { count: adsToday } = await supabase.from("ad_rewards").select("id", { count:"exact", head:true}).gte("rewarded_at", since);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm">← Dashboard</Link>
          <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">ADMIN</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Link href="/admin/tryout/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Buat Tryout Akbar</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">Bank Soal</p><CardTitle className="text-lg">{qCount ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">Total Attempts</p><CardTitle className="text-lg">{attemptsCount ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">Login sebagai</p><p className="text-xs font-medium truncate">{user.email}</p></CardHeader></Card>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">Subs Aktif</p><CardTitle className="text-lg">{subsCount ?? 0}</CardTitle><p className="text-xs text-zinc-400">est Rp{((subsCount??0)*49000).toLocaleString("id-ID")}</p></CardHeader></Card>
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">Ads Hari Ini</p><CardTitle className="text-lg">{adsToday ?? 0}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">AI Reviews</p><CardTitle className="text-lg">{aiCount ?? 0}</CardTitle><p className="text-xs text-zinc-400">Groq log</p></CardHeader></Card>
          <Card><CardHeader className="py-3"><p className="text-xs text-zinc-500">Tools</p><div className="flex flex-col gap-1 mt-1"><Link href="/admin/soal" className="text-xs bg-blue-600 text-white px-2 py-1 rounded text-center">Kelola Soal →</Link><Link href="/admin/tryout/new" className="text-xs bg-zinc-800 text-white px-2 py-1 rounded text-center">Tryout Baru →</Link></div></CardHeader></Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Paket Tryout (20 terbaru)</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="text-xs text-zinc-500 border-b"><tr><th className="text-left p-3">Judul</th><th className="p-3">Soal</th><th className="p-3">Akbar</th><th className="p-3">Window</th></tr></thead>
              <tbody>
                {(pkgs || []).map((p: any) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-3"><Link href={`/tryout/${p.id}`} className="text-blue-600 underline text-xs">{p.judul}</Link></td>
                    <td className="p-3 text-center text-xs">{p.jumlah_soal}</td>
                    <td className="p-3 text-center">{p.is_tryout_akbar ? <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Akbar</span> : <span className="text-xs text-zinc-400">-</span>}</td>
                    <td className="p-3 text-xs">{p.akbar_start ? `${new Date(p.akbar_start).toLocaleString("id-ID")} → ${p.akbar_end ? new Date(p.akbar_end).toLocaleString("id-ID") : ""}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p className="text-xs text-zinc-500">Whitelist admin: rhezarachmat_mkt / rhezarachmat / rhazorjavkins (substring match). Ubah di src/app/api/admin/tryout/route.ts & src/app/admin/page.tsx</p>
      </main>
    </div>
  );
}
