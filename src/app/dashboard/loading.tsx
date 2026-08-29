import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardHeader className="py-3 space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-6 w-12" /></CardHeader></Card>
          ))}
        </div>
        <Skeleton className="h-6 w-40" />
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardHeader className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></CardHeader><CardContent><Skeleton className="h-8 w-20" /></CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
