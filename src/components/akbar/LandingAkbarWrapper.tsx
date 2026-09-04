"use client";
import { useEffect, useState } from "react";
import AkbarCountdown from "./AkbarCountdown";

export default function LandingAkbarWrapper() {
  const [akbar, setAkbar] = useState<any>(null);
  const [mode, setMode] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/akbar/next").then((r) => r.json()).then((j) => { if (j.akbar) { setAkbar(j.akbar); setMode(j.mode); } }).catch(() => {});
  }, []);
  if (!akbar || !akbar.akbar_start || !akbar.akbar_end) return null;
  return <AkbarCountdown start={akbar.akbar_start} end={akbar.akbar_end} tryoutId={akbar.id} judul={akbar.judul} />;
}
