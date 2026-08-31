import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// webhook dari Midtrans — pakai service role key bila ada, fallback anon
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, transaction_status, gross_amount, signature_key } = body;
  if (!order_id) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  // verifikasi signature (SHA512 order_id+status_code+gross_amount+serverKey)
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  if (serverKey && !serverKey.startsWith("dummy") && body.signature_key) {
    const expected = crypto.createHash("sha512").update(`${order_id}${body.status_code}${gross_amount}${serverKey}`).digest("hex");
    if (expected !== signature_key) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const supabase = getServiceClient();

  // status mapping
  let newStatus: string = "pending";
  if (transaction_status === "capture" || transaction_status === "settlement") newStatus = "active";
  else if (transaction_status === "expire" || transaction_status === "cancel" || transaction_status === "deny") newStatus = "expired";

  // update subscription
  const { data: sub } = await supabase.from("subscriptions").select("id, user_id, paket").eq("midtrans_order_id", order_id).maybeSingle();
  if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

  const now = new Date();
  const months = sub.paket === "quarterly" ? 3 : 1;
  const endDate = new Date(now); endDate.setMonth(endDate.getMonth() + months);

  await supabase.from("subscriptions").update({
    status: newStatus,
    midtrans_status: transaction_status,
    start_date: newStatus === "active" ? now.toISOString() : null,
    end_date: newStatus === "active" ? endDate.toISOString() : null,
  }).eq("midtrans_order_id", order_id);

  if (newStatus === "active") {
    await supabase.from("profiles").update({
      is_premium: true,
      premium_until: endDate.toISOString(),
    }).eq("user_id", sub.user_id);
    // fallback upsert bila profile belum ada
    const { data: prof } = await supabase.from("profiles").select("user_id").eq("user_id", sub.user_id).maybeSingle();
    if (!prof) {
      await supabase.from("profiles").upsert({ user_id: sub.user_id, is_premium: true, premium_until: endDate.toISOString() });
    }
  }

  return NextResponse.json({ ok: true, status: newStatus });
}
