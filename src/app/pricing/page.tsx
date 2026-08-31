import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PricingCheckout from "@/components/pricing/PricingCheckout";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold flex items-center gap-2"><span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">CPNS</span> Web</Link>
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">Dashboard →</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Pilih Paket — Gratis selamanya, Premium tanpa batas</h1>
          <p className="text-sm text-zinc-600 mt-3">Nonton iklan dummy 15/30 detik untuk kuota tambahan. Upgrade Premium <strong>Rp49k/bln</strong> tanpa iklan, unlimited semua fitur.</p>
        </div>

        {/* 2 Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader><CardTitle>FREE</CardTitle><CardDescription>Gratis selamanya + iklan dummy</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-black">Rp0<span className="text-sm font-normal text-zinc-500">/bulan</span></p>
              <ul className="text-sm mt-4 space-y-2">
                <li>✅ Tryout 1×/hari +1 iklan 15dtk (max 3)</li>
                <li>✅ Latihan 3×/hari +2 iklan 15dtk (max 9)</li>
                <li>✅ Analisis AI 1×/hari +1 iklan <strong>30dtk</strong> (max 2)</li>
                <li>✅ Chat Tutor 5×/hari +5 iklan 15dtk (max 20)</li>
                <li>✅ Generate 1×/hari +1 iklan <strong>30dtk</strong> (max 2)</li>
                <li>✅ Bank 300+ soal, Leaderboard Nasional</li>
                <li className="text-zinc-500">📺 Ada iklan dummy</li>
              </ul>
              <Link href="/register" className="block text-center mt-6 border rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-50">Daftar Gratis →</Link>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-600 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl">POPULER</div>
            <CardHeader><CardTitle className="flex items-center gap-2">PREMIUM <span className="text-xs bg-yellow-400 text-zinc-900 px-2 py-0.5 rounded">Hemat 30%</span></CardTitle><CardDescription>Unlimited tanpa iklan</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-black">Rp49k<span className="text-sm font-normal text-zinc-500">/bulan</span></p>
              <p className="text-xs text-zinc-500">atau Rp99k/3 bulan (Rp33k/bln)</p>
              <ul className="text-sm mt-4 space-y-2">
                <li>🚀 Tryout <strong>Unlimited</strong></li>
                <li>🚀 Latihan <strong>Unlimited</strong></li>
                <li>🚀 Analisis AI <strong>Unlimited</strong></li>
                <li>🚀 Chat Tutor <strong>Unlimited</strong></li>
                <li>🚀 Generate <strong>Unlimited</strong></li>
                <li>🚀 Bank 2000+ soal (update mingguan)</li>
                <li>🚀 Leaderboard Provinsi/Instansi</li>
                <li>✅ <strong>Tanpa iklan</strong></li>
              </ul>
              <div className="mt-6"><PricingCheckout /></div>
            </CardContent>
          </Card>
        </div>

        {/* Tabel */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader><CardTitle className="text-sm">Perbandingan Lengkap</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="text-xs text-zinc-500 border-b bg-zinc-50"><tr><th className="text-left p-3">Fitur</th><th className="text-center p-3">FREE Base</th><th className="text-center p-3">+ Iklan</th><th className="text-center p-3">Max/hari</th><th className="text-center p-3 bg-blue-50">PREMIUM</th></tr></thead>
              <tbody className="text-sm">
                <tr className="border-b"><td className="p-3">Tryout 110 soal</td><td className="text-center p-3">1×</td><td className="text-center p-3">+1 / 15dtk</td><td className="text-center p-3">3×</td><td className="text-center p-3 bg-blue-50 font-bold">Unlimited</td></tr>
                <tr className="border-b"><td className="p-3">Latihan 10 soal</td><td className="text-center p-3">3×</td><td className="text-center p-3">+2 / 15dtk</td><td className="text-center p-3">9×</td><td className="text-center p-3 bg-blue-50 font-bold">Unlimited</td></tr>
                <tr className="border-b"><td className="p-3">Analisis AI</td><td className="text-center p-3">1×</td><td className="text-center p-3">+1 / <strong>30dtk</strong></td><td className="text-center p-3">2×</td><td className="text-center p-3 bg-blue-50 font-bold">Unlimited</td></tr>
                <tr className="border-b"><td className="p-3">Chat Tutor</td><td className="text-center p-3">5×</td><td className="text-center p-3">+5 / 15dtk</td><td className="text-center p-3">20×</td><td className="text-center p-3 bg-blue-50 font-bold">Unlimited</td></tr>
                <tr className="border-b"><td className="p-3">Generate Soal Mirip</td><td className="text-center p-3">1×</td><td className="text-center p-3">+1 / <strong>30dtk</strong></td><td className="text-center p-3">2×</td><td className="text-center p-3 bg-blue-50 font-bold">Unlimited</td></tr>
                <tr><td className="p-3">Leaderboard</td><td className="text-center p-3" colSpan={3}>Nasional ✅</td><td className="text-center p-3 bg-blue-50">+ Provinsi/Instansi</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-8 space-y-3">
          <h3 className="font-semibold">FAQ</h3>
          <details className="border rounded p-3 bg-white dark:bg-zinc-900"><summary className="text-sm font-medium cursor-pointer">Iklan 15/30 detik itu apa?</summary><p className="text-sm text-zinc-600 mt-2">Dummy placeholder — countdown 15 detik (tryout/latihan/chat) atau 30 detik (analisis/generate) lalu klik Klaim Kuota. Nanti diganti AdSense ca-pub-xxx di 1 file AdRewardModal.tsx</p></details>
          <details className="border rounded p-3 bg-white dark:bg-zinc-900"><summary className="text-sm font-medium cursor-pointer">Kapan Midtrans aktif?</summary><p className="text-sm text-zinc-600 mt-2">Minggu 7 — checkout sudah aktif (mode sandbox — auto-settle untuk testing, ganti `MIDTRANS_SERVER_KEY` production di Vercel untuk live billing).</p></details>
          <details className="border rounded p-3 bg-white dark:bg-zinc-900"><summary className="text-sm font-medium cursor-pointer">Bisa ganti paket?</summary><p className="text-sm text-zinc-600 mt-2">Ya, FREE bisa upgrade kapan saja. Premium bulanan bisa diperpanjang.</p></details>
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard" className="inline-flex bg-zinc-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium">Mulai Gratis →</Link>
        </div>
      </main>
    </div>
  );
}
