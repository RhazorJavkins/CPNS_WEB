"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Row = {
  rank: number;
  user_id: string;
  nama: string;
  provinsi: string;
  instansi: string;
  avatar_url: string | null;
  xp: number;
  skor_total: number;
  skor_twk: number;
  skor_tiu: number;
  skor_tkp: number;
  status: string;
};

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<"nasional" | "provinsi" | "instansi">("nasional");
  const [periode, setPeriode] = useState<"all_time" | "minggu_ini">("all_time");
  const [provinsi, setProvinsi] = useState("");
  const [instansi, setInstansi] = useState("");
  const [data, setData] = useState<Row[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({ filter, periode });
    if (provinsi) params.set("provinsi", provinsi);
    if (instansi) params.set("instansi", instansi);
    const res = await fetch(`/api/leaderboard?${params.toString()}`);
    const j = await res.json();
    setData(j.data || []);
    setMyRank(j.myRank || null);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filter, periode]);

  const handleFilterProv = () => {
    if (!provinsi) return alert("Isi nama provinsi dulu (contoh: Jawa Barat)");
    fetchData();
  };
  const handleFilterInstansi = () => {
    if (!instansi) return alert("Isi instansi target (contoh: Kemenkumham)");
    fetchData();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">CPNS</span> Leaderboard
          </Link>
          <Link href="/dashboard" className="text-xs border rounded px-3 py-1.5 hover:bg-zinc-100">← Dashboard</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h1 className="text-lg font-bold">🏆 Leaderboard Nasional</h1>
          <p className="text-sm text-zinc-500">Top 100 skor terbaik per user (skor SKD 0-550). Update realtime.</p>
          {myRank && <p className="text-xs mt-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 inline-block px-2 py-1 rounded">Kamu rank #{myRank} dari {data.length} {filter !== "nasional" ? `(${filter})` : ""}</p>}
        </div>

        <Card>
          <CardContent className="py-3 flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              {(["nasional", "provinsi", "instansi"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded text-xs font-medium capitalize ${filter === f ? "bg-blue-600 text-white" : "border bg-white hover:bg-zinc-50"}`}>
                  {f === "nasional" ? "Nasional" : f === "provinsi" ? "Provinsi" : "Instansi"}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-zinc-200 hidden sm:block" />
            <div className="flex gap-1">
              <button onClick={() => setPeriode("all_time")} className={`px-2 py-1.5 rounded text-xs ${periode === "all_time" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "border bg-white"}`}>Sepanjang Masa</button>
              <button onClick={() => setPeriode("minggu_ini")} className={`px-2 py-1.5 rounded text-xs ${periode === "minggu_ini" ? "bg-zinc-900 text-white" : "border bg-white"}`}>Minggu Ini</button>
            </div>
          </CardContent>
          {filter === "provinsi" && (
            <CardContent className="pt-0 flex gap-2">
              <input value={provinsi} onChange={(e) => setProvinsi(e.target.value)} placeholder="Filter provinsi (mis: DKI Jakarta)" className="flex-1 border rounded px-3 py-1.5 text-sm" />
              <button onClick={handleFilterProv} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Filter</button>
            </CardContent>
          )}
          {filter === "instansi" && (
            <CardContent className="pt-0 flex gap-2">
              <input value={instansi} onChange={(e) => setInstansi(e.target.value)} placeholder="Filter instansi (mis: Kemenkumham)" className="flex-1 border rounded px-3 py-1.5 text-sm" />
              <button onClick={handleFilterInstansi} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Filter</button>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top 100 {filter === "nasional" ? "Nasional" : filter === "provinsi" ? `Provinsi ${provinsi || ""}` : `Instansi ${instansi || ""}`}</CardTitle><CardDescription className="text-xs">{periode === "minggu_ini" ? "Periode: Senin — Minggu ini" : "Periode: Sepanjang masa"} • Skor terbaik per user</CardDescription></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-sm text-zinc-500 text-center">Memuat leaderboard...</div>
            ) : data.length === 0 ? (
              <div className="p-6 text-sm text-zinc-500 text-center">Belum ada data. Kerjakan tryout dulu biar masuk ranking!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-zinc-500 border-b bg-zinc-50 dark:bg-zinc-900">
                    <tr><th className="text-left p-3 w-12">#</th><th className="text-left p-3">Nama</th><th className="text-left p-3 hidden sm:table-cell">Provinsi</th><th className="text-left p-3 hidden md:table-cell">Instansi</th><th className="text-right p-3">Total</th><th className="text-right p-3 hidden sm:table-cell">TWK</th><th className="text-right p-3 hidden sm:table-cell">TIU</th><th className="text-right p-3 hidden sm:table-cell">TKP</th><th className="text-center p-3">Badge</th></tr>
                  </thead>
                  <tbody>
                    {data.map((r) => {
                      const isTop3 = r.rank <= 3;
                      const badge = r.rank === 1 ? "🥇 Top 1" : r.rank <= 3 ? `Top ${r.rank} 🔥` : r.skor_total >= 400 ? "Master 400+" : r.xp >= 100 ? "Streak 🔥" : "";
                      return (
                        <tr key={r.user_id} className={`border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 ${r.rank === myRank ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}>
                          <td className={`p-3 font-bold ${isTop3 ? "text-orange-600" : ""}`}>{r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : r.rank}</td>
                          <td className="p-3"><div className="font-medium truncate max-w-[140px]">{r.nama}</div><div className="text-xs text-zinc-500 sm:hidden">{r.provinsi} • {r.instansi}</div></td>
                          <td className="p-3 hidden sm:table-cell text-xs">{r.provinsi}</td>
                          <td className="p-3 hidden md:table-cell text-xs truncate max-w-[120px]">{r.instansi}</td>
                          <td className="p-3 text-right font-bold">{r.skor_total}</td>
                          <td className="p-3 text-right hidden sm:table-cell text-xs">{r.skor_twk}</td>
                          <td className="p-3 text-right hidden sm:table-cell text-xs">{r.skor_tiu}</td>
                          <td className="p-3 text-right hidden sm:table-cell text-xs">{r.skor_tkp}</td>
                          <td className="p-3 text-center"><span className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">{badge || "-"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="py-4 text-xs text-zinc-500">
            Tips: Kerjakan Tryout Akbar tiap Minggu 19.00 WIB untuk rank khusus Akbar. Badge “Master 400+” butuh skor total ≥400, “Streak 7 Hari” butuh 7 hari latihan beruntun (XP +10/latihan, +50/tryout).
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
