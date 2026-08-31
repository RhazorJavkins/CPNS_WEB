"use client";
import { useRef, useState, useEffect } from "react";

export default function ShareCard({ skor, twk, tiu, tkp, status, statusTwk, statusTiu, statusTkp, rank, totalPeserta, judul, attemptId }: {
  skor: number; twk: number; tiu: number; tkp: number; status: string; statusTwk: string; statusTiu: string; statusTkp: string; rank?: number | null; totalPeserta?: number; judul: string; attemptId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [myRank, setMyRank] = useState<number | null>(rank ?? null);

  useEffect(() => {
    if (rank) return;
    fetch("/api/leaderboard?filter=nasional&periode=all_time").then(r=>r.json()).then(j=>{
      if (j.myRank) setMyRank(j.myRank);
    }).catch(()=>{});
  }, [rank]);

  const isLulus = status === "LULUS SKD";
  const bg = isLulus ? "bg-gradient-to-br from-emerald-600 to-teal-700" : "bg-gradient-to-br from-zinc-800 to-zinc-900";

  async function handleDownload() {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: null, useCORS: true });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `CPNS-Web-${skor}-${attemptId.slice(0,6)}.png`;
      a.click();
    } catch (e) {
      alert("Gagal generate gambar: " + (e as Error).message);
    }
    setDownloading(false);
  }

  async function handleShare() {
    const text = `Aku dapat ${skor}/550 ${status} di ${judul}! TWK ${twk} TKP ${tkp} TIU ${tiu} — coba di cpns-web-coral.vercel.app #CPNS2026`;
    const url = `https://cpns-web-coral.vercel.app/tryout/result/${attemptId}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Hasil Tryout CPNS Web", text, url }); return; } catch {}
    }
    // fallback: copy + wa/telegram
    const wa = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank");
  }

  return (
    <div className="space-y-3">
      {/* Preview card 1080x1920 scaled */}
      <div className="flex justify-center">
        <div
          ref={ref}
          className={`w-[340px] h-[604px] ${bg} text-white rounded-xl p-6 flex flex-col justify-between overflow-hidden relative`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div>
            <p className="text-xs tracking-[0.2em] opacity-80">CPNS WEB • SIMULASI CAT BKN</p>
            <p className="text-xl font-black mt-2 leading-tight">{judul}</p>
            <div className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-bold ${isLulus ? "bg-white text-emerald-700" : "bg-white/20 text-white border border-white/30"}`}>{status} {isLulus ? "🎉" : ""}</div>
          </div>

          <div className="text-center">
            <p className="text-xs opacity-70">SKOR SKD</p>
            <p className="text-5xl font-black tracking-tight">{skor}<span className="text-xl font-normal opacity-60">/550</span></p>
            {myRank && <p className="text-xs mt-2 bg-white/15 inline-block px-3 py-1 rounded-full">Rank #{myRank} Nasional {totalPeserta ? `dari ${totalPeserta}` : ""}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-lg py-3 border border-white/10"><p className="text-xs opacity-70">TWK</p><p className="text-xl font-bold">{twk}</p><p className={`text-xs ${statusTwk==="LULUS"?"text-emerald-300":"text-red-300"}`}>{statusTwk} • PG 65</p></div>
            <div className="bg-white/10 rounded-lg py-3 border border-white/10"><p className="text-xs opacity-70">TIU</p><p className="text-xl font-bold">{tiu}</p><p className={`text-xs ${statusTiu==="LULUS"?"text-emerald-300":"text-red-300"}`}>{statusTiu} • PG 80</p></div>
            <div className="bg-white/10 rounded-lg py-3 border border-white/10"><p className="text-xs opacity-70">TKP</p><p className="text-xl font-bold">{tkp}</p><p className={`text-xs ${statusTkp==="LULUS"?"text-emerald-300":"text-red-300"}`}>{statusTkp} • PG 166</p></div>
          </div>

          <div className="text-center">
            <p className="text-xs opacity-60">cpns-web-coral.vercel.app</p>
            <p className="text-[10px] opacity-40 mt-1">Bukan situs resmi BKN • Untuk latihan</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleDownload} disabled={downloading} className="flex-1 bg-zinc-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-black disabled:opacity-50">{downloading ? "Membuat PNG..." : "⬇️ Download PNG"}</button>
        <button onClick={handleShare} className="flex-1 bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-emerald-700">📤 Share WA / Telegram</button>
      </div>
      <p className="text-xs text-zinc-500 text-center">1080×1920 — siap untuk IG Story. Download lalu upload ke Instagram.</p>
    </div>
  );
}
