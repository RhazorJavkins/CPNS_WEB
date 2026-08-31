import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getSnap, isMockMode } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { paket } = await req.json(); // monthly | quarterly
  const p = paket === "quarterly" ? "quarterly" : "monthly";
  const gross = p === "monthly" ? 49000 : 99000;
  const orderId = `CPNS-${p}-${user.id.slice(0,8)}-${Date.now()}`;

  // simpan pending subscription dulu
  await supabase.from("subscriptions").insert({
    user_id: user.id,
    paket: p,
    status: "pending",
    midtrans_order_id: orderId,
    midtrans_status: "pending",
  });

  // mock mode: return dummy token
  if (isMockMode()) {
    return NextResponse.json({ mock: true, orderId, snapToken: `MOCK-${orderId}`, message: "Midtrans dummy — set MIDTRANS_SERVER_KEY real untuk Snap asli" });
  }

  try {
    const snap = getSnap();
    if (!snap) throw new Error("Snap not configured");
    const param = {
      transaction_details: { order_id: orderId, gross_amount: gross },
      customer_details: { email: user.email || "user@cpns.web", first_name: user.email?.split("@")[0] || "CPNS User" },
      item_details: [{ id: p, price: gross, quantity: 1, name: p === "monthly" ? "Premium 1 Bulan" : "Premium 3 Bulan" }],
    };
    const token = await (snap as any).createTransactionToken(param);
    return NextResponse.json({ mock: false, orderId, snapToken: token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Midtrans error", orderId }, { status: 500 });
  }
}
