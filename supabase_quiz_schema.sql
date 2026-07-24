-- Crear tabla de puntuaciones del quiz
create table if not exists public.quiz_scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  player_name text not null,
  group_name text not null, -- 'Amigo de Adrián', 'Familia de Nadia', etc.
  score int not null,
  total_questions int default 15 not null,
  time_taken_seconds int not null -- Para desempatar a igualdad de puntos
);

-- Habilitar RLS (Row Level Security)
alter table public.quiz_scores enable row level security;

-- Política: Permitir a cualquiera subir su puntuación
create policy "Allow public score insertion"
on public.quiz_scores for insert to anon
with check (true);

-- Política: Permitir a cualquiera ver el ranking
create policy "Allow public score selection"
on public.quiz_scores for select to anon
using (true);

-- Política: Permitir borrar puntuaciones (para limpiar pruebas)
create policy "Allow public score deletion"
on public.quiz_scores for delete to anon
using (true);

