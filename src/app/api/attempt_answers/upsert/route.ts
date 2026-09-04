import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey, rateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  {
    const rl = rateLimit(getClientKey(req, user.id) + ":upsert", 60, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Terlalu banyak update jawaban." }, { status: 429, headers: { ...rateLimitHeaders(rl.remaining, rl.resetAt, 60), "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } });
  }
  const { attempt_id, question_id, jawaban_user, is_ragu } = await req.json();
  if (!attempt_id || !question_id) return NextResponse.json({ error: "attempt_id & question_id required" }, { status: 400 });
  // verify owner
  const { data: att } = await supabase.from("attempts").select("id,user_id,waktu_selesai").eq("id", attempt_id).single();
  if (!att || att.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (att.waktu_selesai) return NextResponse.json({ error: "Sudah selesai" }, { status: 400 });

  const { error } = await supabase.from("attempt_answers").update({
    jawaban_user: jawaban_user ?? null,
    is_ragu: !!is_ragu,
  }).eq("attempt_id", attempt_id).eq("question_id", question_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
