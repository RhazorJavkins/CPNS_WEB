import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ai, AI_MODEL } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { question_id, pesan_user } = await req.json();
  if (!question_id || !pesan_user?.trim()) return NextResponse.json({ error: "question_id & pesan_user required" }, { status: 400 });

  const { data: q } = await supabase.from("questions").select("*").eq("id", question_id).single();
  if (!q) return NextResponse.json({ error: "Soal tidak ditemukan" }, { status: 404 });

  // rate limit simple: 20/hari
  const { count } = await supabase.from("chat_tutor").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", new Date(Date.now()-24*3600*1000).toISOString());
  if ((count||0) >= 30) return NextResponse.json({ error: "Limit 30 tanya/hari tercapai" }, { status: 429 });

  const opsi = `A. ${q.opsi_a}\nB. ${q.opsi_b}\nC. ${q.opsi_c}\nD. ${q.opsi_d}\nE. ${q.opsi_e}`;
  const skorInfo = q.kategori === "TKP" ? `Skor TKP: ${JSON.stringify(q.skor_tkp)} (5 tertinggi)` : `Kunci: ${q.kunci_jawaban}`;
  const prompt = `Kamu tutor CPNS ramah, ahli SKD. Jawab singkat max 150 kata, jelaskan KONSEP bukan cuma kunci, pakai Bahasa Indonesia.\n\nSoal (${q.kategori} - ${q.sub_materi}): ${q.pertanyaan}\nOpsi:\n${opsi}\n${skorInfo}\nPembahasan: ${q.pembahasan || "-"}\n\nUser tanya: "${pesan_user}"\nJawab jelas, kasih tips jika relevan.`;

  let jawaban_ai = "";
  if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
    jawaban_ai = `**Mock Tutor (tambah GROQ_API_KEY biar real):**\n\nUntuk soal ini, kunci ${q.kategori==="TKP"?"tertinggi adalah opsi dengan skor 5 (paling BerAKHLAK/proaktif)":`adalah ${q.kunci_jawaban}`}. Tips: baca pembahasan, pahami konsep ${q.sub_materi}, lalu coba variasi soal serupa. Tanya lagi yang spesifik ya!`;
  } else {
    try {
      const r = await ai.chat.completions.create({ model: AI_MODEL, messages: [{ role:"user", content: prompt }], max_tokens: 400, temperature: 0.7 });
      jawaban_ai = r.choices[0]?.message?.content?.trim() || "Maaf, AI belum bisa jawab. Coba lagi.";
    } catch (e:any) { return NextResponse.json({ error: e.message?.slice(0,300) }, { status: 500 }); }
  }

  await supabase.from("chat_tutor").insert({ user_id: user.id, question_id, pesan_user, jawaban_ai });
  return NextResponse.json({ jawaban_ai });
}
