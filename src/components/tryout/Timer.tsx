"use client";
import { useEffect, useState } from "react";

export function Timer({ seconds = 6000, onExpire }: { seconds?: number; onExpire?: () => void }) {
  const [remain, setRemain] = useState(seconds);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (remain <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setRemain((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remain, onExpire]);
  if (!mounted) return <span className="font-mono font-bold text-lg">100:00</span>;
  const m = Math.floor(remain / 60);
  const s = remain % 60;
  const isRed = remain < 600; // <10 menit
  const isUrgent = remain < 60;
  return (
    <span className={`font-mono font-bold text-lg tabular-nums ${isUrgent ? "text-red-600 animate-pulse" : isRed ? "text-red-600" : "text-zinc-900 dark:text-white"}`}>
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}
