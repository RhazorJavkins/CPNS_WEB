import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hitungSkor } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { attempt_id } = await req.json();
  if (!attempt_id) return NextResponse.json({ error: "attempt_id required" }, { status: 400 });

  const { data: att } = await supabase.from("attempts").select("*").eq("id", attempt_id).single();
  if (!att || att.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (att.waktu_selesai) return NextResponse.json({ ok: true, already: true, attempt: att });

  const { data: answers } = await supabase.from("attempt_answers").select("*, questions!inner(kategori,kunci_jawaban,skor_tkp)").eq("attempt_id", attempt_id);
  if (!answers) return NextResponse.json({ error: "No answers" }, { status: 400 });

  const mapped = answers.map((a: any) => ({
    kategori: a.questions.kategori as any,
    kunci_jawaban: a.questions.kunci_jawaban,
    skor_tkp: a.questions.skor_tkp,
    jawaban_user: a.jawaban_user,
  }));
  const s = hitungSkor(mapped as any);

  // update attempt_answers skor per soal
  for (const a of answers as any[]) {
    const q = a.questions;
    let skor = 0;
    let benar = false;
    if (a.jawaban_user) {
      if (q.kategori === "TKP") skor = (q.skor_tkp?.[a.jawaban_user] ?? 0);
      else { skor = a.jawaban_user === q.kunci_jawaban ? 5 : 0; benar = skor === 5; }
    }
    await supabase.from("attempt_answers").update({ skor_didapat: skor, is_benar: q.kategori !== "TKP" ? benar : null }).eq("id", a.id);
  }

  const now = new Date().toISOString();
  const mulai = new Date(att.waktu_mulai).getTime();
  const durasi = Math.floor((Date.now() - mulai) / 1000);
  const { data: updated, error } = await supabase.from("attempts").update({
    waktu_selesai: now,
    durasi_pengerjaan: durasi,
    skor_twk: s.twk,
    skor_tiu: s.tiu,
    skor_tkp: s.tkp,
    skor_total: s.total,
    status_twk: s.status_twk,
    status_tiu: s.status_tiu,
    status_tkp: s.status_tkp,
    status_kelulusan: s.status_kelulusan,
  }).eq("id", attempt_id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, attempt: updated, skor: s });
}
