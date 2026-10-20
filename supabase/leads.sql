create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  produto text not null,
  produto_nome text not null,
  primeiro_nome text not null,
  whatsapp text not null default '',
  email text,
  respostas jsonb not null,
  perfil jsonb not null,
  criado_em timestamptz not null default now()
);

-- Projetos já existentes: rode também
-- alter table public.leads add column if not exists email text;
-- alter table public.leads alter column whatsapp set default '';

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;
grant insert on table public.leads to anon;

drop policy if exists "visitante inclui lead" on public.leads;
create policy "visitante inclui lead"
  on public.leads
  for insert
  to anon
  with check (true);
