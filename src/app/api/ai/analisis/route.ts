import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ai, AI_MODEL } from "@/lib/ai";
import { promptAnalisis } from "@/lib/prompts/analisisSKD";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 20.5 kuota: analisis 1+1 max2 (dummy 30dtk) — premium bypass
  const { data: prof } = await supabase.from("profiles").select("is_premium, premium_until").eq("user_id", user.id).maybeSingle();
  const isPremium = prof?.is_premium && (!prof.premium_until || new Date(prof.premium_until).getTime() > Date.now());
  if (!isPremium) {
    const { getKuota } = await import("@/lib/kuota");
    const kuota = await getKuota(user.id, "analisis");
    if (!kuota.allowed) return NextResponse.json({ error: `Kuota analisis habis (${kuota.used}/${kuota.totalAllowed} hari ini). Nonton iklan 30 detik untuk +1 atau upgrade Premium.`, kuota }, { status: 429 });
  }

  const { attempt_id } = await req.json();
  if (!attempt_id) return NextResponse.json({ error: "attempt_id required" }, { status: 400 });

  // cache: if already exists return it
  const { data: cached } = await supabase.from("ai_reviews").select("id, attempt_id, user_id, kelemahan, rencana_7_hari, motivasi, prediksi_lulus, raw_response, created_at").eq("attempt_id", attempt_id).maybeSingle();
  if (cached) return NextResponse.json({ cached: true, data: cached });

  // rate limit: max 5 per user per day (simple) — deprecated, now handled by kuota 1+1 max2 above

  const { data: attempt } = await supabase.from("attempts").select("id, user_id, skor_twk, skor_tiu, skor_tkp, skor_total, status_kelulusan").eq("id", attempt_id).single();
  if (!attempt || attempt.user_id !== user.id) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });

  const { data: answers } = await supabase.from("attempt_answers").select("id, is_benar, skor_didapat, questions!inner(kategori, sub_materi, pertanyaan)").eq("attempt_id", attempt_id);
  if (!answers) return NextResponse.json({ error: "No answers" }, { status: 404 });

  const benarTwk = answers.filter(a => (a as any).questions.kategori === "TWK" && a.is_benar).length;
  const benarTiu = answers.filter(a => (a as any).questions.kategori === "TIU" && a.is_benar).length;
  const tkpScores = answers.filter(a => (a as any).questions.kategori === "TKP").map(a => a.skor_didapat || 0);
  const rataTkp = tkpScores.length ? (tkpScores.reduce((s,v)=>s+v,0)/tkpScores.length).toFixed(1) : "0";

  const salahList = answers.filter(a => !a.is_benar).slice(0, 15).map(a => {
    const q = (a as any).questions;
    return { kategori: q.kategori, sub_materi: q.sub_materi, pertanyaan: q.pertanyaan.slice(0, 120) };
  });

  const prompt = promptAnalisis({
    twk: attempt.skor_twk || 0, tiu: attempt.skor_tiu || 0, tkp: attempt.skor_tkp || 0,
    benarTwk, benarTiu, rataTkp: Number(rataTkp),
    salahList,
  });

  if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
    // mock fallback if no key
    const mock = {
      kelemahan: [
        { area: "TIU - Deret Angka", persentase_salah: "70%", penjelasan: "Sering salah pola +n bertingkat. Butuh latihan trik cepat." },
        { area: "TWK - UUD 1945", persentase_salah: "60%", penjelasan: "Hafalan pasal kurang. Fokus pasal 27-34." },
        { area: "TKP - Pelayanan Publik", persentase_salah: "50%", penjelasan: "Jawaban cenderung netral, kurang berorientasi pelayanan." },
      ],
      rencana_7_hari: [
        { hari: 1, fokus: "Deret Angka", aksi: "20 soal deret + video trik", target: "Benar 15/20" },
        { hari: 2, fokus: "UUD 1945", aksi: "Baca rangkuman pasal + 15 soal", target: "Skor TWK 70+" },
        { hari: 3, fokus: "Silogisme", aksi: "15 soal silogisme", target: "Benar 80%" },
        { hari: 4, fokus: "TKP Pelayanan", aksi: "20 soal TKP + review BerAKHLAK", target: "Rata 4.2+" },
        { hari: 5, fokus: "Pancasila", aksi: "15 soal HOTS", target: "Benar 12/15" },
        { hari: 6, fokus: "Tryout Mini 30 soal", aksi: "Simulasi 30m", target: "Skor 320+" },
        { hari: 7, fokus: "Review + Simulasi penuh 110 soal", aksi: "Full tryout", target: "LULUS 3 komponen" },
      ],
      motivasi: "Progresmu sudah bagus — 1 minggu fokus bisa naik 40 poin!",
      prediksi_lulus: attempt.status_kelulusan === "LULUS SKD" ? "75% - Pertahankan, jangan lengah di TKP" : "45% - Butuh +15 TKP & +20 TIU",
    };
    const { data: saved } = await supabase.from("ai_reviews").insert({
      attempt_id, user_id: user.id,
      kelemahan: mock.kelemahan, rencana_7_hari: mock.rencana_7_hari,
      motivasi: mock.motivasi, prediksi_lulus: mock.prediksi_lulus, raw_response: JSON.stringify(mock),
    }).select().single();
    return NextResponse.json({ cached: false, mock: true, data: saved || mock });
  }

  try {
    const res = await ai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200,
    });
    const raw = res.choices[0]?.message?.content || "";
    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0] || raw;
    let parsed: any;
    try { parsed = JSON.parse(jsonStr); } catch { parsed = { raw }; }

    const kelemahan = parsed.kelemahan || [];
    const rencana = parsed.rencana_7_hari || parsed.rencana || [];
    const motivasi = parsed.motivasi || "";
    const prediksi = parsed.prediksi_lulus || parsed.prediksi || "";

    const { data: saved, error } = await supabase.from("ai_reviews").insert({
      attempt_id, user_id: user.id,
      kelemahan, rencana_7_hari: rencana,
      motivasi, prediksi_lulus: prediksi, raw_response: raw,
    }).select().single();
    if (error) throw error;
    return NextResponse.json({ cached: false, data: saved, usage: (res as any).usage });
  } catch (e: any) {
    return NextResponse.json({ error: e.message?.slice(0, 400) || "AI error" }, { status: 500 });
  }
}
