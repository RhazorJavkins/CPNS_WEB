-- S2.5 RLS attempt_answers owner-only
-- Pastikan hanya pemilik attempt yang bisa akses jawaban via Supabase RLS (API sudah guard, RLS sebagai lapis kedua)

alter table public.attempt_answers enable row level security;

drop policy if exists "attempt_answers_owner_select" on public.attempt_answers;
create policy "attempt_answers_owner_select" on public.attempt_answers
  for select to authenticated
  using (attempt_id in (select id from public.attempts where user_id = auth.uid()));

drop policy if exists "attempt_answers_owner_update" on public.attempt_answers;
create policy "attempt_answers_owner_update" on public.attempt_answers
  for update to authenticated
  using (attempt_id in (select id from public.attempts where user_id = auth.uid()))
  with check (attempt_id in (select id from public.attempts where user_id = auth.uid()));

drop policy if exists "attempt_answers_owner_insert" on public.attempt_answers;
create policy "attempt_answers_owner_insert" on public.attempt_answers
  for insert to authenticated
  with check (attempt_id in (select id from public.attempts where user_id = auth.uid()));

drop policy if exists "attempt_answers_owner_delete" on public.attempt_answers;
create policy "attempt_answers_owner_delete" on public.attempt_answers
  for delete to authenticated
  using (attempt_id in (select id from public.attempts where user_id = auth.uid()));
