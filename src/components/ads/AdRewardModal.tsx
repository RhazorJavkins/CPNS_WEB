"use client";
import { useEffect, useState } from "react";

export default function AdRewardModal({ jenis, durasi = 15, open, onClose, onClaimed }: { jenis: string; durasi?: number; open: boolean; onClose: () => void; onClaimed?: () => void }) {
  const [sec, setSec] = useState(durasi);
  const [claiming, setClaiming] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setSec(durasi); setMsg(null); return; }
    setSec(durasi);
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [open, durasi]);

  if (!open) return null;

  async function claim() {
    setClaiming(true); setMsg(null);
    const res = await fetch("/api/ads/reward", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jenis }) });
    const j = await res.json();
    setClaiming(false);
    if (!res.ok) setMsg(j.error || "Gagal");
    else { setMsg(`Berhasil! Kuota ${jenis} sekarang ${j.totalKuota}/hari`); onClaimed?.(); setTimeout(onClose, 1200); }
  }

  const ready = sec === 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 text-center">
        <p className="text-xs tracking-widest text-zinc-500">IKLAN DUMMY — DUKUNG GRATIS</p>
        <div className="mt-3 h-40 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed">
          <div className="text-center">
            <p className="text-2xl">📺</p>
            <p className="text-sm font-medium">Iklan CPNS — dukung gratis</p>
            <p className="text-xs text-zinc-500">Nanti ganti ca-pub-xxx di AdRewardModal.tsx</p>
            <p className="text-xs mt-2">Jenis: <strong>{jenis}</strong> • Durasi: {durasi} detik</p>
          </div>
        </div>
        <p className="text-sm mt-3">{ready ? "✅ Iklan selesai — klaim kuota!" : `⏳ Tunggu ${sec} detik...`}</p>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${((durasi - sec) / durasi) * 100}%` }} />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm">Tutup</button>
          <button disabled={!ready || claiming} onClick={claim} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40 hover:bg-blue-700">{claiming ? "..." : "Klaim Kuota →"}</button>
        </div>
        {msg && <p className="text-xs mt-2 text-zinc-600">{msg}</p>}
        <p className="text-[10px] text-zinc-400 mt-2">Provider dummy • anti-spam 30 detik • max sesuai tabel pricing</p>
      </div>
    </div>
  );
}
