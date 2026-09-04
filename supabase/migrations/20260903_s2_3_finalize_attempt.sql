-- S2.3: transactional bulk scoring and atomic attempt finalization.
create or replace function public.finalize_attempt(
  p_attempt_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_attempt public.attempts%rowtype;
  v_twk integer := 0;
  v_tiu integer := 0;
  v_tkp integer := 0;
  v_total integer := 0;
  v_now timestamptz := now();
  v_deadline timestamptz;
begin
  select * into v_attempt
  from public.attempts
  where id = p_attempt_id and user_id = p_user_id
  for update;

  if not found then
    raise exception 'attempt_not_found';
  end if;

  if v_attempt.waktu_selesai is not null then
    return jsonb_build_object('already', true, 'attempt_id', v_attempt.id, 'waktu_selesai', v_attempt.waktu_selesai);
  end if;

  v_deadline := coalesce(v_attempt.deadline_at, v_attempt.waktu_mulai + make_interval(mins => coalesce(v_attempt.durasi_menit, 100)));

  with calculated as (
    select aa.id,
      case when q.kategori = 'TKP'
        then coalesce((q.skor_tkp ->> upper(aa.jawaban_user))::integer, 0)
        when aa.jawaban_user is not null and upper(aa.jawaban_user) = upper(q.kunci_jawaban) then 5
        else 0 end as score,
      q.kategori,
      (q.kategori <> 'TKP' and aa.jawaban_user is not null and upper(aa.jawaban_user) = upper(q.kunci_jawaban)) as correct
    from public.attempt_answers aa
    join public.questions q on q.id = aa.question_id
    where aa.attempt_id = p_attempt_id
  ), updated as (
    update public.attempt_answers aa
    set skor_didapat = calculated.score,
        is_benar = case when calculated.kategori = 'TKP' then null else calculated.correct end
    from calculated
    where aa.id = calculated.id
    returning calculated.kategori, calculated.score
  )
  select coalesce(sum(score) filter (where kategori = 'TWK'), 0),
         coalesce(sum(score) filter (where kategori = 'TIU'), 0),
         coalesce(sum(score) filter (where kategori = 'TKP'), 0)
  into v_twk, v_tiu, v_tkp
  from updated;

  v_total := v_twk + v_tiu + v_tkp;

  update public.attempts
  set waktu_selesai = least(v_now, v_deadline),
      durasi_pengerjaan = least(floor(extract(epoch from (v_now - waktu_mulai)))::integer, coalesce(v_attempt.durasi_menit, 100) * 60),
      skor_twk = v_twk, skor_tiu = v_tiu, skor_tkp = v_tkp, skor_total = v_total,
      status_twk = case when v_twk >= 65 then 'LULUS' else 'TIDAK LULUS' end,
      status_tiu = case when v_tiu >= 80 then 'LULUS' else 'TIDAK LULUS' end,
      status_tkp = case when v_tkp >= 166 then 'LULUS' else 'TIDAK LULUS' end,
      status_kelulusan = case when v_twk >= 65 and v_tiu >= 80 and v_tkp >= 166 then 'LULUS SKD' else 'TIDAK LULUS' end
  where id = p_attempt_id;

  return jsonb_build_object('already', false, 'attempt_id', p_attempt_id, 'skor_twk', v_twk, 'skor_tiu', v_tiu, 'skor_tkp', v_tkp, 'skor_total', v_total);
end;
$$;
