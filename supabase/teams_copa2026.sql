-- ============================================================
-- 48 SELEÇÕES CLASSIFICADAS — COPA DO MUNDO 2026
-- Execute no SQL Editor do Supabase
-- Os grupos serão definidos após o sorteio oficial da FIFA
-- ============================================================

-- Limpa seleções anteriores (cuidado: apaga jogadores e jogos vinculados)
-- Se já tiver dados, comente as linhas de DELETE e use apenas os INSERTs
DELETE FROM public.match_goalscorers;
DELETE FROM public.prediction_goalscorers;
DELETE FROM public.predictions;
DELETE FROM public.match_goalscorers;
DELETE FROM public.matches;
DELETE FROM public.players;
DELETE FROM public.teams;

-- ── CONMEBOL (6 vagas) ───────────────────────────────────
INSERT INTO public.teams (name, code) VALUES
  ('Argentina',    'ARG'),
  ('Brasil',       'BRA'),
  ('Colômbia',     'COL'),
  ('Equador',      'ECU'),
  ('Paraguai',     'PAR'),
  ('Uruguai',      'URU');

-- ── CONCACAF (6 vagas) ───────────────────────────────────
INSERT INTO public.teams (name, code) VALUES
  ('Canadá',       'CAN'),
  ('Curaçao',      'CUW'),
  ('Haiti',        'HAI'),
  ('México',       'MEX'),
  ('Panamá',       'PAN'),
  ('Estados Unidos','USA');

-- ── UEFA (16 vagas) ──────────────────────────────────────
INSERT INTO public.teams (name, code) VALUES
  ('Áustria',              'AUT'),
  ('Bélgica',              'BEL'),
  ('Bósnia e Herzegovina', 'BIH'),
  ('Croácia',              'CRO'),
  ('República Tcheca',     'CZE'),
  ('Inglaterra',           'ENG'),
  ('França',               'FRA'),
  ('Alemanha',             'GER'),
  ('Holanda',              'NED'),
  ('Noruega',              'NOR'),
  ('Portugal',             'POR'),
  ('Escócia',              'SCO'),
  ('Espanha',              'ESP'),
  ('Suécia',               'SWE'),
  ('Suíça',                'SUI'),
  ('Turquia',              'TUR');

-- ── AFC (9 vagas) ─────────────────────────────────────────
INSERT INTO public.teams (name, code) VALUES
  ('Austrália',    'AUS'),
  ('Irã',          'IRN'),
  ('Iraque',       'IRQ'),
  ('Japão',        'JPN'),
  ('Jordânia',     'JOR'),
  ('Catar',        'QAT'),
  ('Arábia Saudita','SAU'),
  ('Coreia do Sul','KOR'),
  ('Uzbequistão',  'UZB');

-- ── CAF (10 vagas) ────────────────────────────────────────
INSERT INTO public.teams (name, code) VALUES
  ('Argélia',      'ALG'),
  ('Cabo Verde',   'CPV'),
  ('RD Congo',     'COD'),
  ('Egito',        'EGY'),
  ('Gana',         'GHA'),
  ('Costa do Marfim','CIV'),
  ('Marrocos',     'MAR'),
  ('Senegal',      'SEN'),
  ('África do Sul','RSA'),
  ('Tunísia',      'TUN');

-- ── OFC (1 vaga) ──────────────────────────────────────────
INSERT INTO public.teams (name, code) VALUES
  ('Nova Zelândia','NZL');

-- Total: 48 seleções classificadas
