-- Jalankan di Supabase: SQL Editor -> New query -> Run
create table if not exists public.speed_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  mbps real not null
);

create index if not exists speed_log_created_at_idx
  on public.speed_log (created_at desc);

-- RLS aktif tanpa policy: tabel tertutup untuk publishable key,
-- hanya secret key (dipakai server Vercel) yang bisa membaca dan menulis.
alter table public.speed_log enable row level security;
