"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTryoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const isAkbar = fd.get("is_tryout_akbar") === "on";
    const payload: any = {
      judul: String(fd.get("judul") || ""),
      deskripsi: String(fd.get("deskripsi") || ""),
      jumlah_soal: Number(fd.get("jumlah_soal") || 110),
      durasi_menit: Number(fd.get("durasi_menit") || 100),
      is_tryout_akbar: isAkbar,
    };
    if (isAkbar) {
      payload.akbar_start = String(fd.get("akbar_start") || "");
      payload.akbar_end = String(fd.get("akbar_end") || "");
    }
    setLoading(true); setMsg(null);
    const res = await fetch("/api/admin/tryout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = await res.json();
    setLoading(false);
    if (!res.ok) setMsg(j.error || "Gagal");
    else { setMsg("Berhasil! ID: " + j.id); router.push("/admin"); }
  }

  // default next Sunday 19:00 WIB
  const nextSun = (() => {
    const d = new Date();
    const day = d.getDay(); // 0 Sun
    const diff = (7 - day) % 7 || 7;
    d.setDate(d.getDate() + diff);
    d.setHours(19, 0, 0, 0);
    // convert to local datetime-local string (WIB = UTC+7, input is local)
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T19:00`;
  })();
  const nextSunEnd = (() => {
    const d = new Date(nextSun);
    d.setHours(21, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T21:00`;
  })();

  return (
    <Card className="max-w-xl">
      <CardHeader><CardTitle className="text-base">Buat Paket Tryout Baru</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><label className="text-xs font-medium">Judul</label><input name="judul" required defaultValue={`Tryout Akbar #${Math.floor(Math.random() * 90 + 10)} - ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs font-medium">Deskripsi</label><textarea name="deskripsi" defaultValue="Event Mingguan Minggu 19.00-21.00 WIB — 110 soal 100 menit, leaderboard freeze 21.00" className="w-full border rounded px-3 py-2 text-sm mt-1" rows={2} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">Jumlah Soal</label><input name="jumlah_soal" type="number" defaultValue={110} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs font-medium">Durasi (menit)</label><input name="durasi_menit" type="number" defaultValue={100} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="is_tryout_akbar" defaultChecked /> Tryout Akbar (pakai window)</label>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">Akbar Start (WIB)</label><input name="akbar_start" type="datetime-local" defaultValue={nextSun} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs font-medium">Akbar End (WIB)</label><input name="akbar_end" type="datetime-local" defaultValue={nextSunEnd} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? "Menyimpan..." : "Simpan Paket →"}</button>
          {msg && <p className="text-xs text-center mt-2 text-zinc-600">{msg}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
