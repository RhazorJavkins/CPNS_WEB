"use client";
import { useState } from "react";

export default function AnalisisAI({ attemptId, initial }: { attemptId: string; initial?: any }) {
  const [data, setData] = useState<any>(initial || null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/ai/analisis", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attempt_id: attemptId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal");
      setData(j.data);
    } catch (e: any) { setErr(e.message); }
    setLoading(false);
  }

  if (data) {
    const kelemahan = data.kelemahan || [];
    const rencana = data.rencana_7_hari || [];
    return (
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="font-semibold text-sm">Analisis AI untuk Kamu</h3>
          <span className="ml-auto text-xs text-zinc-400">{data.created_at ? new Date(data.created_at).toLocaleString("id-ID") : ""}</span>
        </div>
        {data.prediksi_lulus && <p className="text-sm bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg px-3 py-2">🔮 Prediksi Lulus: {data.prediksi_lulus}</p>}
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-2">⚠️ 3 Kelemahan Utama</p>
          <div className="space-y-2">
            {kelemahan.map((k: any, i: number) => (
              <div key={i} className="rounded-lg border p-3 bg-zinc-50 dark:bg-zinc-800">
                <p className="text-sm font-medium">{i+1}. {k.area} <span className="text-xs font-normal text-red-500">• {k.persentase_salah || ""}</span></p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{k.penjelasan}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-2">📅 Rencana 7 Hari</p>
          <div className="space-y-1.5">
            {rencana.map((r: any) => (
              <div key={r.hari} className="flex gap-2 text-xs border rounded-lg px-3 py-2 bg-white dark:bg-zinc-900">
                <span className="font-bold text-blue-600">Hari {r.hari}</span>
                <span className="font-medium">{r.fokus}</span>
                <span className="text-zinc-500">— {r.aksi}</span>
                <span className="ml-auto text-zinc-400">{r.target}</span>
              </div>
            ))}
          </div>
        </div>
        {data.motivasi && <p className="text-sm text-center italic text-zinc-600 dark:text-zinc-300">💪 {data.motivasi}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">🤖 Mau Analisis AI Gratis?</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Dapat 3 kelemahan + rencana 7 hari + prediksi lulus. ~5 detik.</p>
        </div>
        <button onClick={run} disabled={loading} className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs px-4 py-2 rounded-lg font-medium">
          {loading ? "Menganalisis..." : "Analisis Sekarang"}
        </button>
      </div>
      {err && <p className="text-xs text-red-600 mt-2">{err}</p>}
      {loading && <p className="text-xs text-zinc-400 mt-2 animate-pulse">AI mikir... (Groq gpt-oss-20b ~5-10 detik)</p>}
    </div>
  );
}
