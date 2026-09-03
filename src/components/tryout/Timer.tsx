"use client";
import { useEffect, useRef, useState } from "react";

export function Timer({ deadlineAt, fallbackSeconds, seconds, onExpire }: { deadlineAt?: string | null; fallbackSeconds?: number; seconds?: number; onExpire?: () => void }) {
  const initialSeconds = fallbackSeconds ?? seconds ?? 6000;
  const [remain, setRemain] = useState(initialSeconds);
  const [mounted, setMounted] = useState(false);
  const expiredRef = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const calculate = () => {
      if (deadlineAt) {
        setRemain(Math.max(0, Math.ceil((new Date(deadlineAt).getTime() - Date.now()) / 1000)));
      } else {
        setRemain((current) => Math.max(0, current - 1));
      }
    };
    if (deadlineAt) calculate();
    const t = setInterval(calculate, 1000);
    return () => clearInterval(t);
  }, [deadlineAt]);
  useEffect(() => {
    if (remain <= 0 && deadlineAt && !expiredRef.current) {
      expiredRef.current = true;
      onExpire?.();
    }
  }, [remain, deadlineAt, onExpire]);

  if (!mounted) return <span className="font-mono font-bold text-lg">100:00</span>;
  const m = Math.floor(remain / 60);
  const s = remain % 60;
  const isRed = remain < 600;
  const isUrgent = remain < 60;
  return (
    <span className={`font-mono font-bold text-lg tabular-nums ${isUrgent ? "text-red-600 animate-pulse" : isRed ? "text-red-600" : "text-zinc-900 dark:text-white"}`}>
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}
