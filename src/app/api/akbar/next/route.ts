import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  // cari akbar berikutnya (start >= now, order start asc) atau yang live/terakhir
  try {
    const { data, error } = await supabase
      .from("tryout_packages")
      .select("id, judul, deskripsi, jumlah_soal, durasi_menit, is_tryout_akbar, akbar_start, akbar_end")
      .eq("is_tryout_akbar", true)
      .order("akbar_start", { ascending: true })
      .limit(5);
    if (error) throw error;
    const now = Date.now();
    // prefer: live dulu, lalu next upcoming, lalu last ended
    const live = data?.find((p: any) => p.akbar_start && p.akbar_end && new Date(p.akbar_start).getTime() <= now && now <= new Date(p.akbar_end).getTime());
    if (live) return NextResponse.json({ mode: "live", akbar: live });
    const next = data?.find((p: any) => p.akbar_start && new Date(p.akbar_start).getTime() > now);
    if (next) return NextResponse.json({ mode: "upcoming", akbar: next });
    if (data && data.length > 0) return NextResponse.json({ mode: "ended", akbar: data[data.length - 1] });
    return NextResponse.json({ akbar: null });
  } catch (e: any) {
    return NextResponse.json({ akbar: null, error: e.message });
  }
}
