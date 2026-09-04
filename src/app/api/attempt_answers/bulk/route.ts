import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey, rateLimitHeaders } from "@/lib/rate-limit";

type BulkItem = { question_id: string; jawaban_user: string | null; is_ragu?: boolean };

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  {
    const rl = rateLimit(getClientKey(req, user.id) + ":bulk", 30, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Terlalu banyak sync, tunggu sebentar." }, { status: 429, headers: { ...rateLimitHeaders(rl.remaining, rl.resetAt, 30), "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } });
  }

  const body = await req.json().catch(() => null);
  const attempt_id: string | undefined = body?.attempt_id;
  const answers: BulkItem[] | undefined = body?.answers;

  if (!attempt_id || !Array.isArray(answers)) {
    return NextResponse.json({ error: "attempt_id & answers[] required" }, { status: 400 });
  }
  if (answers.length === 0) return NextResponse.json({ ok: true, updated: 0 });
  if (answers.length > 110) return NextResponse.json({ error: "Too many answers" }, { status: 400 });

  // verify owner
  const { data: att } = await supabase
    .from("attempts")
    .select("id, user_id, waktu_selesai")
    .eq("id", attempt_id)
    .single();
  if (!att || att.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (att.waktu_selesai) return NextResponse.json({ error: "Sudah selesai" }, { status: 400 });

  // validate items
  for (const a of answers) {
    if (!a.question_id || typeof a.question_id !== "string") {
      return NextResponse.json({ error: "question_id required" }, { status: 400 });
    }
    if (a.jawaban_user !== null && a.jawaban_user !== undefined && !["A", "B", "C", "D", "E"].includes(a.jawaban_user)) {
      return NextResponse.json({ error: "jawaban_user invalid" }, { status: 400 });
    }
  }

  // server-side batch update (1 HTTP -> N row updates)
  // Use Promise.all with limited concurrency
  const chunks: BulkItem[][] = [];
  for (let i = 0; i < answers.length; i += 20) chunks.push(answers.slice(i, i + 20));

  let updated = 0;
  for (const chunk of chunks) {
    const results = await Promise.all(
      chunk.map((a) =>
        supabase
          .from("attempt_answers")
          .update({ jawaban_user: a.jawaban_user ?? null, is_ragu: !!a.is_ragu })
          .eq("attempt_id", attempt_id)
          .eq("question_id", a.question_id)
      )
    );
    for (const r of results) {
      if (r.error) return NextResponse.json({ error: r.error.message }, { status: 500 });
      updated++;
    }
  }

  return NextResponse.json({ ok: true, updated });
}
