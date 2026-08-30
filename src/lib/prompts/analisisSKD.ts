export const promptAnalisis = (data: {
  twk: number; tiu: number; tkp: number;
  benarTwk: number; benarTiu: number; rataTkp: number;
  salahList: { kategori: string; sub_materi: string; pertanyaan: string }[];
}) => `Kamu adalah Tutor CPNS expert (lulus SKD 450+). Analisis hasil tryout ini:

Data:
- Skor TWK: ${data.twk}/150 (Passing 65) - Benar ${data.benarTwk}/30
- Skor TIU: ${data.tiu}/175 (Passing 80) - Benar ${data.benarTiu}/35
- Skor TKP: ${data.tkp}/225 (Passing 166) - Rata ${data.rataTkp}
- Soal salah: ${JSON.stringify(data.salahList).slice(0, 4000)}

Tugas: Berikan JSON valid:
{
  "kelemahan": [
    {"area": "TWK - UUD 1945", "persentase_salah": "80%", "penjelasan": "2 kalimat kenapa lemah"},
    {"area": "TIU - Deret Angka", "persentase_salah": "60%", "penjelasan": "..."},
    {"area": "TKP - Pelayanan Publik", "persentase_salah": "50%", "penjelasan": "..."}
  ],
  "rencana_7_hari": [
    {"hari": 1, "fokus": "Pancasila", "aksi": "Kerjakan 20 soal + baca rangkuman", "target": "Skor 70+"},
    {"hari": 2, "fokus": "UUD 1945", "aksi": "...", "target": "..."},
    {"hari": 3, "fokus": "Deret Angka", "aksi": "...", "target": "..."},
    {"hari": 4, "fokus": "Silogisme", "aksi": "...", "target": "..."},
    {"hari": 5, "fokus": "TKP Pelayanan", "aksi": "...", "target": "..."},
    {"hari": 6, "fokus": "Tryout Mini 30 soal", "aksi": "...", "target": "..."},
    {"hari": 7, "fokus": "Review + Simulasi", "aksi": "...", "target": "..."}
  ],
  "motivasi": "1 kalimat penyemangat personal",
  "prediksi_lulus": "45% - Butuh +15 poin TKP, TWK sudah aman"
}
Jawab HANYA JSON, tanpa markdown, tanpa \`\`\`.`;
