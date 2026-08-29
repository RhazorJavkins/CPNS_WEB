"use client";
export function QuestionCard({
  number,
  kategori,
  pertanyaan,
  opsi,
  selected,
  onSelect,
}: {
  number: number;
  kategori: string;
  pertanyaan: string;
  opsi: { key: string; text: string }[];
  selected?: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-2 text-xs mb-3">
        <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">{kategori}</span>
        <span className="text-zinc-500">Soal {number} / 110</span>
      </div>
      <p className="text-sm md:text-base leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{pertanyaan}</p>
      <div className="mt-5 space-y-2">
        {opsi.map((o) => (
          <label
            key={o.key}
            className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${selected === o.key ? "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700" : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
          >
            <input
              type="radio"
              name={`q-${number}`}
              value={o.key}
              checked={selected === o.key}
              onChange={() => onSelect(o.key)}
              className="mt-0.5"
            />
            <span className="font-semibold w-5 shrink-0">{o.key}.</span>
            <span className="flex-1">{o.text}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-zinc-400 mt-4">Pilih salah satu jawaban. TKP: semua opsi bernilai 1-5, pilih yang paling sesuai.</p>
    </div>
  );
}
