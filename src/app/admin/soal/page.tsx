"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSoalPage() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ kategori:"TWK", sub_materi:"", pertanyaan:"", opsi_a:"", opsi_b:"", opsi_c:"", opsi_d:"", opsi_e:"", kunci_jawaban:"A", pembahasan:"", skor_tkp:"" });
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");

  async function load() {
    const r = await fetch("/api/admin/questions?action=questions&page=1");
    const j = await r.json();
    setList(j.data||[]);
  }
  useEffect(()=>{ load(); },[]);

  async function submit(e:any) {
    e.preventDefault();
    const r = await fetch("/api/admin/questions", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ ...form, skor_tkp: form.skor_tkp? JSON.parse(form.skor_tkp || "null") : null }) });
    const j = await r.json();
    if (!r.ok) setMsg("❌ "+j.error);
    else { setMsg("✅ Soal tersimpan id "+j.id); load(); }
  }
  async function del(id:string) {
    if (!confirm("Hapus soal "+id+"?")) return;
    const r = await fetch("/api/admin/questions?id="+id, { method:"DELETE"});
    const j = await r.json();
    if (!r.ok) setMsg("❌ "+j.error); else { setMsg("🗑️ Terhapus"); load(); }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 max-w-5xl mx-auto space-y-6">
      <Link href="/admin" className="text-sm text-blue-600">← Admin</Link>
      <h1 className="text-xl font-bold">Kelola Soal — tanpa CSV</h1>
      <form onSubmit={submit} className="bg-white rounded-xl border p-4 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Kategori<select value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className="w-full border rounded px-2 py-1.5"><option>TWK</option><option>TIU</option><option>TKP</option></select></label>
          <label className="text-sm">Kunci<select value={form.kunci_jawaban} onChange={e=>setForm({...form,kunci_jawaban:e.target.value})} className="w-full border rounded px-2 py-1.5"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select></label>
        </div>
        <label className="text-sm">Sub Materi<input value={form.sub_materi} onChange={e=>setForm({...form,sub_materi:e.target.value})} placeholder="Pancasila / Analogi ..." className="w-full border rounded px-2 py-1.5" /></label>
        <label className="text-sm">Pertanyaan<textarea value={form.pertanyaan} onChange={e=>setForm({...form,pertanyaan:e.target.value})} rows={3} className="w-full border rounded px-2 py-1.5" /></label>
        {(["a","b","c","d","e"] as const).map(k=>(
          <label key={k} className="text-sm">Opsi {k.toUpperCase()}<input value={(form as any)["opsi_"+k]} onChange={e=>setForm({...form, ["opsi_"+k]: e.target.value} as any)} className="w-full border rounded px-2 py-1.5" /></label>
        ))}
        <label className="text-sm">Pembahasan<textarea value={form.pembahasan} onChange={e=>setForm({...form,pembahasan:e.target.value})} rows={2} className="w-full border rounded px-2 py-1.5" /></label>
        {form.kategori==="TKP" && <label className="text-sm">skor_tkp JSON (ex: {`{\"A\":5,\"B\":4,\"C\":3,\"D\":2,\"E\":1}`})<input value={form.skor_tkp} onChange={e=>setForm({...form,skor_tkp:e.target.value})} className="w-full border rounded px-2 py-1.5 font-mono text-xs" /></label>}
        <button type="submit" className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium">Simpan Soal</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-3 border-b flex items-center justify-between"><h2 className="font-semibold text-sm">20 Soal Terbaru</h2><button onClick={load} className="text-xs border px-2 py-1 rounded">Refresh</button></div>
        <table className="w-full text-xs">
          <thead className="bg-zinc-50 text-zinc-500"><tr><th className="text-left p-2">Kategori</th><th className="text-left p-2">Pertanyaan</th><th className="p-2">Aksi</th></tr></thead>
          <tbody>{list.map((r:any)=>(
            <tr key={r.id} className="border-t"><td className="p-2">{r.kategori}</td><td className="p-2 truncate max-w-[400px]">{r.pertanyaan}</td><td className="p-2 text-center"><button onClick={()=>del(r.id)} className="text-red-600">Hapus</button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
