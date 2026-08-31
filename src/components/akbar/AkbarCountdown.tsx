"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function fmt(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (d > 0) return `${d} hari ${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function AkbarCountdown({ start, end, tryoutId, judul }: { start: string; end: string; tryoutId: string; judul: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const msToStart = s - now;
  const msToEnd = e - now;
  const isLive = now >= s && now <= e;
  const isEnded = now > e;

  if (isEnded) {
    return (
      <div className="rounded-lg border bg-zinc-50 dark:bg-zinc-900 p-4 text-sm">
        <p className="font-semibold">{judul} — Selesai</p>
        <p className="text-xs text-zinc-500 mt-1">Leaderboard di-freeze. Lihat hasil di Leaderboard (filter Akbar).</p>
        <Link href="/leaderboard?akbar=true" className="inline-flex mt-2 text-xs bg-zinc-900 text-white px-3 py-1.5 rounded">Lihat Leaderboard Akbar →</Link>
      </div>
    );
  }
  if (isLive) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/20 p-4">
        <p className="text-xs font-bold text-green-700 flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" /> LIVE — {judul}</p>
        <p className="text-sm mt-1">Sisa waktu: <span className="font-mono font-bold">{fmt(msToEnd)}</span></p>
        <Link href={`/tryout/${tryoutId}`} className="inline-flex mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Ikut Sekarang →</Link>
      </div>
    );
  }
  return (
    <div className="rounded-lg border bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
      <p className="text-xs opacity-90">🔥 Tryout Akbar Berikutnya</p>
      <p className="font-bold text-sm mt-1">{judul}</p>
      <p className="text-xs opacity-80 mt-1">Minggu 19.00–21.00 WIB • 110 soal • 100 menit</p>
      <p className="font-mono text-lg font-bold mt-2">{fmt(msToStart)}</p>
      <p className="text-xs opacity-70">menuju start</p>
      <Link href={`/tryout/${tryoutId}`} className="inline-flex mt-3 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100">Lihat Detail →</Link>
    </div>
  );
}
