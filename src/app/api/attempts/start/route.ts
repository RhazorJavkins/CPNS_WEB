import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RunnerQuestion = {
  id: string;
  kategori: string;
  formasi?: string | null;
  sub_materi: string | null;
  topik: string | null;
  level: string | null;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
};

const RUNNER_QUESTION_FIELDS = "id, kategori, formasi, sub_materi, topik, level, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e";
const RUNNER_ANSWER_FIELDS = "id, attempt_id, question_id, urutan, jawaban_user, is_ragu, questions!inner(id, kategori, formasi, sub_materi, topik, level, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e)";
const ATTEMPT_TIMER_FIELDS = "id, waktu_mulai, waktu_selesai";

function getDeadlineAt(waktuMulai: string, durasiMenit: number) {
  return new Date(new Date(waktuMulai).getTime() + durasiMenit * 60_000).toISOString();
}
function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]} return b; }

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { tryout_id } = await req.json();
  if (!tryout_id) return NextResponse.json({ error: "tryout_id required" }, { status: 400 });

  const { data: pkg } = await supabase.from("tryout_packages").select("id, judul, deskripsi, jumlah_soal, durasi_menit, is_active, is_tryout_akbar, akbar_start, akbar_end").eq("id", tryout_id).single();
  if (!pkg) return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });

  // 20.5 kuota tryout 1+1 max3 (15dtk) — premium bypass
  const { data: profTryout } = await supabase.from("profiles").select("is_premium, premium_until").eq("user_id", user.id).maybeSingle();
  const isPremiumTryout = profTryout?.is_premium && (!profTryout.premium_until || new Date(profTryout.premium_until).getTime() > Date.now());
  if (!isPremiumTryout) {
    const { getKuota } = await import("@/lib/kuota");
    const kuota = await getKuota(user.id, "tryout");
    if (!kuota.allowed) return NextResponse.json({ error: `Kuota tryout habis (${kuota.used}/${kuota.totalAllowed} hari ini). Nonton iklan 15 detik untuk +1 atau upgrade Premium.`, kuota }, { status: 429 });
  }

  // cek ongoing
  const { data: ongoing } = await supabase.from("attempts").select("id, waktu_mulai, waktu_selesai, durasi_menit, deadline_at").eq("user_id", user.id).eq("tryout_id", tryout_id).is("waktu_selesai", null).order("waktu_mulai", { ascending: false }).limit(1).maybeSingle();
  if (ongoing) {
    const deadlineAt = ongoing.deadline_at || getDeadlineAt(ongoing.waktu_mulai, ongoing.durasi_menit || pkg.durasi_menit || 100);
    const { data: answers } = await supabase.from("attempt_answers").select(RUNNER_ANSWER_FIELDS).eq("attempt_id", ongoing.id).order("urutan", { ascending: true });
    return NextResponse.json({ attempt_id: ongoing.id, existing: true, waktu_mulai: ongoing.waktu_mulai, durasi_menit: ongoing.durasi_menit || pkg.durasi_menit || 100, deadline_at: deadlineAt, answers });
  }

  const isSkbPackage = (pkg.judul || "").toUpperCase().includes("SKB");
  let orderedQuestions: RunnerQuestion[] = [];

  if (isSkbPackage) {
    const { data: packageRows, error: packageError } = await supabase
      .from("tryout_questions")
      .select(`question_id, urutan, questions!inner(${RUNNER_QUESTION_FIELDS})`)
      .eq("tryout_id", pkg.id)
      .order("urutan", { ascending: true })
      .limit(pkg.jumlah_soal || 100);
    if (packageError) return NextResponse.json({ error: packageError.message }, { status: 500 });
    orderedQuestions = (packageRows || []).map((row: any) => row.questions).filter(Boolean) as RunnerQuestion[];
  } else {
    const need = pkg.jumlah_soal === 30 ? { TWK: 10, TIU: 10, TKP: 10 } : { TWK: 30, TIU: 35, TKP: 45 };
    const allQ: RunnerQuestion[] = [];
    for (const kat of ["TWK", "TIU", "TKP"] as const) {
      const { data, error } = await supabase.from("questions").select(RUNNER_QUESTION_FIELDS).eq("kategori", kat).limit(200);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      allQ.push(...shuffle((data || []) as RunnerQuestion[]).slice(0, need[kat]));
    }
    // Keep section order: TWK 1-30, TIU 31-65, TKP 66-110.
    orderedQuestions = allQ;
  }

  const requiredQuestions = pkg.jumlah_soal || (isSkbPackage ? 100 : 110);
  if (orderedQuestions.length < requiredQuestions) {
    return NextResponse.json({ error: `Soal paket tidak cukup: tersedia ${orderedQuestions.length}, membutuhkan ${requiredQuestions}` }, { status: 409 });
  }

  // buat attempt
  const isAkbarPkg = (pkg as any).is_tryout_akbar === true;
  const waktuMulai = new Date();
  const durasiMenit = pkg.durasi_menit || 100;
  const { data: attempt, error: err1 } = await supabase.from("attempts").insert({
    user_id: user.id,
    tryout_id: pkg.id,
    waktu_mulai: waktuMulai.toISOString(),
    durasi_menit: durasiMenit,
    deadline_at: getDeadlineAt(waktuMulai.toISOString(), durasiMenit),
    is_tryout_akbar: isAkbarPkg,
  }).select("id").single();
  if (err1 || !attempt) return NextResponse.json({ error: err1?.message || "Gagal buat attempt" }, { status: 500 });

  // buat attempt_answers
  const rows = orderedQuestions.map((q, idx) => ({
    attempt_id: attempt.id,
    question_id: q.id,
    urutan: idx + 1,
    jawaban_user: null,
    is_ragu: false,
  }));
  const { error: err2 } = await supabase.from("attempt_answers").insert(rows);
  if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });

  const { data: answers } = await supabase.from("attempt_answers").select(RUNNER_ANSWER_FIELDS).eq("attempt_id", attempt.id).order("urutan", { ascending: true });
  const deadlineAt = getDeadlineAt(waktuMulai.toISOString(), durasiMenit);
  return NextResponse.json({ attempt_id: attempt.id, existing: false, waktu_mulai: waktuMulai.toISOString(), durasi_menit: durasiMenit, deadline_at: deadlineAt, answers });
}
