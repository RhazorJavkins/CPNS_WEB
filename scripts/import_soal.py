#!/usr/bin/env python3
"""
Import 300 soal TWK/TIU/TKP dari CSV ke Supabase
Usage: python scripts/import_soal.py
- Baca data/soal_sampel/TWK_100.csv, TIU_100.csv, TKP_100.csv
- Insert batch 25 via Supabase REST (publishable key)
- Verifikasi count
"""
import csv
import json
import os
import sys
from pathlib import Path

# Config
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://tdnwqshktvlxpamdjodv.supabase.co")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or "sb_publishable_-exSmZK1WOy3k5bIJ7n8lw_cTL_LJW4"

# Try supabase-py if available, else fallback to httpx
try:
    from supabase import create_client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False
    import http.client
    import urllib.request
    import urllib.error

BASE_DIR = Path(__file__).resolve().parent.parent  # cpns-web/
DATA_DIR = BASE_DIR.parent / "data" / "soal_sampel"  # CPNS_Web/data/soal_sampel
# Also support running from CPNS_Web root
if not DATA_DIR.exists():
    DATA_DIR = Path("C:/Users/ifedu/OneDrive/Documents/CPNS_Web/data/soal_sampel")

FILES = ["TWK_100.csv", "TIU_100.csv", "TKP_100.csv"]

def load_csv(path):
    rows = []
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, r in enumerate(reader, 1):
            # Clean
            kategori = r.get("kategori","").strip()
            if not kategori:
                print(f"  Skip row {i} empty kategori")
                continue
            # skor_tkp: if empty -> None, else parse JSON (handle double-quoted JSON in CSV)
            skor_raw = r.get("skor_tkp","").strip()
            skor = None
            if skor_raw:
                try:
                    # CSV may have """" escaping -> csv reader already unescaped to {"A":5...}
                    # If still string with single quotes, try json loads
                    skor = json.loads(skor_raw)
                except:
                    # Try replace '' with ""
                    try:
                        skor = json.loads(skor_raw.replace("'", '"'))
                    except Exception as e:
                        print(f"  Warn row {i} skor_tkp parse fail: {skor_raw[:60]} -> {e}")
                        skor = None
            row = {
                "kategori": kategori,
                "sub_materi": r.get("sub_materi","").strip(),
                "topik": r.get("topik","").strip() or None,
                "level": r.get("level","").strip().lower() or "sedang",
                "pertanyaan": r.get("pertanyaan","").strip(),
                "opsi_a": r.get("opsi_a","").strip(),
                "opsi_b": r.get("opsi_b","").strip(),
                "opsi_c": r.get("opsi_c","").strip(),
                "opsi_d": r.get("opsi_d","").strip(),
                "opsi_e": r.get("opsi_e","").strip(),
                "kunci_jawaban": r.get("kunci_jawaban","").strip().upper(),
                "pembahasan": r.get("pembahasan","").strip(),
                "skor_tkp": skor
            }
            # Validate
            if not row["pertanyaan"] or not row["kunci_jawaban"]:
                print(f"  Skip row {i} missing pertanyaan/kunci")
                continue
            rows.append(row)
    return rows

def insert_batch(supabase, rows, batch=25):
    total = 0
    errors = 0
    for i in range(0, len(rows), batch):
        chunk = rows[i:i+batch]
        try:
            # supabase-py expects list of dicts
            res = supabase.table("questions").insert(chunk).execute()
            inserted = len(res.data) if res.data else 0
            total += inserted
            print(f"  Batch {i//batch+1}: {inserted}/{len(chunk)} OK")
            if res.data is None and hasattr(res, 'error') and res.error:
                print(f"    Error: {res.error}")
        except Exception as e:
            print(f"  Batch {i//batch+1} FAIL: {e}")
            errors += 1
            # Try one-by-one to find bad row
            for r in chunk:
                try:
                    supabase.table("questions").insert(r).execute()
                    total += 1
                except Exception as e2:
                    print(f"    Row fail {r['kategori']}/{r['sub_materi']}: {e2}")
                    errors += 1
    return total, errors

def main():
    print("=== Import Soal CPNS ke Supabase ===")
    print(f"URL: {SUPABASE_URL}")
    print(f"DATA_DIR: {DATA_DIR}")
    if not DATA_DIR.exists():
        print(f"ERROR: DATA_DIR not found: {DATA_DIR}")
        sys.exit(1)
    
    all_rows = []
    for fname in FILES:
        path = DATA_DIR / fname
        if not path.exists():
            print(f"SKIP {fname} not found")
            continue
        print(f"\nLoad {fname}...")
        rows = load_csv(path)
        print(f"  Loaded {len(rows)} rows from {fname}")
        # Preview 1st row
        if rows:
            print(f"  Sample: [{rows[0]['kategori']}/{rows[0]['sub_materi']}] {rows[0]['pertanyaan'][:80]}... Kunci={rows[0]['kunci_jawaban']}")
        all_rows.extend(rows)
    
    print(f"\nTotal rows to insert: {len(all_rows)} (TWK+TIU+TKP)")
    if not all_rows:
        print("No rows to insert. Check CSVs.")
        sys.exit(1)
    
    # Connect
    if HAS_SUPABASE:
        print("\nUsing supabase-py...")
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    else:
        print("\n supabase-py not found, installing...")
        os.system("pip install supabase >nul 2>&1")
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Optional: clear existing? No, append. Uncomment to truncate:
    # supabase.table("questions").delete().neq("id","00000000-0000-0000-0000-000000000000").execute()
    
    # Insert
    print("\nInserting...")
    inserted, errs = insert_batch(supabase, all_rows, batch=25)
    print(f"\nDone: inserted {inserted}/{len(all_rows)}, errors {errs}")
    
    # Verify
    try:
        res = supabase.table("questions").select("kategori, count", count="exact").execute()
        # Count per kategori via RPC or separate queries
        for kat in ["TWK","TIU","TKP"]:
            r = supabase.table("questions").select("id", count="exact").eq("kategori", kat).execute()
            print(f"  {kat}: {r.count} rows")
        total = supabase.table("questions").select("id", count="exact").execute()
        print(f"  TOTAL: {total.count} rows in DB")
    except Exception as e:
        print(f"Verify fail: {e}")

if __name__ == "__main__":
    main()
