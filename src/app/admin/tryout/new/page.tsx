import Link from "next/link";
import NewTryoutForm from "./NewTryoutForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
const ADMIN_EMAILS = ["rhezarachmat_mkt", "rhezarachmat", "rhazorjavkins"];
function isAdmin(e?: string) { return !!e && ADMIN_EMAILS.some((a) => e.toLowerCase().includes(a)); }
export default async function AdminNewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.email || "")) redirect("/admin");
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b"><div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between"><Link href="/admin" className="text-sm">← Admin</Link><span className="text-xs bg-red-600 text-white px-2 py-1 rounded">ADMIN</span></div></header>
      <main className="max-w-5xl mx-auto px-4 py-6"><NewTryoutForm /></main>
    </div>
  );
}
