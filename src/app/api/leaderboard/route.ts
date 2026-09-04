import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 15;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "nasional"; // nasional | provinsi | instansi
  const periode = searchParams.get("periode") || "all_time"; // minggu_ini | all_time
  const provinsi = searchParams.get("provinsi");
  const instansi = searchParams.get("instansi");
  const isAkbar = searchParams.get("akbar") === "true";

  // ambil attempts best per user
  let query = supabase.from("attempts").select("user_id, skor_total, skor_twk, skor_tiu, skor_tkp, status_kelulusan, created_at, is_tryout_akbar").not("status_kelulusan", "is", null).order("skor_total", { ascending: false }).limit(500);

  if (periode === "minggu_ini") {
    const start = new Date();
    const day = start.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1 - day); // Monday
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    query = query.gte("created_at", start.toISOString());
  }
  if (isAkbar) query = query.eq("is_tryout_akbar", true);

  const { data: attempts, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // deduplicate: simpan skor terbaik per user
  const bestByUser = new Map<string, any>();
  for (const a of attempts || []) {
    if (!bestByUser.has(a.user_id)) bestByUser.set(a.user_id, a);
  }
  let list = Array.from(bestByUser.values());

  // fetch profiles untuk filter & display
  const userIds = list.map((a) => a.user_id);
  let profilesMap = new Map<string, any>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("user_id, nama_lengkap, provinsi, instansi_target, avatar_url, xp").in("user_id", userIds);
    for (const p of profiles || []) profilesMap.set(p.user_id, p);
  }

  // filter provinsi/instansi
  if (filter === "provinsi" && provinsi) {
    list = list.filter((a) => profilesMap.get(a.user_id)?.provinsi === provinsi);
  }
  if (filter === "instansi" && instansi) {
    list = list.filter((a) => profilesMap.get(a.user_id)?.instansi_target === instansi);
  }

  // enrich + sort lagi
  let enriched = list.map((a, idx) => {
    const p = profilesMap.get(a.user_id);
    return {
      rank: idx + 1, // sementara, nanti re-sort
      user_id: a.user_id,
      nama: p?.nama_lengkap || `User ${a.user_id.slice(0, 6)}`,
      provinsi: p?.provinsi || "-",
      instansi: p?.instansi_target || "-",
      avatar_url: p?.avatar_url || null,
      xp: p?.xp || 0,
      skor_total: a.skor_total,
      skor_twk: a.skor_twk,
      skor_tiu: a.skor_tiu,
      skor_tkp: a.skor_tkp,
      status: a.status_kelulusan,
      created_at: a.created_at,
    };
  }).sort((a, b) => (b.skor_total || 0) - (a.skor_total || 0)).map((r, i) => ({ ...r, rank: i + 1 })).slice(0, 100);

  // posisi kamu — hanya jika ada auth, biar anonymous bisa HIT cache
  let myRank: number | null = null;
  let isPersonal = false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isPersonal = true;
      const idx = enriched.findIndex((r) => r.user_id === user.id);
      if (idx >= 0) myRank = idx + 1;
      else {
        const me = bestByUser.get(user.id);
        if (me) {
          const higher = enriched.filter((r) => (r.skor_total || 0) > (me.skor_total || 0)).length;
          myRank = higher + 1;
        }
      }
    }
  } catch {}

  const cacheHeaders = isPersonal
    ? { "Cache-Control": "private, no-store" }
    : { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" };
  return NextResponse.json({ filter, periode, count: enriched.length, myRank, data: enriched }, { headers: cacheHeaders });
}
