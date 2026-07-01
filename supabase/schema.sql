-- ============================================================
-- BOLÃO COPA DO MUNDO 2026 — Schema completo do Supabase
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. EXTENSÕES
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. TABELAS
-- ============================================================

-- Perfis de usuário (espelha auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- Seleções
create table if not exists public.teams (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  code        char(3) not null unique,
  flag_url    text,
  "group"     char(1),
  created_at  timestamptz not null default now()
);

-- Jogos
create table if not exists public.matches (
  id                      uuid primary key default uuid_generate_v4(),
  phase                   text not null check (phase in (
    'group_a','group_b','group_c','group_d','group_e','group_f',
    'group_g','group_h','group_i','group_j','group_k','group_l',
    'round_of_32','round_of_16','quarter_final','semi_final','third_place','final'
  )),
  match_number            int not null,
  home_team_id            uuid references public.teams(id) on delete set null,
  away_team_id            uuid references public.teams(id) on delete set null,
  home_score              int,
  away_score              int,
  home_score_penalties    int,
  away_score_penalties    int,
  match_date              timestamptz not null,
  venue                   text,
  city                    text,
  status                  text not null default 'scheduled' check (status in ('scheduled','live','finished','cancelled')),
  is_locked               boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Jogadores
create table if not exists public.players (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  team_id       uuid not null references public.teams(id) on delete cascade,
  position      text,
  shirt_number  int,
  created_at    timestamptz not null default now()
);

-- Gols oficiais (por partida)
create table if not exists public.match_goalscorers (
  id          uuid primary key default uuid_generate_v4(),
  match_id    uuid not null references public.matches(id) on delete cascade,
  player_id   uuid not null references public.players(id) on delete cascade,
  goals       int not null default 1,
  is_penalty  boolean not null default false,
  created_at  timestamptz not null default now(),
  unique(match_id, player_id)
);

-- Palpites
create table if not exists public.predictions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  match_id            uuid not null references public.matches(id) on delete cascade,
  home_score          int not null default 0,
  away_score          int not null default 0,
  score_points        int not null default 0,
  goalscorer_points   int not null default 0,
  total_points        int not null default 0,
  exact_score         boolean not null default false,
  correct_result      boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(user_id, match_id)
);

-- Jogadores apostados (palpites de goleadores)
create table if not exists public.prediction_goalscorers (
  id            uuid primary key default uuid_generate_v4(),
  prediction_id uuid not null references public.predictions(id) on delete cascade,
  player_id     uuid not null references public.players(id) on delete cascade,
  unique(prediction_id, player_id)
);

-- Ranking (view materializada como tabela atualizada via função)
create table if not exists public.ranking (
  user_id             uuid primary key references public.profiles(id) on delete cascade,
  total_points        int not null default 0,
  exact_scores        int not null default 0,
  correct_results     int not null default 0,
  goalscorer_points   int not null default 0,
  games_predicted     int not null default 0,
  updated_at          timestamptz not null default now()
);

-- Configurações gerais
create table if not exists public.settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,
  value       text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 3. TRIGGER: criar perfil automaticamente ao registrar
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 4. FUNÇÃO: calcular pontuação de uma partida
-- ============================================================
create or replace function public.recalculate_match_scores(p_match_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_match        record;
  v_prediction   record;
  v_score_pts    int;
  v_gs_pts       int;
  v_exact        boolean;
  v_correct      boolean;
  v_home_result  int;
  v_away_result  int;
  v_pred_result  int;
begin
  -- Carregar resultado oficial
  select home_score, away_score, status
  into v_match
  from public.matches
  where id = p_match_id;

  if v_match.status <> 'finished' or v_match.home_score is null then
    return;
  end if;

  -- Resultado oficial: -1 = vitória fora, 0 = empate, 1 = vitória casa
  if v_match.home_score > v_match.away_score then
    v_home_result := 1;
  elsif v_match.home_score < v_match.away_score then
    v_home_result := -1;
  else
    v_home_result := 0;
  end if;

  -- Loop em todos os palpites deste jogo
  for v_prediction in
    select id, user_id, home_score, away_score
    from public.predictions
    where match_id = p_match_id
  loop
    -- Resultado do palpite
    if v_prediction.home_score > v_prediction.away_score then
      v_pred_result := 1;
    elsif v_prediction.home_score < v_prediction.away_score then
      v_pred_result := -1;
    else
      v_pred_result := 0;
    end if;

    v_exact := (v_prediction.home_score = v_match.home_score and v_prediction.away_score = v_match.away_score);
    v_correct := (v_pred_result = v_home_result);

    -- Pontos do placar
    if v_exact then
      v_score_pts := 10;
    elsif v_correct then
      v_score_pts := 5;
    else
      v_score_pts := 0;
    end if;

    -- Pontos de goleadores (excluir pênaltis)
    select count(*)
    into v_gs_pts
    from public.prediction_goalscorers pg
    join public.match_goalscorers mg
      on mg.player_id = pg.player_id
      and mg.match_id = p_match_id
      and mg.is_penalty = false
    where pg.prediction_id = v_prediction.id;

    -- Atualizar palpite
    update public.predictions
    set
      score_points      = v_score_pts,
      goalscorer_points = v_gs_pts,
      total_points      = v_score_pts + v_gs_pts,
      exact_score       = v_exact,
      correct_result    = v_correct,
      updated_at        = now()
    where id = v_prediction.id;
  end loop;

  -- Recalcular ranking de todos os participantes afetados
  perform public.recalculate_ranking();
end;
$$;

-- ============================================================
-- 5. FUNÇÃO: recalcular ranking completo
-- ============================================================
create or replace function public.recalculate_ranking()
returns void
language plpgsql
security definer
as $$
begin
  -- Upsert para cada usuário que tem palpites
  insert into public.ranking (user_id, total_points, exact_scores, correct_results, goalscorer_points, games_predicted, updated_at)
  select
    p.user_id,
    coalesce(sum(p.total_points), 0)       as total_points,
    coalesce(sum(case when p.exact_score then 1 else 0 end), 0) as exact_scores,
    coalesce(sum(case when p.correct_result and not p.exact_score then 1 else 0 end), 0) as correct_results,
    coalesce(sum(p.goalscorer_points), 0)   as goalscorer_points,
    count(p.id)                              as games_predicted,
    now()                                    as updated_at
  from public.predictions p
  join public.matches m on m.id = p.match_id and m.status = 'finished'
  group by p.user_id
  on conflict (user_id)
  do update set
    total_points      = excluded.total_points,
    exact_scores      = excluded.exact_scores,
    correct_results   = excluded.correct_results,
    goalscorer_points = excluded.goalscorer_points,
    games_predicted   = excluded.games_predicted,
    updated_at        = now();
end;
$$;

-- ============================================================
-- 6. POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
alter table public.profiles             enable row level security;
alter table public.teams                enable row level security;
alter table public.matches              enable row level security;
alter table public.players              enable row level security;
alter table public.match_goalscorers    enable row level security;
alter table public.predictions          enable row level security;
alter table public.prediction_goalscorers enable row level security;
alter table public.ranking              enable row level security;
alter table public.settings             enable row level security;

-- Helper: verificar se usuário atual é admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: verificar se partida já começou (palpites bloqueados)
create or replace function public.match_is_locked(p_match_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_locked or match_date <= now() from public.matches where id = p_match_id),
    true
  );
$$;

-- ── profiles ──────────────────────────────────────────────
drop policy if exists "profiles: leitura própria" on public.profiles;
create policy "profiles: leitura própria"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: admin lê todos" on public.profiles;
create policy "profiles: admin lê todos"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "profiles: atualização própria" on public.profiles;
create policy "profiles: atualização própria"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- ── teams ─────────────────────────────────────────────────
drop policy if exists "teams: leitura pública autenticada" on public.teams;
create policy "teams: leitura pública autenticada"
  on public.teams for select to authenticated using (true);

drop policy if exists "teams: escrita somente admin" on public.teams;
create policy "teams: escrita somente admin"
  on public.teams for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── matches ───────────────────────────────────────────────
drop policy if exists "matches: leitura pública autenticada" on public.matches;
create policy "matches: leitura pública autenticada"
  on public.matches for select to authenticated using (true);

drop policy if exists "matches: escrita somente admin" on public.matches;
create policy "matches: escrita somente admin"
  on public.matches for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── players ───────────────────────────────────────────────
drop policy if exists "players: leitura pública autenticada" on public.players;
create policy "players: leitura pública autenticada"
  on public.players for select to authenticated using (true);

drop policy if exists "players: escrita somente admin" on public.players;
create policy "players: escrita somente admin"
  on public.players for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── match_goalscorers ─────────────────────────────────────
drop policy if exists "match_goalscorers: leitura pública autenticada" on public.match_goalscorers;
create policy "match_goalscorers: leitura pública autenticada"
  on public.match_goalscorers for select to authenticated using (true);

drop policy if exists "match_goalscorers: escrita somente admin" on public.match_goalscorers;
create policy "match_goalscorers: escrita somente admin"
  on public.match_goalscorers for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── predictions ───────────────────────────────────────────
-- Usuário só vê o próprio antes do jogo; todos veem depois
drop policy if exists "predictions: leitura condicional" on public.predictions;
create policy "predictions: leitura condicional"
  on public.predictions for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.match_is_locked(match_id)
  );

drop policy if exists "predictions: inserção própria antes do lock" on public.predictions;
create policy "predictions: inserção própria antes do lock"
  on public.predictions for insert
  with check (
    user_id = auth.uid()
    and not public.match_is_locked(match_id)
  );

drop policy if exists "predictions: atualização própria antes do lock" on public.predictions;
create policy "predictions: atualização própria antes do lock"
  on public.predictions for update
  using (
    user_id = auth.uid()
    and not public.match_is_locked(match_id)
  )
  with check (
    user_id = auth.uid()
    and not public.match_is_locked(match_id)
  );

-- ── prediction_goalscorers ────────────────────────────────
drop policy if exists "pg: leitura condicional" on public.prediction_goalscorers;
create policy "pg: leitura condicional"
  on public.prediction_goalscorers for select
  using (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
      and (p.user_id = auth.uid() or public.is_admin() or public.match_is_locked(p.match_id))
    )
  );

drop policy if exists "pg: inserção própria antes do lock" on public.prediction_goalscorers;
create policy "pg: inserção própria antes do lock"
  on public.prediction_goalscorers for insert
  with check (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
      and p.user_id = auth.uid()
      and not public.match_is_locked(p.match_id)
    )
  );

drop policy if exists "pg: deleção própria antes do lock" on public.prediction_goalscorers;
create policy "pg: deleção própria antes do lock"
  on public.prediction_goalscorers for delete
  using (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
      and p.user_id = auth.uid()
      and not public.match_is_locked(p.match_id)
    )
  );

-- ── ranking ───────────────────────────────────────────────
drop policy if exists "ranking: leitura pública autenticada" on public.ranking;
create policy "ranking: leitura pública autenticada"
  on public.ranking for select to authenticated using (true);

drop policy if exists "ranking: escrita somente admin/sistema" on public.ranking;
create policy "ranking: escrita somente admin/sistema"
  on public.ranking for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── settings ─────────────────────────────────────────────
drop policy if exists "settings: leitura pública autenticada" on public.settings;
create policy "settings: leitura pública autenticada"
  on public.settings for select to authenticated using (true);

drop policy if exists "settings: escrita somente admin" on public.settings;
create policy "settings: escrita somente admin"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 7. ÍNDICES DE PERFORMANCE
-- ============================================================
create index if not exists idx_matches_phase       on public.matches(phase);
create index if not exists idx_matches_status      on public.matches(status);
create index if not exists idx_matches_date        on public.matches(match_date);
create index if not exists idx_predictions_user    on public.predictions(user_id);
create index if not exists idx_predictions_match   on public.predictions(match_id);
create index if not exists idx_players_team        on public.players(team_id);
create index if not exists idx_mg_match            on public.match_goalscorers(match_id);
create index if not exists idx_pg_prediction       on public.prediction_goalscorers(prediction_id);

-- ============================================================
-- 8. DADOS INICIAIS — Copa do Mundo 2026
-- ============================================================

-- Configurações
insert into public.settings (key, value, description) values
  ('scoring_exact',      '10', 'Pontos por placar exato'),
  ('scoring_result',     '5',  'Pontos por acerto de vencedor/empate'),
  ('scoring_goalscorer', '1',  'Pontos por goleador acertado'),
  ('penalties_count_goals', 'false', 'Se pênaltis contam como gol de jogador')
on conflict (key) do nothing;

-- ── Seleções ──────────────────────────────────────────────
-- Grupo A
insert into public.teams (name, code, "group") values
  ('México',       'MEX', 'A'),
  ('Holanda',      'NED', 'A'),
  ('Arábia Saudita', 'SAU', 'A'),
  ('Zâmbia',       'ZAM', 'A')
on conflict (code) do nothing;

-- Grupo B
insert into public.teams (name, code, "group") values
  ('Argentina',    'ARG', 'B'),
  ('Chile',        'CHI', 'B'),
  ('Bulgária',     'BUL', 'B'),
  ('Coreia do Sul','KOR', 'B')
on conflict (code) do nothing;

-- Grupo C
insert into public.teams (name, code, "group") values
  ('EUA',          'USA', 'C'),
  ('Uruguai',      'URU', 'C'),
  ('Panamá',       'PAN', 'C'),
  ('Geórgia',      'GEO', 'C')
on conflict (code) do nothing;

-- Grupo D
insert into public.teams (name, code, "group") values
  ('Equador',      'ECU', 'D'),
  ('Alemanha',     'GER', 'D'),
  ('Portugal',     'POR', 'D'),
  ('Etiópia',      'ETH', 'D')
on conflict (code) do nothing;

-- Grupo E
insert into public.teams (name, code, "group") values
  ('Japão',        'JAP', 'E'),
  ('Croácia',      'CRO', 'E'),
  ('Marrocos',     'MAR', 'E'),
  ('Tanzânia',     'TAN', 'E')
on conflict (code) do nothing;

-- Grupo F
insert into public.teams (name, code, "group") values
  ('Espanha',      'ESP', 'F'),
  ('Brasil',       'BRA', 'F'),
  ('Albânia',      'ALB', 'F'),
  ('Tunísia',      'TUN', 'F')
on conflict (code) do nothing;

-- Grupo G
insert into public.teams (name, code, "group") values
  ('Portugal',     'POR', 'G'),
  ('Colômbia',     'COL', 'G'),
  ('Irã',          'IRN', 'G'),
  ('Quênia',       'KEN', 'G')
on conflict (code) do nothing;

-- Grupo H
insert into public.teams (name, code, "group") values
  ('Inglaterra',   'ENG', 'H'),
  ('Nigéria',      'NIG', 'H'),
  ('Argentina',    'ARG', 'H'),
  ('Noruega',      'NOR', 'H')
on conflict (code) do nothing;

-- Grupo I
insert into public.teams (name, code, "group") values
  ('Canadá',       'CAN', 'I'),
  ('França',       'FRA', 'I'),
  ('Gabão',        'GAB', 'I'),
  ('Tonga',        'TON', 'I')
on conflict (code) do nothing;

-- Grupo J
insert into public.teams (name, code, "group") values
  ('Itália',       'ITA', 'J'),
  ('Senegal',      'SEN', 'J'),
  ('Peru',         'PER', 'J'),
  ('Suíça',        'SUI', 'J')
on conflict (code) do nothing;

-- Grupo K
insert into public.teams (name, code, "group") values
  ('Portugal',     'POR', 'K'),
  ('Iraque',       'IRQ', 'K'),
  ('Austrália',    'AUS', 'K'),
  ('Ucrânia',      'UKR', 'K')
on conflict (code) do nothing;

-- Grupo L
insert into public.teams (name, code, "group") values
  ('Costa Rica',   'CRC', 'L'),
  ('Bélgica',      'BEL', 'L'),
  ('Antígua',      'ATG', 'L'),
  ('Nova Zelândia','NZL', 'L')
on conflict (code) do nothing;

-- NOTA: Insira os jogos específicos da Copa 2026 após confirmar
-- o chaveamento oficial completo via SQL abaixo.

-- ============================================================
-- 9. EXEMPLO DE INSERÇÃO DE JOGOS (ajuste conforme necessário)
-- ============================================================
-- Os grupos A-L da Copa 2026 têm 4 times cada (48 times total, 104 jogos)
-- Use o padrão abaixo para inserir cada jogo:
--
-- insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status)
-- select
--   'group_a',
--   1,
--   (select id from teams where code = 'MEX'),
--   (select id from teams where code = 'NED'),
--   '2026-06-11 21:00:00-03'::timestamptz,
--   'AT&T Stadium',
--   'Dallas',
--   'scheduled';

-- ============================================================
-- 10. TORNAR USUÁRIO ADMIN (execute após criar a conta)
-- ============================================================
-- update public.profiles
-- set role = 'admin'
-- where email = 'seu-email@exemplo.com';
