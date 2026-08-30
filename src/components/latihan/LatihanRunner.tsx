"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuestionCard } from "@/components/tryout/QuestionCard";
import { Timer } from "@/components/tryout/Timer";
import { NumberGrid } from "@/components/tryout/NumberGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { skorSoal, hitungSkor } from "@/lib/scoring";

type Q = {
  id: string;
  kategori: "TWK" | "TIU" | "TKP";
  sub_materi: string | null;
  pertanyaan: string;
  opsi_a: string; opsi_b: string; opsi_c: string; opsi_d: string; opsi_e: string;
  kunci_jawaban: string;
  skor_tkp: Record<string, number> | null;
  pembahasan: string | null;
};

export default function LatihanRunner({ mode, n }: { mode: string; n: number }) {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [ragu, setRagu] = useState<Record<string, boolean>>({});
  const [cur, setCur] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof hitungSkor> | null>(null);
  const [durasiPakai, setDurasiPakai] = useState(0);
  const [startAt] = useState(() => Date.now());
  const [openConfirm, setOpenConfirm] = useState(false);
  const durasiMenit = 10;
  const totalDetik = durasiMenit * 60;

  const fetchQuestions = useCallback(async () => {
    const supabase = createClient();
    try {
      let qs: Q[] = [];
      const limitFetch = 80;
      if (mode === "salah") {
        // ambil soal yang pernah salah
        const { data: salah } = await supabase.from("attempt_answers").select("question_id").eq("is_benar", false).limit(50);
        const ids = (salah || []).map((r: any) => r.question_id).filter(Boolean);
        if (ids.length === 0) throw new Error("Belum ada soal salah — kerjakan tryout/latihan dulu biar ada data salah.");
        const unique = [...new Set(ids)] as string[];
        const pickIds = unique.sort(() => 0.5 - Math.random()).slice(0, n);
        const { data, error } = await supabase.from("questions").select("*").in("id", pickIds);
        if (error) throw error;
        qs = (data as Q[]).sort(() => 0.5 - Math.random());
      } else if (["twk", "tiu", "tkp"].includes(mode)) {
        const kat = mode.toUpperCase();
        const { data, error } = await supabase.from("questions").select("*").eq("kategori", kat).limit(limitFetch);
        if (error) throw error;
        qs = ((data as Q[]) || []).sort(() => 0.5 - Math.random()).slice(0, n);
      } else {
        const { data, error } = await supabase.from("questions").select("*").limit(limitFetch);
        if (error) throw error;
        qs = ((data as Q[]) || []).sort(() => 0.5 - Math.random()).slice(0, n);
      }
      if (qs.length === 0) throw new Error("Gagal ambil soal — DB kosong atau filter tidak ada.");
      if (qs.length < n) console.warn(`Hanya dapat ${qs.length} soal, minta ${n}`);
      setQuestions(qs);
      const init: Record<string, null> = {};
      qs.forEach((q) => (init[q.id] = null));
      setAnswers(init);
    } catch (e: any) {
      setErr(e.message || "Gagal load soal");
    } finally {
      setLoading(false);
    }
  }, [mode, n]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleSelect = (qid: string, key: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  };
  const toggleRagu = () => {
    const q = questions[cur];
    if (!q) return;
    setRagu((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
  };
  const clearAnswer = () => {
    const q = questions[cur];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: null }));
  };

  const doSubmit = async () => {
    setSubmitting(true);
    const list = questions.map((q) => ({
      kategori: q.kategori,
      kunci_jawaban: q.kunci_jawaban,
      skor_tkp: q.skor_tkp,
      jawaban_user: answers[q.id] || null,
    }));
    const skor = hitungSkor(list as any);
    setResult(skor);
    const elapsed = Math.round((Date.now() - startAt) / 1000);
    setDurasiPakai(elapsed);
    // coba simpan ke latihan_sessions jika tabel ada (ignore error jika belum)
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("latihan_sessions").insert({
          user_id: user.id,
          mode,
          jumlah_soal: questions.length,
          skor: skor.total,
          skor_twk: skor.twk,
          skor_tiu: skor.tiu,
          skor_tkp: skor.tkp,
          durasi_detik: elapsed,
        } as any);
      }
    } catch {}
    setSubmitting(false);
    setOpenConfirm(false);
  };

  const handleExpire = async () => {
    alert("Waktu habis — otomatis dinilai!");
    await doSubmit();
  };

  if (loading) return <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6 text-sm">Memuat {n} soal {mode}...</div>;
  if (err) return <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-3 p-6"><p className="text-sm text-red-600 text-center">{err}</p><div className="flex gap-2"><button onClick={() => location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Coba Lagi</button><Link href="/latihan" className="px-4 py-2 border rounded text-sm bg-white">← Pilih Mode</Link></div></div>;
  if (result) {
    const pct = Math.round((questions.filter((q) => {
      const j = answers[q.id];
      if (!j) return false;
      if (q.kategori === "TKP") return (q.skor_tkp as any)?.[j] >= 4;
      return j.toUpperCase() === q.kategori ? false : j.toUpperCase() === q.kunci_jawaban.toUpperCase();
    }).length / questions.length) * 100);
    // hitung benar manual via skor logic
    const benar = questions.filter((q) => {
      const j = answers[q.id];
      if (!j) return false;
      if (q.kategori === "TKP") return (q.skor_tkp?.[j] ?? 0) >= 4;
      return j.toUpperCase() === q.kunci_jawaban.toUpperCase();
    }).length;
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-base">✅ Latihan Selesai — Mode {mode.toUpperCase()} • {questions.length} soal • {Math.floor(durasiPakai / 60)}:{String(durasiPakai % 60).padStart(2, "0")}</CardTitle>
              <CardDescription>Skor: {result.total} • TWK {result.twk} • TIU {result.tiu} • TKP {result.tkp} • Benar {benar}/{questions.length}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <span className={`text-xs px-2 py-1 rounded ${result.status_kelulusan === "LULUS SKD" ? "bg-green-600 text-white" : "bg-red-100 text-red-700"}`}>{result.status_kelulusan}</span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-100">TWK {result.status_twk}</span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-100">TIU {result.status_tiu}</span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-100">TKP {result.status_tkp}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Pembahasan — cek jawabanmu</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {questions.map((q, idx) => {
                const j = answers[q.id];
                const benarKey = q.kategori === "TKP" ? Object.entries(q.skor_tkp || {}).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] : q.kunci_jawaban;
                const isBenar = q.kategori === "TKP" ? ((q.skor_tkp?.[j || ""] ?? 0) >= 4) : j?.toUpperCase() === q.kunci_jawaban.toUpperCase();
                return (
                  <div key={q.id} className={`border rounded-lg p-3 ${isBenar ? "border-green-200 bg-green-50/30" : j ? "border-red-200 bg-red-50/30" : "border-zinc-200"}`}>
                    <p className="text-xs text-zinc-500">{idx + 1}. {q.kategori} • {q.sub_materi || "-"} {ragu[q.id] ? "• Ragu" : ""}</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{q.pertanyaan}</p>
                    <div className="mt-2 text-xs space-y-1">
                      {["A", "B", "C", "D", "E"].map((k) => {
                        const txt = (q as any)[`opsi_${k.toLowerCase()}`];
                        const isPick = j === k;
                        const isKunci = k === benarKey;
                        return <div key={k} className={`px-2 py-1 rounded flex gap-2 ${isPick ? (isBenar ? "bg-green-100" : "bg-red-100") : ""} ${isKunci ? "border border-green-400" : ""}`}><span className="font-bold">{k}.</span><span>{txt}</span>{isPick && <span className="ml-auto">{isBenar ? "✓" : "✗"} kamu</span>}{isKunci && <span className="ml-auto text-green-700">kunci</span>}</div>;
                      })}
                    </div>
                    {q.pembahasan && <p className="text-xs mt-2 p-2 bg-white border rounded">💡 {q.pembahasan}</p>}
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => alert("Fitur Tanya AI Tutor akan hadir di 15.x — sekarang pakai /api/ai/tutor manual")} className="text-xs border rounded px-2 py-1 bg-white hover:bg-zinc-50">💬 Tanya AI Tutor</button>
                      <button onClick={() => alert("Generate 5 Soal Mirip — fitur 15.x (api/ai/generate-soal)")} className="text-xs border rounded px-2 py-1 bg-white hover:bg-zinc-50">🔄 Generate 5 Soal Mirip</button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Link href="/latihan" className="flex-1 text-center px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium">Latihan Lagi</Link>
            <Link href="/dashboard" className="flex-1 text-center px-4 py-3 border bg-white rounded-lg text-sm">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[cur];
  const terjawab = Object.values(answers).filter(Boolean).length;
  const gridItems = questions.map((qq, idx) => ({ index: idx, answered: !!answers[qq.id], flagged: !!ragu[qq.id], current: idx === cur }));

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
      <header className="h-14 bg-white dark:bg-zinc-900 border-b flex items-center px-3 md:px-4 gap-2 sticky top-0 z-10">
        <Link href="/latihan" className="text-xs border rounded px-2 py-1 hover:bg-zinc-50">← Mode</Link>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-xs text-zinc-500 hidden md:inline">Sisa Waktu</span>
          <Timer seconds={totalDetik - Math.floor((Date.now() - startAt) / 1000) > 0 ? totalDetik - Math.floor((Date.now() - startAt) / 1000) : 0} onExpire={handleExpire} />
        </div>
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded whitespace-nowrap">Soal {cur + 1}/{questions.length} • {mode.toUpperCase()}</span>
        <button onClick={() => setOpenConfirm(true)} className="text-xs bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1.5 font-medium">Selesai</button>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[260px_1fr_220px] gap-3 p-3">
        <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 h-fit lg:sticky lg:top-[68px] order-2 lg:order-1">
          <p className="text-xs font-semibold mb-2">Daftar Soal — {questions.length}</p>
          <NumberGrid items={gridItems} onSelect={setCur} />
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border rounded"></span> Belum</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Sudah</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span> Ragu</span>
          </div>
        </div>

        <div className="space-y-3 order-1 lg:order-2">
          <QuestionCard
            number={cur + 1}
            kategori={q.kategori}
            pertanyaan={q.pertanyaan}
            opsi={[
              { key: "A", text: q.opsi_a },
              { key: "B", text: q.opsi_b },
              { key: "C", text: q.opsi_c },
              { key: "D", text: q.opsi_d },
              { key: "E", text: q.opsi_e },
            ]}
            selected={answers[q.id] || undefined}
            onSelect={(k) => handleSelect(q.id, k)}
          />
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setCur((c) => Math.max(0, c - 1))} disabled={cur === 0} className="px-4 py-2 border rounded text-sm bg-white disabled:opacity-50">← Sebelumnya</button>
            <div className="flex gap-2">
              <button onClick={toggleRagu} className={`px-3 py-2 rounded text-sm border ${ragu[q.id] ? "bg-yellow-400 border-yellow-500" : "bg-white"}`}>{ragu[q.id] ? "★ Ragu" : "☆ Ragu"}</button>
              <button onClick={clearAnswer} className="px-3 py-2 rounded text-sm border bg-white">Hapus</button>
            </div>
            <button onClick={() => setCur((c) => Math.min(questions.length - 1, c + 1))} disabled={cur === questions.length - 1} className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50">Selanjutnya →</button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 h-fit lg:sticky lg:top-[68px] space-y-3 order-3">
          <p className="text-xs font-semibold">Info Latihan</p>
          <div className="text-xs space-y-1 text-zinc-600">
            <p>Terjawab: {terjawab}/{questions.length}</p>
            <p>Ragu: {Object.values(ragu).filter(Boolean).length}</p>
            <p>Belum: {questions.length - terjawab}</p>
          </div>
          <div className="pt-3 border-t">
            <p className="text-xs font-medium">Passing Grade</p>
            <p className="text-xs text-zinc-600 mt-1">TWK 65 • TIU 80 • TKP 166</p>
            <p className="text-xs text-zinc-400 mt-1">10 soal = skor proporsional, bukan 550.</p>
          </div>
        </div>
      </div>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yakin selesai latihan?</DialogTitle>
            <DialogDescription>Terjawab {terjawab}/{questions.length} • Ragu {Object.values(ragu).filter(Boolean).length}. Akan dinilai langsung + simpan ke latihan_sessions (jika ada).</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)} disabled={submitting}>Batal</Button>
            <Button onClick={doSubmit} disabled={submitting} className="bg-red-600 hover:bg-red-700">{submitting ? "Menilai..." : "Ya, Selesai & Nilai"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
