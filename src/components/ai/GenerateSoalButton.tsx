"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateSoalButton({ questionId, kategori }: { questionId: string; kategori?: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const handle = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/ai/generate-soal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id: questionId, jumlah: 5 }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal generate");
      const ids: string[] = j.question_ids || [];
      if (ids.length === 0) throw new Error("Tidak ada soal terbuat");
      // arahkan ke latihan dengan ids spesifik
      router.push(`/latihan/kerjakan?ids=${ids.join(",")}`);
    } catch (e: any) {
      setErr(e.message?.slice(0, 200) || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        onClick={handle}
        disabled={loading}
        className="text-xs border rounded px-3 py-1.5 bg-white hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-1"
        title="Buat 5 soal mirip dengan AI"
      >
        {loading ? "⏳ Membuat 5 soal..." : "🔄 Buatkan 5 Soal Mirip"}
      </button>
      {err && <span className="text-xs text-red-600">{err}</span>}
    </div>
  );
}
