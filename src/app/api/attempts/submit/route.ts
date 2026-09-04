import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { attempt_id } = await req.json();
  if (!attempt_id) return NextResponse.json({ error: "attempt_id required" }, { status: 400 });

  const { data: att } = await supabase.from("attempts").select("id, user_id, waktu_selesai").eq("id", attempt_id).single();
  if (!att || att.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (att.waktu_selesai) return NextResponse.json({ ok: true, already: true, attempt: att });

  const { data: result, error: scoringError } = await supabase.rpc("finalize_attempt", {
    p_attempt_id: attempt_id,
    p_user_id: user.id,
  });
  if (scoringError) return NextResponse.json({ error: scoringError.message }, { status: 500 });
  if (result?.already) return NextResponse.json({ ok: true, already: true, result });

  // 16.4 XP +50 untuk tryout selesai
  try {
    const { data: prof } = await supabase.from("profiles").select("xp").eq("user_id", user.id).maybeSingle();
    if (prof) {
      await supabase.from("profiles").update({ xp: (prof.xp || 0) + 50 }).eq("user_id", user.id);
    } else {
      await supabase.from("profiles").insert({ user_id: user.id, nama_lengkap: user.email?.split("@")[0] || "User", xp: 50 } as any);
    }
  } catch {}

  return NextResponse.json({ ok: true, result });
}
