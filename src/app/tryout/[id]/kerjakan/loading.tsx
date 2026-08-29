import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      <div className="h-14 bg-white border-b flex items-center px-4 gap-3">
        <Skeleton className="h-6 w-16" /><Skeleton className="h-6 w-20 mx-auto" /><Skeleton className="h-8 w-20" />
      </div>
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[260px_1fr_220px] gap-3 p-3 flex-1">
        <div className="hidden lg:block bg-white border rounded-lg p-3 space-y-2"><Skeleton className="h-4 w-24" /><div className="grid grid-cols-5 gap-1.5">{Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div></div>
        <div className="bg-white border rounded-lg p-6 space-y-3"><Skeleton className="h-4 w-16" /><Skeleton className="h-20 w-full" /><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div></div>
        <div className="hidden lg:block bg-white border rounded-lg p-3 space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
      </div>
      <p className="text-center text-xs text-zinc-400 py-2">Memuat soal acak dari Supabase...</p>
    </div>
  );
}
