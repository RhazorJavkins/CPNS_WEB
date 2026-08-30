"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RadarPoint = {
  subject: string;
  value: number; // 0-100 %
  fullMark?: number;
};

export default function RadarKelemahan({ data }: { data: RadarPoint[] }) {
  const hasData = data && data.some((d) => d.value > 0);
  if (!hasData) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-zinc-500 border border-dashed rounded-xl bg-zinc-50 dark:bg-zinc-900">
        Belum ada data per materi — kerjakan tryout dulu
      </div>
    );
  }
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={90}>
          <PolarGrid stroke="#e4e4e7" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#71717a" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
          <Radar name="% Benar" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.45} />
          <Tooltip formatter={(v: any) => [`${v}%`, "% Benar"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
