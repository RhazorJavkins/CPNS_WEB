import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import TutorChat from "@/components/ai/TutorChat";

export default async function PembahasanPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ filter?: string }> }) {
  const { id } = await params;
  const { filter } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: attempt } = await supabase.from("attempts").select("*").eq("id", id).single();
  if (!attempt) notFound();
  if (attempt.user_id !== user.id) redirect("/dashboard");

  let query = supabase.from("attempt_answers").select("*, questions!inner(*)").eq("attempt_id", id).order("urutan", { ascending: true, nullsFirst: true }).order("created_at", { ascending: true });
  const { data: rows } = await query;
  if (!rows) notFound();

  let filtered = rows as any[];
  if (filter === "salah") filtered = filtered.filter((r: any) => {
    const q = r.questions;
    if (q.kategori === "TKP") return (r.skor_didapat ?? 0) < 5;
    return !r.is_benar;
  });
  else if (filter === "TWK" || filter === "TIU" || filter === "TKP") filtered = filtered.filter((r: any) => r.questions.kategori === filter);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <Link href={`/tryout/result/${id}`} className="text-sm text-zinc-600 hover:text-zinc-900">← Hasil</Link>
          <div className="flex items-center gap-1 text-xs">
            <Link href={`/tryout/result/${id}/pembahasan`} className={`px-2 py-1 rounded ${!filter ? "bg-blue-600 text-white" : "border"}`}>Semua ({rows.length})</Link>
            <Link href={`?filter=salah`} className={`px-2 py-1 rounded ${filter==="salah" ? "bg-blue-600 text-white" : "border"}`}>Salah</Link>
            <Link href={`?filter=TWK`} className={`px-2 py-1 rounded ${filter==="TWK" ? "bg-blue-600 text-white" : "border"}`}>TWK</Link>
            <Link href={`?filter=TIU`} className={`px-2 py-1 rounded ${filter==="TIU" ? "bg-blue-600 text-white" : "border"}`}>TIU</Link>
            <Link href={`?filter=TKP`} className={`px-2 py-1 rounded ${filter==="TKP" ? "bg-blue-600 text-white" : "border"}`}>TKP</Link>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Pembahasan — {filtered.length} soal{filter ? ` (filter: ${filter})` : ""}</h1>
          <span className="text-xs text-zinc-500">{attempt.skor_total}/550 • {attempt.status_kelulusan}</span>
        </div>
        {filtered.map((r: any, idx: number) => {
          const q = r.questions;
          const opsi: { k: string; t: string }[] = [
            { k: "A", t: q.opsi_a }, { k: "B", t: q.opsi_b }, { k: "C", t: q.opsi_c }, { k: "D", t: q.opsi_d }, { k: "E", t: q.opsi_e },
          ];
          const isTKP = q.kategori === "TKP";
          const isBenar = isTKP ? (r.skor_didapat === 5) : !!r.is_benar;
          return (
            <div key={r.id} className={`bg-white dark:bg-zinc-900 border rounded-lg p-4 ${isBenar ? "border-green-200" : "border-red-200"}`}>
              <div className="flex items-center gap-2 text-xs mb-2">
                <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">{idx + 1}. {q.kategori} • {q.sub_materi}</span>
                <span className={`px-2 py-1 rounded ${isBenar ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{isBenar ? "✓ Benar" : "✗ Salah"} • Skor {r.skor_didapat ?? 0}{isTKP ? "/5" : ""}</span>
                {r.is_ragu && <span className="px-1 py-1 rounded bg-yellow-100 text-yellow-700">Ragu</span>}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{q.pertanyaan}</p>
              <div className="mt-3 space-y-1">
                {opsi.map((o) => {
                  const isKunci = !isTKP && o.k === q.kunci_jawaban;
                  const isJawab = o.k === r.jawaban_user;
                  const skorTKP = isTKP ? q.skor_tkp?.[o.k] : null;
                  let cls = "border-zinc-200";
                  if (isKunci) cls = "bg-green-50 border-green-300 dark:bg-green-950";
                  if (isJawab && !isBenar) cls = "bg-red-50 border-red-300 dark:bg-red-950";
                  if (isJawab && isBenar) cls = "bg-green-50 border-green-400";
                  return (
                    <div key={o.k} className={`flex gap-2 p-2 rounded border text-sm ${cls}`}>
                      <span className="font-semibold w-6">{o.k}.</span>
                      <span className="flex-1">{o.t}</span>
                      {isTKP && <span className="text-xs text-zinc-500">({skorTKP} poin)</span>}
                      {isKunci && !isTKP && <span className="text-xs text-green-700">✓ Kunci</span>}
                      {isJawab && <span className="text-xs font-medium">← Jawabanmu</span>}
                    </div>
                  );
                })}
              </div>
              {!r.jawaban_user && <p className="text-xs text-zinc-500 mt-2">Tidak dijawab</p>}
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                <p className="font-medium text-xs">Pembahasan:</p>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">{q.pembahasan || "—"}</p>
                {isTKP && <p className="text-xs text-zinc-500 mt-1">TKP: skor tertinggi (5) adalah jawaban paling profesional/proaktif sesuai nilai ASN BerAKHLAK.</p>}
              </div>
              <TutorChat questionId={q.id} />
            </div>
          );
        })}
        <div className="flex gap-2">
          <Link href={`/tryout/result/${id}`} className="flex-1 text-center bg-white border rounded-lg py-2 text-sm">← Kembali Hasil</Link>
          <Link href="/dashboard" className="flex-1 text-center bg-blue-600 text-white rounded-lg py-2 text-sm">Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
