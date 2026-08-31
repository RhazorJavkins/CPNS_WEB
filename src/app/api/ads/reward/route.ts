import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Kuota config: freeBase + max via ads
const QUOTA: Record<string, { free: number; perAd: number; max: number; adSec: number }> = {
  tryout:   { free: 1, perAd: 1, max: 3, adSec: 15 },
  latihan:  { free: 3, perAd: 2, max: 9, adSec: 15 },
  analisis: { free: 1, perAd: 1, max: 2, adSec: 30 },
  chat:     { free: 5, perAd: 5, max: 20, adSec: 15 },
  generate: { free: 1, perAd: 1, max: 2, adSec: 30 },
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { jenis } = await req.json();
  if (!jenis || !QUOTA[jenis]) return NextResponse.json({ error: "jenis invalid (tryout|latihan|analisis|chat|generate)" }, { status: 400 });
  const cfg = QUOTA[jenis];

  // anti-spam: last reward < 30 detik?
  const { data: last } = await supabase.from("ad_rewards").select("rewarded_at").eq("user_id", user.id).order("rewarded_at", { ascending: false }).limit(1).maybeSingle();
  if (last?.rewarded_at) {
    const diff = Date.now() - new Date(last.rewarded_at).getTime();
    if (diff < 30000) return NextResponse.json({ error: `Tunggu ${Math.ceil((30000 - diff) / 1000)} detik lagi` }, { status: 429 });
  }

  // hitung rewards hari ini untuk jenis ini
  const today = new Date(); today.setHours(0,0,0,0);
  const { count: todayCount } = await supabase.from("ad_rewards").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("jenis", jenis).gte("rewarded_at", today.toISOString());
  const used = todayCount || 0;

  // hitung kuota saat ini: free + used (setiap reward nambah perAd, tapi max)
  // sederhananya: jika used >= (max - free)/perAd maka sudah max
  const maxRewards = Math.ceil((cfg.max - cfg.free) / cfg.perAd);
  if (used >= maxRewards) return NextResponse.json({ error: `Sudah max ${cfg.max}/hari untuk ${jenis}` }, { status: 403 });

  const { error } = await supabase.from("ad_rewards").insert({
    user_id: user.id,
    jenis,
    ad_provider: "dummy",
    durasi_detik: cfg.adSec,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sisaReward = maxRewards - (used + 1);
  const totalKuotaSekarang = cfg.free + (used + 1) * cfg.perAd;
  return NextResponse.json({ ok: true, jenis, rewarded: true, totalKuota: Math.min(totalKuotaSekarang, cfg.max), sisaReward, adSec: cfg.adSec });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const jenis = searchParams.get("jenis");
  if (jenis && QUOTA[jenis]) {
    const today = new Date(); today.setHours(0,0,0,0);
    const { count } = await supabase.from("ad_rewards").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("jenis", jenis).gte("rewarded_at", today.toISOString());
    const cfg = QUOTA[jenis];
    const maxRewards = Math.ceil((cfg.max - cfg.free) / cfg.perAd);
    return NextResponse.json({ jenis, used: count || 0, maxRewards, free: cfg.free, max: cfg.max, sisa: maxRewards - (count || 0) });
  }
  // all
  const today = new Date(); today.setHours(0,0,0,0);
  const { data } = await supabase.from("ad_rewards").select("jenis").eq("user_id", user.id).gte("rewarded_at", today.toISOString());
  const byJenis: Record<string, number> = {};
  for (const r of data || []) byJenis[r.jenis] = (byJenis[r.jenis] || 0) + 1;
  return NextResponse.json({ byJenis, quota: QUOTA });
}
