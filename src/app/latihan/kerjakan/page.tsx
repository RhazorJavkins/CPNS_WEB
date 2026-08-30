import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LatihanRunner from "@/components/latihan/LatihanRunner";

export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string; n?: string; ids?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const sp = await searchParams;
  // jika ada ids (dari generate soal mirip), pakai mode custom ids
  if (sp.ids) {
    const ids = sp.ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10);
    if (ids.length > 0) return <LatihanRunner mode="custom" n={ids.length} ids={ids} />;
  }
  const mode = (sp.mode || "campur").toLowerCase();
  const n = Math.min(Math.max(parseInt(sp.n || "10", 10) || 10, 5), 20);
  const allowed = ["campur", "twk", "tiu", "tkp", "salah"];
  const m = allowed.includes(mode) ? mode : "campur";
  return <LatihanRunner mode={m} n={n} />;
}
