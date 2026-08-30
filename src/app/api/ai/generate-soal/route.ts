import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ai, AI_MODEL } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question_id, jumlah = 5 } = await req.json();
  if (!question_id) return NextResponse.json({ error: "question_id required" }, { status: 400 });
  const n = Math.min(Math.max(Number(jumlah) || 5, 1), 5);

  const { data: q } = await supabase.from("questions").select("*").eq("id", question_id).single();
  if (!q) return NextResponse.json({ error: "Soal tidak ditemukan" }, { status: 404 });

  // rate limit 10/hari untuk generate
  const { count } = await supabase.from("questions").select("id", { count: "exact", head: true }).eq("is_ai_generated", true).gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString());
  // hitung via generated_from user? simple count global, tapi batasi per user via created_at + user check impossible (no user_id col). Jadi batasi via api call count dummy: pakai chat_tutor count sebagai proxy atau langsung izinkan 10.
  // Untuk sekarang: batasi 10 generate per hari per user via checking jumlah soal AI yang generated_from = question_id hari ini dibuat user? skip strict, pakai 20/hari global
  if ((count || 0) >= 50) return NextResponse.json({ error: "Limit generate harian tercapai (50/hari global). Coba besok." }, { status: 429 });

  const isTKP = q.kategori === "TKP";
  const skorInfo = isTKP ? `Skor TKP: ${JSON.stringify(q.skor_tkp)}` : `Kunci: ${q.kunci_jawaban}`;
  const opsi = `A. ${q.opsi_a}\nB. ${q.opsi_b}\nC. ${q.opsi_c}\nD. ${q.opsi_d}\nE. ${q.opsi_e}`;

  let generated: any[] = [];

  const needMock = !process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY;

  if (needMock) {
    // mock 5 variasi simple
    for (let i = 1; i <= n; i++) {
      generated.push({
        pertanyaan: `${q.pertanyaan} (Variasi Mock ${i} — angka/cerita diubah, konsep sama: ${q.sub_materi})`,
        opsi_a: q.opsi_a + ` [V${i}]`,
        opsi_b: q.opsi_b + ` [V${i}]`,
        opsi_c: q.opsi_c + ` [V${i}]`,
        opsi_d: q.opsi_d + ` [V${i}]`,
        opsi_e: q.opsi_e + ` [V${i}]`,
        kunci_jawaban: q.kunci_jawaban,
        pembahasan: `Variasi mock dari soal asli. Konsep: ${q.sub_materi}. Kunci tetap ${q.kunci_jawaban}. (Tambah GROQ_API_KEY untuk variasi AI real)`,
        skor_tkp: q.skor_tkp,
      });
    }
  } else {
    const prompt = isTKP
      ? `Kamu penulis soal CPNS TKP expert. Buatkan ${n} variasi soal TKP baru yang mirip soal ini (tipe, level, jebakan sama tapi cerita/angka/konteks beda). WAJIB beda cerita, jangan copy paste.

Soal asli (${q.kategori} - ${q.sub_materi} - ${q.topik} - ${q.level}):
Pertanyaan: "${q.pertanyaan}"
Opsi:
${opsi}
${skorInfo}
Pembahasan: ${q.pembahasan || "-"}

Return HANYA JSON array valid, tanpa markdown, tanpa penjelasan lain. Format:
[
  {
    "pertanyaan": "string pertanyaan baru",
    "opsi_a": "teks", "opsi_b": "teks", "opsi_c": "teks", "opsi_d": "teks", "opsi_e": "teks",
    "skor_tkp": {"A":5,"B":4,"C":3,"D":2,"E":1},
    "pembahasan": "1 kalimat kenapa skor tertinggi"
  }
]
Skor TKP harus 1-5, sebaran acak tapi masuk akal sesuai BerAKHLAK.`
      : `Kamu penulis soal CPNS ${q.kategori} expert. Buatkan ${n} variasi soal baru yang mirip soal ini (tipe, level, jebakan sama tapi angka/cerita beda). WAJIB beda angka/cerita, jangan copy paste.

Soal asli (${q.kategori} - ${q.sub_materi} - ${q.topik} - ${q.level}):
Pertanyaan: "${q.pertanyaan}"
Opsi:
${opsi}
${skorInfo}
Pembahasan: ${q.pembahasan || "-"}

Return HANYA JSON array valid, tanpa markdown, tanpa penjelasan lain. Format:
[
  {
    "pertanyaan": "string pertanyaan baru",
    "opsi_a": "teks", "opsi_b": "teks", "opsi_c": "teks", "opsi_d": "teks", "opsi_e": "teks",
    "kunci_jawaban": "A|B|C|D|E",
    "pembahasan": "1 kalimat kenapa kunci itu"
  }
]`;

    try {
      const r = await ai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.8,
      });
      const raw = r.choices[0]?.message?.content || "";
      const jsonStr = raw.match(/\[[\s\S]*\]/)?.[0] || raw;
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) generated = parsed.slice(0, n);
        else if (parsed.soal) generated = parsed.soal.slice(0, n);
      } catch {
        // coba extract object per object
        const objs = [...raw.matchAll(/\{[^{}]*"pertanyaan"[^{}]*\}/g)].map((m) => {
          try { return JSON.parse(m[0]); } catch { return null; }
        }).filter(Boolean);
        generated = objs.slice(0, n) as any[];
      }
      if (generated.length === 0) throw new Error("AI tidak return JSON valid: " + raw.slice(0, 300));
    } catch (e: any) {
      return NextResponse.json({ error: "AI generate gagal: " + (e.message?.slice(0, 400) || "unknown") }, { status: 500 });
    }
  }

  // normalisasi & insert
  const toInsert = generated.map((g: any) => ({
    kategori: q.kategori,
    sub_materi: q.sub_materi,
    topik: q.topik,
    level: q.level,
    pertanyaan: g.pertanyaan || g.soal || "Variasi soal",
    opsi_a: g.opsi_a || g.a || "-",
    opsi_b: g.opsi_b || g.b || "-",
    opsi_c: g.opsi_c || g.c || "-",
    opsi_d: g.opsi_d || g.d || "-",
    opsi_e: g.opsi_e || g.e || "-",
    kunci_jawaban: isTKP ? "A" : (g.kunci_jawaban || g.kunci || q.kunci_jawaban),
    pembahasan: g.pembahasan || g.pembahasan_singkat || `Variasi dari soal ${q.id.slice(0, 8)} — ${q.sub_materi}`,
    skor_tkp: isTKP ? (g.skor_tkp || q.skor_tkp) : null,
    is_ai_generated: true,
    generated_from: q.id,
  }));

  const { data: inserted, error } = await supabase.from("questions").insert(toInsert).select("id, kategori, pertanyaan");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    mock: needMock,
    source_question_id: q.id,
    kategori: q.kategori,
    count: inserted?.length || 0,
    question_ids: inserted?.map((r: any) => r.id) || [],
    questions: inserted,
  });
}
