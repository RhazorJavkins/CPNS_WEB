import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]} return b; }

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { tryout_id } = await req.json();
  if (!tryout_id) return NextResponse.json({ error: "tryout_id required" }, { status: 400 });

  const { data: pkg } = await supabase.from("tryout_packages").select("*").eq("id", tryout_id).single();
  if (!pkg) return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });

  // cek ongoing
  const { data: ongoing } = await supabase.from("attempts").select("id").eq("user_id", user.id).eq("tryout_id", tryout_id).is("waktu_selesai", null).order("waktu_mulai", { ascending: false }).limit(1).maybeSingle();
  if (ongoing) {
    const { data: answers } = await supabase.from("attempt_answers").select("*, questions!inner(*)").eq("attempt_id", ongoing.id).order("urutan", { ascending: true });
    return NextResponse.json({ attempt_id: ongoing.id, existing: true, answers });
  }

  // jumlah per kategori
  let need: Record<string, number>;
  if (pkg.jumlah_soal === 30) need = { TWK: 10, TIU: 10, TKP: 10 };
  else need = { TWK: 30, TIU: 35, TKP: 45 }; // default 110

  // fetch & shuffle per kategori
  const allQ: any[] = [];
  for (const kat of ["TWK","TIU","TKP"] as const) {
    const { data } = await supabase.from("questions").select("*").eq("kategori", kat).limit(200);
    const sh = shuffle(data || []);
    allQ.push(...sh.slice(0, (need as any)[kat]));
  }
  const shuffled = shuffle(allQ);

  // buat attempt
  const isAkbarPkg = (pkg as any).is_tryout_akbar === true;
  const { data: attempt, error: err1 } = await supabase.from("attempts").insert({
    user_id: user.id,
    tryout_id: pkg.id,
    waktu_mulai: new Date().toISOString(),
    is_tryout_akbar: isAkbarPkg,
  }).select("id").single();
  if (err1 || !attempt) return NextResponse.json({ error: err1?.message || "Gagal buat attempt" }, { status: 500 });

  // buat attempt_answers
  const rows = shuffled.map((q, idx) => ({
    attempt_id: attempt.id,
    question_id: q.id,
    urutan: idx + 1,
    jawaban_user: null,
    is_ragu: false,
  }));
  const { error: err2 } = await supabase.from("attempt_answers").insert(rows);
  if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });

  const { data: answers } = await supabase.from("attempt_answers").select("*, questions!inner(*)").eq("attempt_id", attempt.id).order("urutan", { ascending: true });
  return NextResponse.json({ attempt_id: attempt.id, existing: false, answers, durasi_menit: pkg.durasi_menit });
}
