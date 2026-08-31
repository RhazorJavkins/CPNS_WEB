import { createClient } from "@/lib/supabase/server";

const QUOTA: Record<string, { free: number; perAd: number; max: number }> = {
  tryout:   { free: 1, perAd: 1, max: 3 },
  latihan:  { free: 3, perAd: 2, max: 9 },
  analisis: { free: 1, perAd: 1, max: 2 },
  chat:     { free: 5, perAd: 5, max: 20 },
  generate: { free: 1, perAd: 1, max: 2 },
};

export async function getKuota(userId: string, jenis: string) {
  const supabase = await createClient();
  const cfg = QUOTA[jenis];
  if (!cfg) return { allowed: false, reason: "jenis invalid" };
  const today = new Date(); today.setHours(0,0,0,0);
  // hitung usage hari ini tergantung jenis (pakai tabel masing-masing)
  let used = 0;
  if (jenis === "latihan") {
    const { count } = await supabase.from("latihan_sessions").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString());
    used = count || 0;
  } else if (jenis === "tryout") {
    const { count } = await supabase.from("attempts").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString());
    used = count || 0;
  } else if (jenis === "analisis") {
    const { count } = await supabase.from("ai_reviews").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString());
    used = count || 0;
  } else if (jenis === "generate") {
    const { count } = await supabase.from("questions").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString());
    used = count || 0;
  } else if (jenis === "chat") {
    const { count } = await supabase.from("chat_tutor").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString());
    used = count || 0;
  }
  // rewards hari ini
  const { count: rewards } = await supabase.from("ad_rewards").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("jenis", jenis).gte("rewarded_at", today.toISOString());
  const extra = (rewards || 0) * cfg.perAd;
  const totalAllowed = Math.min(cfg.free + extra, cfg.max);
  const remaining = totalAllowed - used;
  return { allowed: remaining > 0, used, rewards: rewards || 0, totalAllowed, remaining: Math.max(0, remaining), free: cfg.free, max: cfg.max, perAd: cfg.perAd };
}

export function quotaConfig(jenis: string) { return QUOTA[jenis] || null; }
