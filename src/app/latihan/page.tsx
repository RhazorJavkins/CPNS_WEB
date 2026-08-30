import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function LatihanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: qCount } = await supabase.from("questions").select("id", { count: "exact", head: true });
  // hitung soal salah user (untuk badge)
  const { count: salahCount } = await supabase.from("attempt_answers").select("id", { count: "exact", head: true }).eq("is_benar", false);

  const modes = [
    { key: "campur", title: "⚡ Latihan Cepat", desc: "10 soal campuran TWK • TIU • TKP", badge: "10 soal • 10 menit", color: "bg-blue-600", href: "/latihan/kerjakan?mode=campur&n=10" },
    { key: "twk", title: "📜 Latihan TWK", desc: "10 soal TWK — Pancasila, UUD 1945, NKRI", badge: "TWK • 10 menit", color: "bg-red-600", href: "/latihan/kerjakan?mode=twk&n=10" },
    { key: "tiu", title: "🧩 Latihan TIU", desc: "10 soal TIU — Verbal, Numerik, Figural", badge: "TIU • 10 menit", color: "bg-green-600", href: "/latihan/kerjakan?mode=tiu&n=10" },
    { key: "tkp", title: "🤝 Latihan TKP", desc: "10 soal TKP — Pelayanan, Sosial Budaya", badge: "TKP • 10 menit", color: "bg-purple-600", href: "/latihan/kerjakan?mode=tkp&n=10" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">CPNS</span> Latihan Harian
          </Link>
          <Link href="/dashboard" className="text-xs border rounded px-3 py-1.5 hover:bg-zinc-100">← Dashboard</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-lg font-bold">Mode Latihan Harian</h1>
          <p className="text-sm text-zinc-500">10 soal / 10 menit — cepat, fokus, tanpa beban 110 soal. Bank soal: {qCount ?? 300} soal.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {modes.map((m) => (
            <Card key={m.key} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="text-base">{m.title}</CardTitle>
                <CardDescription>{m.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">{m.badge}</span>
                <Link href={m.href} className={`inline-flex items-center justify-center rounded-lg text-white px-4 py-2 text-sm font-medium hover:opacity-90 ${m.color}`}>Mulai →</Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className={`border-dashed ${salahCount && salahCount > 0 ? "border-orange-300 bg-orange-50/50 dark:bg-orange-950/20" : ""}`}>
          <CardHeader>
            <CardTitle className="text-base">🔄 Soal Salah Kemarin</CardTitle>
            <CardDescription>{salahCount && salahCount > 0 ? `Kamu punya ${salahCount} jawaban salah — latihan ulang biar nempel.` : "Belum ada soal salah. Kerjakan tryout/latihan dulu, nanti soal yang salah muncul di sini."}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Ambil 10 soal yang pernah kamu jawab salah (acak)</span>
            <Link href="/latihan/kerjakan?mode=salah&n=10" className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium ${salahCount && salahCount > 0 ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-zinc-200 text-zinc-500 cursor-not-allowed pointer-events-none"}`}>Latihan Salah →</Link>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
          <CardContent className="py-4 text-sm">
            <p className="font-medium">💡 Tips Latihan Harian</p>
            <ul className="list-disc ml-5 mt-1 text-xs text-zinc-600 space-y-1">
              <li>Timer 10 menit — simulasi tekanan CAT, bukan santai.</li>
              <li>Selesai → lihat skor TWK/TIU/TKP + tombol “Tanya AI Tutor” per soal.</li>
              <li>Mau soal mirip yang salah? Klik “🔄 Generate 5 Soal Mirip” (butuh 15.x nanti).</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <Link href="/dashboard" className="text-xs underline text-blue-600">Lihat Progress & Radar</Link>
              <span className="text-xs text-zinc-400">•</span>
              <Link href="/tryout" className="text-xs underline text-blue-600 hidden">Tryout 110 soal</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
