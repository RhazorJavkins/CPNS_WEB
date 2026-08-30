"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Point = {
  name: string;
  twk: number;
  tiu: number;
  tkp: number;
  total: number;
};

export default function ProgressChart({ data }: { data: Point[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-zinc-500 border border-dashed rounded-xl bg-zinc-50 dark:bg-zinc-900">
        Belum ada data — kerjakan tryout dulu untuk lihat grafik
      </div>
    );
  }
  if (data.length === 1) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-zinc-500 border border-dashed rounded-xl bg-zinc-50 dark:bg-zinc-900">
        Perlu minimal 2 percobaan untuk lihat progress (sekarang 1)
      </div>
    );
  }
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 550]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={65} stroke="#3b82f6" strokeDasharray="6 3" label={{ value: "PG TWK 65", fontSize: 10, fill: "#3b82f6" }} />
          <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="6 3" label={{ value: "PG TIU 80", fontSize: 10, fill: "#22c55e" }} />
          <ReferenceLine y={166} stroke="#f97316" strokeDasharray="6 3" label={{ value: "PG TKP 166", fontSize: 10, fill: "#f97316" }} />
          <Line type="monotone" dataKey="twk" name="TWK" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="tiu" name="TIU" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="tkp" name="TKP" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="total" name="Total" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="0" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
