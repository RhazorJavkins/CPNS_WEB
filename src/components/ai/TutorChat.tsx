"use client";
import { useState } from "react";

export default function TutorChat({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  const [pesan, setPesan] = useState("");
  const [history, setHistory] = useState<{q:string,a:string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function ask() {
    if (!pesan.trim()) return;
    const cur = pesan; setPesan(""); setLoading(true); setErr("");
    try {
      const res = await fetch("/api/ai/tutor", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ question_id: questionId, pesan_user: cur })});
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal");
      setHistory(h=>[...h, {q:cur, a:j.jawaban_ai}]);
    } catch(e:any){ setErr(e.message); setPesan(cur); }
    setLoading(false);
  }

  if (!open) return <button onClick={()=>setOpen(true)} className="mt-2 text-xs border rounded px-3 py-1.5 bg-white hover:bg-zinc-50">💬 Tanya AI Tutor</button>;

  return (
    <div className="mt-3 border rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-zinc-50 dark:bg-zinc-800">
        <span className="text-xs font-semibold">💬 AI Tutor</span>
        <button onClick={()=>setOpen(false)} className="text-xs text-zinc-500">✕ Tutup</button>
      </div>
      <div className="p-3 space-y-3 max-h-72 overflow-auto">
        {history.length===0 && <p className="text-xs text-zinc-400">Contoh: “Kenapa jawaban C bukan B?” atau “Jelaskan konsep deret ini”</p>}
        {history.map((h,i)=>(
          <div key={i} className="space-y-1">
            <p className="text-xs bg-blue-50 dark:bg-blue-950 rounded px-2 py-1.5"><b>Kamu:</b> {h.q}</p>
            <p className="text-xs bg-zinc-50 dark:bg-zinc-800 rounded px-2 py-1.5 whitespace-pre-wrap"><b>AI:</b> {h.a}</p>
          </div>
        ))}
        {loading && <p className="text-xs text-zinc-400 animate-pulse">AI ngetik...</p>}
        {err && <p className="text-xs text-red-600">{err}</p>}
      </div>
      <div className="flex gap-2 p-2 border-t">
        <input value={pesan} onChange={e=>setPesan(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Tanya soal ini..." className="flex-1 text-xs border rounded px-2 py-1.5" />
        <button onClick={ask} disabled={loading || !pesan.trim()} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded disabled:opacity-50">Kirim</button>
      </div>
    </div>
  );
}
