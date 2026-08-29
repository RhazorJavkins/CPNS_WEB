import Link from "next/link";
export default function KontakPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="border-b bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold flex items-center gap-2"><span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">CPNS</span> Web</Link>
          <Link href="/tentang" className="text-sm text-zinc-600 hover:text-zinc-900">Tentang →</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Kontak</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Project personal RhazorJavkins — CPNS Web Fase 1 MVP. Feedback via GitHub Issues paling cepat.</p>
        <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 space-y-3 text-sm">
          <p><strong>GitHub:</strong> <a href="https://github.com/RhazorJavkins/CPNS_WEB" className="text-blue-600 underline">RhazorJavkins/CPNS_WEB</a> — buat Issue untuk bug/feature</p>
          <p><strong>Vercel:</strong> <a href="https://cpns-web-coral.vercel.app" className="text-blue-600 underline">cpns-web-coral.vercel.app</a></p>
          <p><strong>Email:</strong> <a href="mailto:rhezarachmat.mkt@gmail.com" className="text-blue-600 underline">rhezarachmat.mkt@gmail.com</a></p>
          <p className="text-xs text-zinc-500">Respon 1-2 hari. Untuk laporan soal salah, sertakan ID soal (copas pertanyaan).</p>
        </div>
        <div className="flex gap-2">
          <a href="https://github.com/RhazorJavkins/CPNS_WEB/issues/new" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Buat Issue →</a>
          <Link href="/" className="px-4 py-2 border rounded text-sm bg-white">← Beranda</Link>
        </div>
      </main>
    </div>
  );
}
