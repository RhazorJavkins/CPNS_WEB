"use client";
export default function CertificateCard({ nama, skor, twk, tiu, tkp, status, tanggal }: { nama: string; skor: number; twk: number; tiu: number; tkp: number; status: string; tanggal: string }) {
  return (
    <div id="cert-card" className="bg-white border-2 border-zinc-900 rounded-lg p-6 text-center max-w-md mx-auto">
      <p className="text-xs tracking-widest text-zinc-500">SERTIFIKAT PESERTA</p>
      <p className="font-bold text-lg mt-1">Tryout Akbar CPNS Web</p>
      <p className="text-sm mt-4">Diberikan kepada</p>
      <p className="font-bold text-xl mt-1">{nama}</p>
      <p className="text-xs text-zinc-500 mt-1">{tanggal}</p>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="border rounded p-2"><p className="text-xs text-zinc-500">TWK</p><p className="font-bold">{twk}</p></div>
        <div className="border rounded p-2"><p className="text-xs text-zinc-500">TIU</p><p className="font-bold">{tiu}</p></div>
        <div className="border rounded p-2"><p className="text-xs text-zinc-500">TKP</p><p className="font-bold">{tkp}</p></div>
      </div>
      <p className="font-bold text-2xl mt-4">{skor}/550</p>
      <p className={`text-sm font-bold mt-1 ${status.includes("LULUS") ? "text-green-600" : "text-red-600"}`}>{status}</p>
      <p className="text-xs text-zinc-400 mt-3">cpns-web-coral.vercel.app • Sertifikat dummy — berlaku untuk motivasi</p>
      <button onClick={() => window.print()} className="mt-4 w-full bg-zinc-900 text-white rounded py-2 text-sm">🖨️ Cetak / Save PDF</button>
    </div>
  );
}
