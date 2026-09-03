-- S2.2 timer snapshot: durasi efektif dan deadline server-authoritative.
alter table public.attempts
  add column if not exists durasi_menit integer,
  add column if not exists deadline_at timestamptz;

update public.attempts a
set durasi_menit = coalesce(a.durasi_menit, p.durasi_menit, 100),
    deadline_at = coalesce(
      a.deadline_at,
      a.waktu_mulai + make_interval(mins => coalesce(a.durasi_menit, p.durasi_menit, 100))
    )
from public.tryout_packages p
where a.tryout_id = p.id
  and (a.durasi_menit is null or a.deadline_at is null);

update public.attempts
set durasi_menit = coalesce(durasi_menit, 100),
    deadline_at = coalesce(deadline_at, waktu_mulai + make_interval(mins => coalesce(durasi_menit, 100)))
where durasi_menit is null or deadline_at is null;

alter table public.attempts
  alter column durasi_menit set default 100,
  alter column durasi_menit set not null,
  alter column deadline_at set not null;

alter table public.attempts
  add constraint attempts_durasi_menit_valid check (durasi_menit in (100, 130)),
  add constraint attempts_deadline_after_start check (deadline_at >= waktu_mulai);

create index if not exists idx_attempts_open_deadline
  on public.attempts (user_id, tryout_id, deadline_at)
  where waktu_selesai is null;
