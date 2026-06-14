-- =====================================================
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. Política DELETE para invitados (admins autenticados)
--    Sin esto el botón de eliminar da error 403.
create policy "Admins can delete guests"
on public.guests
for delete
to authenticated
using (true);

-- 2. Tabla para el plano de mesas
create table if not exists public.seating_plan (
  id text primary key default 'main',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  plan_data jsonb not null default '{"tables":[]}'::jsonb
);

alter table public.seating_plan enable row level security;

-- Solo admins pueden leer y escribir el plano
create policy "Admins can read seating plan"
on public.seating_plan for select
to authenticated using (true);

create policy "Admins can upsert seating plan"
on public.seating_plan for insert
to authenticated with check (true);

create policy "Admins can update seating plan"
on public.seating_plan for update
to authenticated using (true);

-- Insertar fila inicial
insert into public.seating_plan (id, plan_data)
values ('main', '{"tables":[]}')
on conflict (id) do nothing;

-- 3. Habilitar Realtime para sincronización entre dispositivos
--    Sin esto, guardar en un móvil NO se refleja en vivo en otro dispositivo.
alter publication supabase_realtime add table public.seating_plan;
