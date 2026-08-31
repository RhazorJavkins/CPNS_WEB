"use client";
import { useState } from "react";

export default function PricingCheckout() {
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function checkout(paket: "monthly" | "quarterly") {
    setLoading(paket); setMsg(null);
    const res = await fetch("/api/payment/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paket }) });
    const j = await res.json();
    setLoading(null);
    if (!res.ok) { setMsg(j.error || "Gagal"); return; }
    if (j.mock) {
      setMsg(`Mock order ${j.orderId} — set MIDTRANS_SERVER_KEY real untuk Snap. Coba webhook manual: POST /api/payment/webhook {order_id, transaction_status:"settlement"}`);
      // optional auto-call webhook mock for demo
      await fetch("/api/payment/webhook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order_id: j.orderId, transaction_status: "settlement", status_code: "200", gross_amount: paket==="monthly"?"49000":"99000", signature_key: "dummy" }) });
      setMsg((m) => (m || "") + " — Premium diaktifkan (mock)!");
      return;
    }
    // real Snap: load snap.js if not loaded
    const snapToken = j.snapToken;
    if ((window as any).snap) {
      (window as any).snap.pay(snapToken, {
        onSuccess: () => setMsg("Pembayaran sukses! Premium aktif."),
        onPending: () => setMsg("Menunggu pembayaran..."),
        onError: () => setMsg("Pembayaran gagal."),
        onClose: () => setMsg("Popup ditutup — selesaikan pembayaran."),
      });
    } else {
      // load script
      const s = document.createElement("script");
      s.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      s.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
      s.onload = () => (window as any).snap.pay(snapToken);
      document.body.appendChild(s);
      setMsg("Memuat Midtrans Snap...");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <button onClick={() => checkout("monthly")} disabled={!!loading} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{loading==="monthly"?"...":"Upgrade Premium Rp49k/bulan →"}</button>
        <button onClick={() => checkout("quarterly")} disabled={!!loading} className="w-full border bg-white dark:bg-zinc-900 rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50">{loading==="quarterly"?"...":"Paket Hemat Rp99k/3 bulan →"}</button>
      </div>
      {msg && <p className="text-xs text-center text-zinc-600 bg-zinc-50 dark:bg-zinc-900 border rounded p-2">{msg}</p>}
      <p className="text-xs text-center text-zinc-500">Bayar QRIS / VA / Gopay / Alfamart via Midtrans Sandbox. Mode dummy = tanpa kartu, auto-aktif untuk testing.</p>
    </div>
  );
}
