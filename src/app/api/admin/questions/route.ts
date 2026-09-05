import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["rhezarachmat_mkt", "rhezarachmat", "rhazorjavkins"];
function isAdmin(email?: string) { if (!email) return false; const e=email.toLowerCase(); return ADMIN_EMAILS.some(a=>e.includes(a)); }

function check(req: NextRequest, userEmail?: string) {
  if (!isAdmin(userEmail)) return NextResponse.json({ error:"Forbidden - admin only"}, { status:403});
  return null;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data:{user}} = await supabase.auth.getUser();
  const err = check(req, user?.email||"");
  if (err) return err;
  const url = new URL(req.url);
  const action = url.searchParams.get("action")||"stats";
  if (action==="stats") {
    const [{count: qCount}, {count: attCount}, {data: subs}, {data: ads}, {count: aiCount}] = await Promise.all([
      supabase.from("questions").select("id",{count:"exact", head:true}),
      supabase.from("attempts").select("id",{count:"exact", head:true}),
      supabase.from("subscriptions").select("id, paket, status").eq("status","active"),
      supabase.from("ad_rewards").select("id").gte("rewarded_at", new Date(Date.now()-24*3600*1000).toISOString()),
      supabase.from("ai_reviews").select("id",{count:"exact", head:true}),
    ]);
    const revenue = (subs||[]).length*49000; // dummy estimate
    return NextResponse.json({ qCount, attCount, subsCount: (subs||[]).length, revenue, adsToday: (ads||[]).length, aiCount });
  }
  if (action==="questions") {
    const page = parseInt(url.searchParams.get("page")||"1");
    const limit = Math.min(50, parseInt(url.searchParams.get("limit")||"20"));
    const from = (page-1)*limit;
    const kategori = url.searchParams.get("kategori");
    const level = url.searchParams.get("level");
    const sub = url.searchParams.get("sub_materi");
    const q = url.searchParams.get("q");
    let query = supabase.from("questions").select("id, kategori, sub_materi, topik, level, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, kunci_jawaban, pembahasan, skor_tkp, created_at",{count:"exact"});
    if (kategori && kategori!=="all") query = query.eq("kategori", kategori);
    if (level && level!=="all") query = query.eq("level", level);
    if (sub) query = query.ilike("sub_materi", `%${sub}%`);
    if (q) query = query.ilike("pertanyaan", `%${q}%`);
    const { data, count, error } = await query.order("created_at",{ascending:false}).range(from, from+limit-1);
    if (error) return NextResponse.json({ error: error.message}, { status:500});
    return NextResponse.json({ data, count, page, limit });
  }
  if (action==="ai_log") {
    const { data } = await supabase.from("ai_reviews").select("id, attempt_id, created_at").order("created_at",{ascending:false}).limit(20);
    return NextResponse.json({ data });
  }
  return NextResponse.json({ error:"unknown action"}, { status:400});
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data:{user}} = await supabase.auth.getUser();
  const err = check(req, user?.email||"");
  if (err) return err;
  const body = await req.json();
  // body: { kategori, sub_materi, pertanyaan, opsi_a,b,c,d,e, kunci_jawaban, pembahasan, skor_tkp? }
  const required = ["kategori","pertanyaan","opsi_a","opsi_b","opsi_c","opsi_d","kunci_jawaban"];
  for (const k of required) if (!body[k]) return NextResponse.json({ error:`Field ${k} wajib`}, { status:400});
  if (!["TWK","TIU","TKP"].includes(body.kategori)) return NextResponse.json({ error:"kategori harus TWK/TIU/TKP"}, { status:400});
  const payload:any = {
    kategori: body.kategori,
    sub_materi: body.sub_materi||null,
    pertanyaan: body.pertanyaan,
    opsi_a: body.opsi_a,
    opsi_b: body.opsi_b,
    opsi_c: body.opsi_c,
    opsi_d: body.opsi_d,
    opsi_e: body.opsi_e||null,
    kunci_jawaban: body.kunci_jawaban.toUpperCase(),
    pembahasan: body.pembahasan||null,
    skor_tkp: body.kategori==="TKP" ? (body.skor_tkp||null) : null,
  };
  // opsi_e only for TKP maybe but allow
  const { data, error } = await supabase.from("questions").insert(payload).select("id").single();
  if (error) return NextResponse.json({ error: error.message}, { status:500});
  return NextResponse.json({ ok:true, id: data.id });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data:{user}} = await supabase.auth.getUser();
  const err = check(req, user?.email||"");
  if (err) return err;
  const body = await req.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error:"id wajib"}, { status:400});
  const { error } = await supabase.from("questions").update(rest).eq("id", id);
  if (error) return NextResponse.json({ error: error.message}, { status:500});
  return NextResponse.json({ ok:true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data:{user}} = await supabase.auth.getUser();
  const err = check(req, user?.email||"");
  if (err) return err;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error:"id wajib"}, { status:400});
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message}, { status:500});
  return NextResponse.json({ ok:true });
}
