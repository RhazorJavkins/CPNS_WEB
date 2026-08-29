# CPNS Web - Simulasi CAT BKN 1:1

Latihan CPNS gratis mirip CAT BKN asli. Bank soal 300+ TWK TIU TKP, timer 100 menit, passing grade real TWK65 TIU80 TKP166.

**Live:** https://cpns-web-coral.vercel.app
**Stack:** Next.js 16.3 + Tailwind 4 + Supabase (ap-northeast-2) + Vercel

## Cara run lokal
```bash
cd cpns-web
npm install
# buat .env.local
# NEXT_PUBLIC_SUPABASE_URL=https://tdnwqshktvlxpamdjodv.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
npm run dev # http://localhost:3000
```

## Import soal
```bash
python scripts/import_soal.py # baca data/*.csv -> Supabase questions (300)
```

## Akun dummy
- test.1787998017451@gmail.com / Demo1234!

## Fase 1 DONE 75% (39/52) -> update di FASE_1_CHECKLIST.md
