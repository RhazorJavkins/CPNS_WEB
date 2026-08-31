import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["rhezarachmat_mkt", "rhezarachmat", "rhazorjavkins"]; // substring match

function isAdmin(email: string | undefined) {
  if (!email) return false;
  const e = email.toLowerCase();
  return ADMIN_EMAILS.some((a) => e.includes(a.toLowerCase()));
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email || "")) return NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 });
  const body = await req.json();
  const { judul, deskripsi, jumlah_soal, durasi_menit, akbar_start, akbar_end, is_tryout_akbar } = body;
  if (!judul) return NextResponse.json({ error: "judul required" }, { status: 400 });
  const row: any = {
    judul,
    deskripsi: deskripsi || null,
    jumlah_soal: Number(jumlah_soal) || 110,
    durasi_menit: Number(durasi_menit) || 100,
    is_active: true,
  };
  // optional akbar fields (if columns exist)
  if (is_tryout_akbar) row.is_tryout_akbar = true;
  if (akbar_start) row.akbar_start = new Date(akbar_start).toISOString();
  if (akbar_end) row.akbar_end = new Date(akbar_end).toISOString();

  const { data, error } = await supabase.from("tryout_packages").insert(row).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email || "")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data } = await supabase.from("tryout_packages").select("id, judul, is_tryout_akbar, akbar_start, akbar_end, jumlah_soal, durasi_menit, created_at").order("created_at", { ascending: false }).limit(20);
  return NextResponse.json({ data });
}
