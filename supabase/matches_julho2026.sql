-- ============================================================
-- JOGOS DA COPA DO MUNDO 2026 — A PARTIR DE 01/07/2026
-- Execute no SQL Editor do Supabase APÓS rodar teams_copa2026.sql
-- Todos os horários em horário de Brasília (UTC-3)
-- ============================================================

-- Remove jogos anteriores para evitar duplicatas
DELETE FROM public.match_goalscorers;
DELETE FROM public.prediction_goalscorers;
DELETE FROM public.predictions;
DELETE FROM public.matches;

-- ============================================================
-- FASE DE GRUPOS — RODADA FINAL (01/07 a 05/07/2026)
-- ============================================================

-- 01/07 — Quarta-feira
INSERT INTO public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) VALUES
(
  'round_of_32', 1,
  (SELECT id FROM public.teams WHERE code = 'ENG'),
  (SELECT id FROM public.teams WHERE code = 'COD'),
  '2026-07-01 14:00:00-03',
  'Mercedes-Benz Stadium', 'Atlanta', 'scheduled'
),
(
  'round_of_32', 2,
  (SELECT id FROM public.teams WHERE code = 'BEL'),
  (SELECT id FROM public.teams WHERE code = 'SEN'),
  '2026-07-01 18:00:00-03',
  'Lumen Field', 'Seattle', 'scheduled'
),
(
  'round_of_32', 3,
  (SELECT id FROM public.teams WHERE code = 'USA'),
  (SELECT id FROM public.teams WHERE code = 'BIH'),
  '2026-07-01 22:00:00-03',
  'Levi''s Stadium', 'Santa Clara', 'scheduled'
);

-- 02/07 — Quinta-feira
INSERT INTO public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) VALUES
(
  'round_of_32', 4,
  (SELECT id FROM public.teams WHERE code = 'ESP'),
  (SELECT id FROM public.teams WHERE code = 'AUT'),
  '2026-07-02 17:00:00-03',
  'SoFi Stadium', 'Los Angeles', 'scheduled'
),
(
  'round_of_32', 5,
  (SELECT id FROM public.teams WHERE code = 'POR'),
  (SELECT id FROM public.teams WHERE code = 'CRO'),
  '2026-07-02 21:00:00-03',
  'BMO Field', 'Toronto', 'scheduled'
),
(
  'round_of_32', 6,
  (SELECT id FROM public.teams WHERE code = 'SUI'),
  (SELECT id FROM public.teams WHERE code = 'ALG'),
  '2026-07-03 01:00:00-03',
  'BC Place', 'Vancouver', 'scheduled'
);

-- 03/07 — Sexta-feira
INSERT INTO public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) VALUES
(
  'round_of_32', 7,
  (SELECT id FROM public.teams WHERE code = 'AUS'),
  (SELECT id FROM public.teams WHERE code = 'EGY'),
  '2026-07-03 16:00:00-03',
  'AT&T Stadium', 'Dallas/Arlington', 'scheduled'
),
(
  'round_of_32', 8,
  (SELECT id FROM public.teams WHERE code = 'ARG'),
  (SELECT id FROM public.teams WHERE code = 'CPV'),
  '2026-07-03 20:00:00-03',
  'Hard Rock Stadium', 'Miami', 'scheduled'
),
(
  'round_of_32', 9,
  (SELECT id FROM public.teams WHERE code = 'COL'),
  (SELECT id FROM public.teams WHERE code = 'GHA'),
  '2026-07-03 23:30:00-03',
  'GEHA Field at Arrowhead Stadium', 'Kansas City', 'scheduled'
);

-- 04/07 — Sábado
INSERT INTO public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) VALUES
(
  'round_of_32', 10,
  (SELECT id FROM public.teams WHERE code = 'CAN'),
  (SELECT id FROM public.teams WHERE code = 'MAR'),
  '2026-07-04 15:00:00-03',
  'NRG Stadium', 'Houston', 'scheduled'
),
(
  'round_of_32', 11,
  (SELECT id FROM public.teams WHERE code = 'PAR'),
  (SELECT id FROM public.teams WHERE code = 'FRA'),
  '2026-07-04 19:00:00-03',
  'Lincoln Financial Field', 'Filadélfia', 'scheduled'
);

-- 05/07 — Domingo
INSERT INTO public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) VALUES
(
  'round_of_32', 12,
  (SELECT id FROM public.teams WHERE code = 'BRA'),
  (SELECT id FROM public.teams WHERE code = 'NOR'),
  '2026-07-05 18:00:00-03',
  'MetLife Stadium', 'Nova York/New Jersey', 'scheduled'
);

-- ============================================================
-- OITAVAS DE FINAL (a definir conforme classificados)
-- Datas estimadas: 07-11 de julho
-- ============================================================
INSERT INTO public.matches (phase, match_number, match_date, venue, city, status) VALUES
  ('round_of_16', 13, '2026-07-07 17:00:00-03', 'AT&T Stadium', 'Dallas/Arlington', 'scheduled'),
  ('round_of_16', 14, '2026-07-07 21:00:00-03', 'Lumen Field', 'Seattle', 'scheduled'),
  ('round_of_16', 15, '2026-07-08 14:00:00-03', 'Mercedes-Benz Stadium', 'Atlanta', 'scheduled'),
  ('round_of_16', 16, '2026-07-08 18:00:00-03', 'BC Place', 'Vancouver', 'scheduled'),
  ('round_of_16', 17, '2026-07-09 17:00:00-03', 'SoFi Stadium', 'Los Angeles', 'scheduled'),
  ('round_of_16', 18, '2026-07-09 21:00:00-03', 'Hard Rock Stadium', 'Miami', 'scheduled'),
  ('round_of_16', 19, '2026-07-10 17:00:00-03', 'MetLife Stadium', 'Nova York/New Jersey', 'scheduled'),
  ('round_of_16', 20, '2026-07-10 21:00:00-03', 'NRG Stadium', 'Houston', 'scheduled');

-- ============================================================
-- QUARTAS DE FINAL (09-11 de julho)
-- ============================================================
INSERT INTO public.matches (phase, match_number, match_date, venue, city, status) VALUES
  ('quarter_final', 21, '2026-07-11 18:00:00-03', 'Gillette Stadium', 'Boston/Foxborough', 'scheduled'),
  ('quarter_final', 22, '2026-07-11 22:00:00-03', 'SoFi Stadium', 'Los Angeles', 'scheduled'),
  ('quarter_final', 23, '2026-07-12 19:00:00-03', 'Hard Rock Stadium', 'Miami', 'scheduled'),
  ('quarter_final', 24, '2026-07-12 23:00:00-03', 'GEHA Field at Arrowhead Stadium', 'Kansas City', 'scheduled');

-- ============================================================
-- SEMIFINAIS (14-15 de julho)
-- ============================================================
INSERT INTO public.matches (phase, match_number, match_date, venue, city, status) VALUES
  ('semi_final', 25, '2026-07-14 17:00:00-03', 'AT&T Stadium', 'Dallas/Arlington', 'scheduled'),
  ('semi_final', 26, '2026-07-15 17:00:00-03', 'Mercedes-Benz Stadium', 'Atlanta', 'scheduled');

-- ============================================================
-- DISPUTA DE 3º LUGAR (18 de julho)
-- ============================================================
INSERT INTO public.matches (phase, match_number, match_date, venue, city, status) VALUES
  ('third_place', 27, '2026-07-18 18:00:00-03', 'Hard Rock Stadium', 'Miami', 'scheduled');

-- ============================================================
-- FINAL (19 de julho)
-- ============================================================
INSERT INTO public.matches (phase, match_number, match_date, venue, city, status) VALUES
  ('final', 28, '2026-07-19 17:00:00-03', 'MetLife Stadium', 'Nova York/New Jersey', 'scheduled');
