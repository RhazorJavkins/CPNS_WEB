import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Masuk CPNS Web</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Simulasi CAT BKN — skor langsung</p>
        </div>
        <form action={loginAction} className="bg-white dark:bg-zinc-900 border rounded-lg p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input name="email" type="email" required placeholder="kamu@email.com" className="mt-1 w-full border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input name="password" type="password" required placeholder="••••••••" className="mt-1 w-full border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm font-medium">Masuk</button>
          <p className="text-xs text-center text-zinc-600">Belum punya akun? <a href="/register" className="text-blue-600 underline">Daftar gratis</a></p>
          <p className="text-xs text-center"><a href="/" className="text-zinc-500 underline">← Kembali ke Beranda</a></p>
        </form>
        <p className="text-xs text-center text-zinc-400 mt-4">Auth via Supabase • ap-northeast-2</p>
      </div>
    </div>
  );
}

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Redirect with error via query - simple
    const { redirect } = await import("next/navigation");
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  const { redirect } = await import("next/navigation");
  redirect("/dashboard");
}
