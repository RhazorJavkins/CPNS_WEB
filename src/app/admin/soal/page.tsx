"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Q = { id:string; kategori:string; sub_materi:string; topik:string; level:string; pertanyaan:string; opsi_a:string; opsi_b:string; opsi_c:string; opsi_d:string; opsi_e:string; kunci_jawaban:string; pembahasan:string; skor_tkp:any; created_at:string };

export default function AdminSoalPage() {
  const [list, setList] = useState<Q[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [kategori, setKategori] = useState("all");
  const [level, setLevel] = useState("all");
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [selected, setSelected] = useState<Q | null>(null);
  const [edit, setEdit] = useState<Q | null>(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ kategori:"TWK", sub_materi:"", topik:"", level:"sedang", pertanyaan:"", opsi_a:"", opsi_b:"", opsi_c:"", opsi_d:"", opsi_e:"", kunci_jawaban:"A", pembahasan:"", skor_tkp:"" });

  useEffect(()=>{ const t=setTimeout(()=>setQDebounced(q),400); return ()=>clearTimeout(t); },[q]);
  async function load(p=page) {
    const params=new URLSearchParams({action:"questions", page:String(p), limit:String(limit), kategori, level});
    if(qDebounced) params.set("q", qDebounced);
    const r=await fetch(`/api/admin/questions?${params}`);
    const j=await r.json();
    if(r.ok){ setList(j.data||[]); setTotal(j.count||0); setPage(j.page||p); if(j.data?.[0] && !selected) setSelected(j.data[0]); } else setMsg("❌ "+j.error);
  }
  useEffect(()=>{ load(1); setSelected(null); },[kategori, level, qDebounced]);
  useEffect(()=>{ load(page); },[page]);

  async function submit(e:any){
    e.preventDefault();
    const payload:any={...form, skor_tkp: form.skor_tkp ? JSON.parse(form.skor_tkp||"null") : null};
    const r=await fetch("/api/admin/questions",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
    const j=await r.json();
    if(!r.ok) setMsg("❌ "+j.error); else { setMsg("✅ tersimpan "+j.id); load(1); }
  }
  async function saveEdit(){
    if(!edit) return;
    const r=await fetch("/api/admin/questions",{method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(edit)});
    const j=await r.json();
    if(!r.ok) setMsg("❌ "+j.error); else { setMsg("✅ diupdate"); setEdit(null); load(page); if(selected?.id===edit.id) setSelected(edit); }
  }
  async function del(id:string){
    if(!confirm("Hapus soal "+id+"?")) return;
    const r=await fetch(`/api/admin/questions?id=${id}`,{method:"DELETE"});
    const j=await r.json();
    if(!r.ok) setMsg("❌ "+j.error); else { setMsg("🗑️ terhapus"); setSelected(null); load(page); }
  }

  const totalPages=Math.ceil(total/limit)||1;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="text-sm text-blue-600">← Admin</Link>
        <span className="text-xs text-zinc-500">{total} soal • {kategori}/{level} • hal {page}/{totalPages}</span>
      </div>
      <h1 className="text-xl font-bold">Review Bank Soal — 900 live</h1>

      {/* filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border p-3 flex flex-wrap gap-2 items-center">
        <select value={kategori} onChange={e=>setKategori(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800">
          <option value="all">Semua kategori</option><option value="TWK">TWK</option><option value="TIU">TIU</option><option value="TKP">TKP</option>
        </select>
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800">
          <option value="all">Semua level</option><option value="mudah">mudah</option><option value="sedang">sedang</option><option value="sulit">sulit</option>
        </select>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari pertanyaan..." className="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm" />
        <button onClick={()=>load(page)} className="border rounded-lg px-4 py-2 text-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Refresh</button>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-4">
        {/* list */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border overflow-hidden flex flex-col max-h-[75vh]">
          <div className="p-3 border-b flex items-center justify-between">
            <span className="text-sm font-semibold">Daftar ({list.length}/{total})</span>
            <div className="flex gap-1">
              <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="border rounded px-2 py-1 text-xs disabled:opacity-30">‹ Prev</button>
              <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="border rounded px-2 py-1 text-xs disabled:opacity-30">Next ›</button>
            </div>
          </div>
          <div className="overflow-auto divide-y">
            {list.map(r=>(
              <button key={r.id} onClick={()=>setSelected(r)} className={`w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex gap-2 ${selected?.id===r.id?"bg-blue-50 dark:bg-blue-950":""}`}>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold ${r.kategori==="TWK"?"bg-emerald-100 text-emerald-700":r.kategori==="TIU"?"bg-blue-100 text-blue-700":"bg-amber-100 text-amber-700"}`}>{r.kategori}</span>
                <span className="text-xs line-clamp-2 flex-1">{r.pertanyaan}</span>
                <span className="text-[10px] text-zinc-400 shrink-0">{r.level}</span>
              </button>
            ))}
            {!list.length && <p className="p-6 text-sm text-zinc-400 text-center">Tidak ada soal</p>}
          </div>
          <div className="p-2 border-t flex gap-1 justify-center">
            {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPage(n)} className={`w-7 h-7 rounded text-xs ${page===n?"bg-zinc-900 text-white":"border"}`}>{n}</button>
            ))}
            {totalPages>7 && <span className="text-xs px-2 py-1">…{totalPages}</span>}
          </div>
        </div>

        {/* detail */}
        <div className="space-y-4">
          {selected ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">{selected.kategori} • {selected.sub_materi||"-"} {selected.topik?`• ${selected.topik}`:""}</span>
                <span className={`px-2 py-1 rounded-full ${selected.level==="mudah"?"bg-green-100 text-green-700":selected.level==="sedang"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>{selected.level}</span>
                <span className="text-zinc-400">Kunci: <b className="text-zinc-900 dark:text-white">{selected.kunci_jawaban}</b></span>
                <span className="ml-auto text-[10px] text-zinc-400">{selected.id.slice(0,8)}</span>
              </div>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{selected.pertanyaan}</p>
              <div className="grid gap-1.5">
                {(["A","B","C","D","E"] as const).map(k=>{
                  const v=(selected as any)[`opsi_${k.toLowerCase()}`];
                  if(!v) return null;
                  const isKunci=selected.kunci_jawaban===k;
                  return <div key={k} className={`flex gap-2 text-sm border rounded-lg px-3 py-2 ${isKunci?"bg-emerald-50 border-emerald-200 dark:bg-emerald-950":"bg-zinc-50 dark:bg-zinc-800"}`}><span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isKunci?"bg-emerald-600 text-white":"bg-zinc-200 dark:bg-zinc-700"}`}>{k}</span><span className="flex-1">{v}</span>{isKunci && <span className="text-emerald-600 text-xs">✓</span>}</div>
                })}
              </div>
              {selected.pembahasan && <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-xs leading-relaxed"><b>Pembahasan:</b> {selected.pembahasan}</div>}
              {selected.skor_tkp && <pre className="text-[11px] bg-zinc-50 dark:bg-zinc-800 border rounded-lg p-2 overflow-auto">{typeof selected.skor_tkp==="string"?selected.skor_tkp:JSON.stringify(selected.skor_tkp,null,2)}</pre>}
              <div className="flex gap-2 pt-2">
                <button onClick={()=>setEdit({...selected})} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium">Edit</button>
                <button onClick={()=>del(selected.id)} className="px-4 border border-red-200 text-red-600 rounded-lg py-2 text-sm">Hapus</button>
                <button onClick={()=>{const i=list.findIndex(x=>x.id===selected.id); if(i>=0 && i < list.length-1) setSelected(list[i+1]);}} className="px-4 border rounded-lg py-2 text-sm">Soal berikutnya →</button>
              </div>
            </div>
          ) : <div className="bg-white dark:bg-zinc-900 rounded-xl border p-8 text-center text-sm text-zinc-400">Pilih soal di kiri untuk preview 1 per 1</div>}

          {/* add form compact */}
          <details className="bg-white dark:bg-zinc-900 rounded-xl border">
            <summary className="p-3 text-sm font-semibold cursor-pointer">+ Tambah soal baru</summary>
            <form onSubmit={submit} className="p-4 grid gap-3 border-t">
              <div className="grid grid-cols-3 gap-2">
                <select value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className="border rounded-lg px-2 py-2 text-sm"><option>TWK</option><option>TIU</option><option>TKP</option></select>
                <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} className="border rounded-lg px-2 py-2 text-sm"><option value="mudah">mudah</option><option value="sedang">sedang</option><option value="sulit">sulit</option></select>
                <select value={form.kunci_jawaban} onChange={e=>setForm({...form,kunci_jawaban:e.target.value})} className="border rounded-lg px-2 py-2 text-sm"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select>
              </div>
              <input value={form.sub_materi} onChange={e=>setForm({...form,sub_materi:e.target.value})} placeholder="Sub materi" className="border rounded-lg px-3 py-2 text-sm" />
              <input value={form.topik} onChange={e=>setForm({...form,topik:e.target.value})} placeholder="Topik" className="border rounded-lg px-3 py-2 text-sm" />
              <textarea value={form.pertanyaan} onChange={e=>setForm({...form,pertanyaan:e.target.value})} placeholder="Pertanyaan" rows={2} className="border rounded-lg px-3 py-2 text-sm" />
              {(["a","b","c","d","e"] as const).map(k=>(
                <input key={k} value={(form as any)["opsi_"+k]} onChange={e=>setForm({...form,["opsi_"+k]:e.target.value} as any)} placeholder={`Opsi ${k.toUpperCase()}`} className="border rounded-lg px-3 py-2 text-sm" />
              ))}
              <textarea value={form.pembahasan} onChange={e=>setForm({...form,pembahasan:e.target.value})} placeholder="Pembahasan" rows={2} className="border rounded-lg px-3 py-2 text-sm" />
              {form.kategori==="TKP" && <input value={form.skor_tkp} onChange={e=>setForm({...form,skor_tkp:e.target.value})} placeholder='skor_tkp JSON {"A":5,"B":4,...}' className="border rounded-lg px-3 py-2 text-sm font-mono" />}
              <button type="submit" className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg py-2 text-sm font-medium">Simpan Soal</button>
              {msg && <p className="text-xs">{msg}</p>}
            </form>
          </details>
        </div>
      </div>

      {/* edit modal */}
      {edit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border max-w-2xl w-full max-h-[90vh] overflow-auto p-4 space-y-3">
            <h3 className="font-semibold">Edit Soal</h3>
            <div className="grid grid-cols-3 gap-2">
              <select value={edit.kategori} onChange={e=>setEdit({...edit, kategori:e.target.value})} className="border rounded-lg px-2 py-2 text-sm"><option>TWK</option><option>TIU</option><option>TKP</option></select>
              <select value={edit.level} onChange={e=>setEdit({...edit, level:e.target.value})} className="border rounded-lg px-2 py-2 text-sm"><option value="mudah">mudah</option><option value="sedang">sedang</option><option value="sulit">sulit</option></select>
              <select value={edit.kunci_jawaban} onChange={e=>setEdit({...edit, kunci_jawaban:e.target.value})} className="border rounded-lg px-2 py-2 text-sm"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select>
            </div>
            <input value={edit.sub_materi||""} onChange={e=>setEdit({...edit, sub_materi:e.target.value})} placeholder="Sub materi" className="w-full border rounded-lg px-3 py-2 text-sm" />
            <input value={edit.topik||""} onChange={e=>setEdit({...edit, topik:e.target.value})} placeholder="Topik" className="w-full border rounded-lg px-3 py-2 text-sm" />
            <textarea value={edit.pertanyaan} onChange={e=>setEdit({...edit, pertanyaan:e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {(["a","b","c","d","e"] as const).map(k=>(
              <input key={k} value={(edit as any)["opsi_"+k]||""} onChange={e=>setEdit({...edit, ["opsi_"+k]:e.target.value} as any)} placeholder={`Opsi ${k.toUpperCase()}`} className="w-full border rounded-lg px-3 py-2 text-sm" />
            ))}
            <textarea value={edit.pembahasan||""} onChange={e=>setEdit({...edit, pembahasan:e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Pembahasan" />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium">Simpan</button>
              <button onClick={()=>setEdit(null)} className="px-4 border rounded-lg py-2 text-sm">Batal</button>
            </div>
          </div>
        </div>
      )}
      {msg && <p className="text-sm text-center text-zinc-500">{msg}</p>}
    </div>
  );
}
