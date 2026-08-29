"use client";
import { useEffect, useState, useCallback } from "react";
import { Timer } from "@/components/tryout/Timer";
import { NumberGrid } from "@/components/tryout/NumberGrid";
import { QuestionCard } from "@/components/tryout/QuestionCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Q = { id: string; kategori: string; pertanyaan: string; opsi_a: string; opsi_b: string; opsi_c: string; opsi_d: string; opsi_e: string; };
type Ans = { id: string; question_id: string; jawaban_user: string | null; is_ragu: boolean; questions: Q };

export default function KerjakanRealPage({ tryoutId }: { tryoutId: string }) {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Ans[]>([]);
  const [cur, setCur] = useState(0);
  const [durasi, setDurasi] = useState(6000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // start attempt
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const res = await fetch("/api/attempts/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tryout_id: tryoutId }) });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Gagal mulai");
        if (cancelled) return;
        setAttemptId(j.attempt_id);
        setAnswers(j.answers || []);
        if (j.durasi_menit) setDurasi(j.durasi_menit * 60);
        else setDurasi(6000);
        // hitung sisa waktu dari waktu_mulai jika existing — untuk Batch 2 simple pakai durasi penuh
      } catch (e: any) { setErr(e.message); } finally { setLoading(false); }
    }
    start();
    return () => { cancelled = true; };
  }, [tryoutId]);

  const upsert = useCallback(async (question_id: string, jawaban_user: string | null, is_ragu: boolean) => {
    if (!attemptId) return;
    setSaving(true);
    try {
      await fetch("/api/attempt_answers/upsert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attempt_id: attemptId, question_id, jawaban_user, is_ragu }) });
    } finally { setSaving(false); }
  }, [attemptId]);

  // auto-save tiap ganti jawaban sudah via upsert langsung; tidak perlu poll 10 detik untuk Batch 2 (langsung save)

  const handleSelect = (key: string) => {
    const a = answers[cur];
    if (!a) return;
    const next = [...answers];
    next[cur] = { ...a, jawaban_user: key };
    setAnswers(next);
    upsert(a.question_id, key, !!a.is_ragu);
  };
  const toggleRagu = () => {
    const a = answers[cur];
    if (!a) return;
    const next = [...answers];
    const newRagu = !a.is_ragu;
    next[cur] = { ...a, is_ragu: newRagu };
    setAnswers(next);
    upsert(a.question_id, a.jawaban_user, newRagu);
  };
  const clearAnswer = () => {
    const a = answers[cur];
    if (!a) return;
    const next = [...answers];
    next[cur] = { ...a, jawaban_user: null };
    setAnswers(next);
    upsert(a.question_id, null, !!a.is_ragu);
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    const res = await fetch("/api/attempts/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attempt_id: attemptId }) });
    const j = await res.json();
    if (!res.ok) { alert(j.error); setSubmitting(false); return; }
    router.push(`/tryout/result/${attemptId}`);
  };

  const handleExpire = async () => {
    if (!attemptId) return;
    await fetch("/api/attempts/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attempt_id: attemptId }) });
    alert("Waktu habis — otomatis submit!");
    router.push(`/tryout/result/${attemptId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      <div className="h-14 bg-white border-b flex items-center px-4 gap-3"><div className="h-6 w-16 bg-zinc-200 animate-pulse rounded" /><div className="flex-1 h-6 w-20 bg-zinc-200 animate-pulse rounded mx-auto max-w-[120px]" /><div className="h-8 w-20 bg-zinc-200 animate-pulse rounded" /></div>
      <div className="max-w-6xl mx-auto w-full p-6 text-center space-y-3">
        <div className="h-4 w-48 bg-zinc-200 animate-pulse rounded mx-auto" />
        <div className="h-3 w-64 bg-zinc-200 animate-pulse rounded mx-auto" />
        <p className="text-sm text-zinc-500">Memuat soal acak dari Supabase (300 soal → 110 acak)...</p>
        <p className="text-xs text-zinc-400">Jika lama &gt;5 detik, Supabase ap-northeast-2 mungkin lambat — refresh.</p>
      </div>
    </div>
  );
  if (err) return <div className="min-h-screen flex items-center justify-center flex-col gap-3 p-6"><p className="text-sm text-red-600 text-center">{err}</p><p className="text-xs text-zinc-500">Cek koneksi Supabase atau Vercel env. Rate limit? Tunggu 1 jam.</p><div className="flex gap-2"><button onClick={() => location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Coba Lagi</button><Link href="/dashboard" className="px-4 py-2 border rounded text-sm bg-white">← Dashboard</Link></div></div>;
  if (answers.length === 0) return <div className="min-h-screen flex items-center justify-center text-sm">Tidak ada soal. Cek DB questions.</div>;

  const a = answers[cur];
  const q = a.questions;
  const gridItems = answers.map((ans, idx) => ({ index: idx, answered: !!ans.jawaban_user, flagged: !!ans.is_ragu, current: idx === cur }));
  const terjawab = answers.filter((x) => !!x.jawaban_user).length;
  const ragu = answers.filter((x) => !!x.is_ragu).length;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
      <header className="h-14 bg-white dark:bg-zinc-900 border-b flex items-center px-3 md:px-4 gap-2 sticky top-0 z-10">
        <Link href="/dashboard" className="text-xs border rounded px-2 py-1 hover:bg-zinc-50 hidden sm:inline">Keluar</Link>
        <button onClick={() => setShowGrid(!showGrid)} className="lg:hidden text-xs border rounded px-2 py-1 bg-white">☰ Soal</button>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          <span className="text-xs text-zinc-500 hidden md:inline">Sisa Waktu</span>
          <Timer seconds={durasi} onExpire={handleExpire} />
          {saving && <span className="text-xs text-zinc-400 hidden sm:inline">Menyimpan...</span>}
        </div>
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded whitespace-nowrap">Soal {cur + 1}/{answers.length}</span>
        <button onClick={() => setOpenConfirm(true)} className="text-xs bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1.5 font-medium whitespace-nowrap">Selesai</button>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[260px_1fr_220px] gap-3 p-3">
        <div className={`${showGrid ? "block" : "hidden"} lg:block bg-white dark:bg-zinc-900 border rounded-lg p-3 h-fit lg:sticky lg:top-[68px] order-2 lg:order-1`}>
          <p className="text-xs font-semibold mb-2">Daftar Soal — {answers.length}</p>
          <NumberGrid items={gridItems} onSelect={setCur} />
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border rounded"></span> Belum</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Sudah</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span> Ragu</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded"></span> Aktif</span>
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
            selected={a.jawaban_user || undefined}
            onSelect={handleSelect}
          />
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setCur((c) => Math.max(0, c - 1))} disabled={cur === 0} className="px-4 py-2 border rounded text-sm bg-white disabled:opacity-50">← Sebelumnya</button>
            <div className="flex gap-2">
              <button onClick={toggleRagu} className={`px-3 py-2 rounded text-sm border ${a.is_ragu ? "bg-yellow-400 border-yellow-500" : "bg-white"}`}>{a.is_ragu ? "★ Ragu-ragu" : "☆ Tandai Ragu"}</button>
              <button onClick={clearAnswer} className="px-3 py-2 rounded text-sm border bg-white">Hapus Jawaban</button>
            </div>
            <button onClick={() => setCur((c) => Math.min(answers.length - 1, c + 1))} disabled={cur === answers.length - 1} className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50">Selanjutnya →</button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 h-fit lg:sticky lg:top-[68px] space-y-3 order-3">
          <p className="text-xs font-semibold">Info Ujian</p>
          <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
            <p>Terjawab: {terjawab}/{answers.length}</p>
            <p>Ragu-ragu: {ragu}</p>
            <p>Belum: {answers.length - terjawab}</p>
          </div>
          <div className="pt-3 border-t">
            <p className="text-xs font-medium">Passing Grade</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">TWK 65 • TIU 80 • TKP 166</p>
          </div>
          <p className="text-xs text-zinc-400">Attempt: {attemptId?.slice(0, 8)}... • Auto-save langsung tiap klik</p>
        </div>
      </div>
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yakin akhiri ujian?</DialogTitle>
            <DialogDescription>
              Terjawab {answers.filter((x) => !!x.jawaban_user).length}/{answers.length} • Ragu {answers.filter((x) => !!x.is_ragu).length} • Belum {answers.length - answers.filter((x) => !!x.jawaban_user).length}. Jawaban akan dinilai dan tidak bisa diubah lagi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)} disabled={submitting}>Batal</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-red-600 hover:bg-red-700">{submitting ? "Menilai..." : "Ya, Selesai & Nilai"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
