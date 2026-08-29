export const PG = { TWK: 65, TIU: 80, TKP: 166 } as const;
export type Kategori = "TWK" | "TIU" | "TKP";

export function skorSoal(q: { kategori: Kategori; kunci_jawaban: string; skor_tkp?: Record<string, number> | null }, jawab?: string | null): number {
  if (!jawab) return 0;
  if (q.kategori === "TKP") {
    if (!q.skor_tkp) return 0;
    return (q.skor_tkp as any)[jawab.toUpperCase()] ?? 0;
  }
  return jawab.toUpperCase() === q.kunci_jawaban.toUpperCase() ? 5 : 0;
}
export function hitungSkor(attemptAnswers: { kategori: Kategori; kunci_jawaban: string; skor_tkp?: any; jawaban_user?: string | null }[]) {
  let twk = 0, tiu = 0, tkp = 0;
  for (const a of attemptAnswers) {
    const s = skorSoal(a as any, a.jawaban_user ?? null);
    if (a.kategori === "TWK") twk += s;
    else if (a.kategori === "TIU") tiu += s;
    else tkp += s;
  }
  const total = twk + tiu + tkp;
  return {
    twk, tiu, tkp, total,
    status_twk: twk >= PG.TWK ? "LULUS" : "TIDAK LULUS",
    status_tiu: tiu >= PG.TIU ? "LULUS" : "TIDAK LULUS",
    status_tkp: tkp >= PG.TKP ? "LULUS" : "TIDAK LULUS",
    status_kelulusan: (twk >= PG.TWK && tiu >= PG.TIU && tkp >= PG.TKP) ? "LULUS SKD" as const : "TIDAK LULUS" as const,
  };
}
