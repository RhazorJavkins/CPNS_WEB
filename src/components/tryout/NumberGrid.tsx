"use client";
export type GridItem = { index: number; answered: boolean; flagged: boolean; current: boolean };
export function NumberGrid({ items, onSelect }: { items: GridItem[]; onSelect: (idx: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {items.map((it) => {
        let cls = "bg-white border-zinc-200 hover:bg-zinc-50"; // belum
        if (it.current) cls = "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300";
        else if (it.flagged) cls = "bg-yellow-400 text-zinc-900 border-yellow-500";
        else if (it.answered) cls = "bg-green-500 text-white border-green-600";
        return (
          <button
            key={it.index}
            onClick={() => onSelect(it.index)}
            className={`h-8 text-xs font-medium rounded border flex items-center justify-center transition ${cls}`}
          >
            {it.index + 1}
          </button>
        );
      })}
    </div>
  );
}
