-- ============================================================
-- JOGOS DA COPA DO MUNDO 2026
-- Fase de grupos (seleção dos grupos principais para exemplo)
-- Ajuste times e datas conforme o chaveamento oficial
-- ============================================================

-- ── Limpar times existentes e reinserir ──────────────────
truncate public.teams cascade;

-- ── 48 Seleções Classificadas ────────────────────────────
insert into public.teams (name, code, "group") values
  -- Grupo A (jogos nos EUA)
  ('México',           'MEX', 'A'),
  ('Holanda',          'NED', 'A'),
  ('Arábia Saudita',   'SAU', 'A'),
  ('Zâmbia',           'ZAM', 'A'),
  -- Grupo B
  ('Argentina',        'ARG', 'B'),
  ('Chile',            'CHI', 'B'),
  ('Bulgária',         'BUL', 'B'),
  ('Coreia do Sul',    'KOR', 'B'),
  -- Grupo C
  ('EUA',              'USA', 'C'),
  ('Uruguai',          'URU', 'C'),
  ('Panamá',           'PAN', 'C'),
  ('Geórgia',          'GEO', 'C'),
  -- Grupo D
  ('Equador',          'ECU', 'D'),
  ('Alemanha',         'GER', 'D'),
  ('Portugal',         'POR', 'D'),
  ('Etiópia',          'ETH', 'D'),
  -- Grupo E
  ('Japão',            'JAP', 'E'),
  ('Croácia',          'CRO', 'E'),
  ('Marrocos',         'MAR', 'E'),
  ('Tanzânia',         'TAN', 'E'),
  -- Grupo F
  ('Espanha',          'ESP', 'F'),
  ('Brasil',           'BRA', 'F'),
  ('Albânia',          'ALB', 'F'),
  ('Tunísia',          'TUN', 'F'),
  -- Grupo G
  ('Colômbia',         'COL', 'G'),
  ('Irã',              'IRN', 'G'),
  ('Eslováquia',       'SVK', 'G'),
  ('Quênia',           'KEN', 'G'),
  -- Grupo H
  ('Inglaterra',       'ENG', 'H'),
  ('Nigéria',          'NIG', 'H'),
  ('Sérvia',           'SRB', 'H'),
  ('Noruega',          'NOR', 'H'),
  -- Grupo I
  ('Canadá',           'CAN', 'I'),
  ('França',           'FRA', 'I'),
  ('Gabão',            'GAB', 'I'),
  ('Fiji',             'FIJ', 'I'),
  -- Grupo J
  ('Itália',           'ITA', 'J'),
  ('Senegal',          'SEN', 'J'),
  ('Peru',             'PER', 'J'),
  ('Suíça',            'SUI', 'J'),
  -- Grupo K
  ('Iraque',           'IRQ', 'K'),
  ('Austrália',        'AUS', 'K'),
  ('Ucrânia',          'UKR', 'K'),
  ('Indonésia',        'IDN', 'K'),
  -- Grupo L
  ('Costa Rica',       'CRC', 'L'),
  ('Bélgica',          'BEL', 'L'),
  ('Turquia',          'TUR', 'L'),
  ('Nova Zelândia',    'NZL', 'L');

-- ── Jogos da Fase de Grupos ───────────────────────────────
-- Os horários abaixo são no fuso UTC-3 (horário de Brasília)
-- Datas de abertura: 11/06/2026 a 02/07/2026

-- GRUPO A — Dallas, Los Angeles, San Francisco
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_a', 1,  (select id from teams where code='MEX'), (select id from teams where code='NED'), '2026-06-11 21:00:00-03', 'AT&T Stadium',   'Dallas',       'scheduled'),
  ('group_a', 2,  (select id from teams where code='SAU'), (select id from teams where code='ZAM'), '2026-06-12 18:00:00-03', 'SoFi Stadium',   'Los Angeles',  'scheduled'),
  ('group_a', 3,  (select id from teams where code='MEX'), (select id from teams where code='ZAM'), '2026-06-15 18:00:00-03', 'Levi Stadium',   'San José',     'scheduled'),
  ('group_a', 4,  (select id from teams where code='NED'), (select id from teams where code='SAU'), '2026-06-15 21:00:00-03', 'AT&T Stadium',   'Dallas',       'scheduled'),
  ('group_a', 5,  (select id from teams where code='NED'), (select id from teams where code='ZAM'), '2026-06-19 21:00:00-03', 'SoFi Stadium',   'Los Angeles',  'scheduled'),
  ('group_a', 6,  (select id from teams where code='MEX'), (select id from teams where code='SAU'), '2026-06-19 21:00:00-03', 'AT&T Stadium',   'Dallas',       'scheduled');

-- GRUPO B — Nova York, Chicago, Boston
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_b', 7,  (select id from teams where code='ARG'), (select id from teams where code='CHI'), '2026-06-12 21:00:00-03', 'MetLife Stadium','Nova York',    'scheduled'),
  ('group_b', 8,  (select id from teams where code='BUL'), (select id from teams where code='KOR'), '2026-06-13 18:00:00-03', 'Soldier Field',  'Chicago',      'scheduled'),
  ('group_b', 9,  (select id from teams where code='ARG'), (select id from teams where code='BUL'), '2026-06-16 21:00:00-03', 'MetLife Stadium','Nova York',    'scheduled'),
  ('group_b', 10, (select id from teams where code='KOR'), (select id from teams where code='CHI'), '2026-06-16 18:00:00-03', 'Gillette Stadium','Boston',      'scheduled'),
  ('group_b', 11, (select id from teams where code='ARG'), (select id from teams where code='KOR'), '2026-06-20 21:00:00-03', 'MetLife Stadium','Nova York',    'scheduled'),
  ('group_b', 12, (select id from teams where code='CHI'), (select id from teams where code='BUL'), '2026-06-20 21:00:00-03', 'Soldier Field',  'Chicago',      'scheduled');

-- GRUPO C — Seattle, San Francisco, Los Angeles
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_c', 13, (select id from teams where code='USA'), (select id from teams where code='URU'), '2026-06-13 21:00:00-03', 'Lumen Field',    'Seattle',      'scheduled'),
  ('group_c', 14, (select id from teams where code='PAN'), (select id from teams where code='GEO'), '2026-06-14 18:00:00-03', 'Levi Stadium',   'San José',     'scheduled'),
  ('group_c', 15, (select id from teams where code='USA'), (select id from teams where code='PAN'), '2026-06-17 21:00:00-03', 'Lumen Field',    'Seattle',      'scheduled'),
  ('group_c', 16, (select id from teams where code='GEO'), (select id from teams where code='URU'), '2026-06-17 18:00:00-03', 'SoFi Stadium',   'Los Angeles',  'scheduled'),
  ('group_c', 17, (select id from teams where code='USA'), (select id from teams where code='GEO'), '2026-06-21 21:00:00-03', 'Lumen Field',    'Seattle',      'scheduled'),
  ('group_c', 18, (select id from teams where code='URU'), (select id from teams where code='PAN'), '2026-06-21 21:00:00-03', 'Levi Stadium',   'San José',     'scheduled');

-- GRUPO D — Dallas, Houston, Kansas City
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_d', 19, (select id from teams where code='GER'), (select id from teams where code='POR'), '2026-06-14 21:00:00-03', 'AT&T Stadium',   'Dallas',       'scheduled'),
  ('group_d', 20, (select id from teams where code='ECU'), (select id from teams where code='ETH'), '2026-06-15 18:00:00-03', 'NRG Stadium',    'Houston',      'scheduled'),
  ('group_d', 21, (select id from teams where code='GER'), (select id from teams where code='ECU'), '2026-06-18 21:00:00-03', 'Arrowhead Stad.','Kansas City',  'scheduled'),
  ('group_d', 22, (select id from teams where code='POR'), (select id from teams where code='ETH'), '2026-06-18 18:00:00-03', 'AT&T Stadium',   'Dallas',       'scheduled'),
  ('group_d', 23, (select id from teams where code='GER'), (select id from teams where code='ETH'), '2026-06-22 21:00:00-03', 'NRG Stadium',    'Houston',      'scheduled'),
  ('group_d', 24, (select id from teams where code='POR'), (select id from teams where code='ECU'), '2026-06-22 21:00:00-03', 'Arrowhead Stad.','Kansas City',  'scheduled');

-- GRUPO E — San Francisco, Los Angeles, Seattle
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_e', 25, (select id from teams where code='JAP'), (select id from teams where code='MAR'), '2026-06-14 21:00:00-03', 'Levi Stadium',   'San José',     'scheduled'),
  ('group_e', 26, (select id from teams where code='CRO'), (select id from teams where code='TAN'), '2026-06-15 18:00:00-03', 'SoFi Stadium',   'Los Angeles',  'scheduled'),
  ('group_e', 27, (select id from teams where code='JAP'), (select id from teams where code='CRO'), '2026-06-18 21:00:00-03', 'Lumen Field',    'Seattle',      'scheduled'),
  ('group_e', 28, (select id from teams where code='MAR'), (select id from teams where code='TAN'), '2026-06-18 18:00:00-03', 'Levi Stadium',   'San José',     'scheduled'),
  ('group_e', 29, (select id from teams where code='JAP'), (select id from teams where code='TAN'), '2026-06-22 21:00:00-03', 'SoFi Stadium',   'Los Angeles',  'scheduled'),
  ('group_e', 30, (select id from teams where code='CRO'), (select id from teams where code='MAR'), '2026-06-22 21:00:00-03', 'Lumen Field',    'Seattle',      'scheduled');

-- GRUPO F — Cidade do México, Guadalajara, Monterrey (México)
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_f', 31, (select id from teams where code='ESP'), (select id from teams where code='ALB'), '2026-06-15 21:00:00-03', 'Estádio Azteca','Cidade do México','scheduled'),
  ('group_f', 32, (select id from teams where code='BRA'), (select id from teams where code='TUN'), '2026-06-16 21:00:00-03', 'Estadio AKRON', 'Guadalajara',   'scheduled'),
  ('group_f', 33, (select id from teams where code='ESP'), (select id from teams where code='BRA'), '2026-06-19 21:00:00-03', 'Estádio Azteca','Cidade do México','scheduled'),
  ('group_f', 34, (select id from teams where code='ALB'), (select id from teams where code='TUN'), '2026-06-19 18:00:00-03', 'Estadio BBVA',  'Monterrey',     'scheduled'),
  ('group_f', 35, (select id from teams where code='ESP'), (select id from teams where code='TUN'), '2026-06-23 21:00:00-03', 'Estádio Azteca','Cidade do México','scheduled'),
  ('group_f', 36, (select id from teams where code='BRA'), (select id from teams where code='ALB'), '2026-06-23 21:00:00-03', 'Estadio AKRON', 'Guadalajara',   'scheduled');

-- GRUPO G — Toronto, Vancouver (Canadá)
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_g', 37, (select id from teams where code='COL'), (select id from teams where code='IRN'), '2026-06-16 21:00:00-03', 'BMO Field',      'Toronto',      'scheduled'),
  ('group_g', 38, (select id from teams where code='SVK'), (select id from teams where code='KEN'), '2026-06-17 18:00:00-03', 'BC Place',       'Vancouver',    'scheduled'),
  ('group_g', 39, (select id from teams where code='COL'), (select id from teams where code='SVK'), '2026-06-20 21:00:00-03', 'BMO Field',      'Toronto',      'scheduled'),
  ('group_g', 40, (select id from teams where code='IRN'), (select id from teams where code='KEN'), '2026-06-20 18:00:00-03', 'BC Place',       'Vancouver',    'scheduled'),
  ('group_g', 41, (select id from teams where code='COL'), (select id from teams where code='KEN'), '2026-06-24 21:00:00-03', 'BC Place',       'Vancouver',    'scheduled'),
  ('group_g', 42, (select id from teams where code='IRN'), (select id from teams where code='SVK'), '2026-06-24 21:00:00-03', 'BMO Field',      'Toronto',      'scheduled');

-- GRUPO H — Nova York, Boston, Philadelphia
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_h', 43, (select id from teams where code='ENG'), (select id from teams where code='NIG'), '2026-06-17 21:00:00-03', 'MetLife Stadium','Nova York',    'scheduled'),
  ('group_h', 44, (select id from teams where code='SRB'), (select id from teams where code='NOR'), '2026-06-18 18:00:00-03', 'Lincoln Fin. F.','Philadelphia', 'scheduled'),
  ('group_h', 45, (select id from teams where code='ENG'), (select id from teams where code='SRB'), '2026-06-21 21:00:00-03', 'MetLife Stadium','Nova York',    'scheduled'),
  ('group_h', 46, (select id from teams where code='NOR'), (select id from teams where code='NIG'), '2026-06-21 18:00:00-03', 'Gillette Stadium','Boston',      'scheduled'),
  ('group_h', 47, (select id from teams where code='ENG'), (select id from teams where code='NOR'), '2026-06-25 21:00:00-03', 'MetLife Stadium','Nova York',    'scheduled'),
  ('group_h', 48, (select id from teams where code='NIG'), (select id from teams where code='SRB'), '2026-06-25 21:00:00-03', 'Lincoln Fin. F.','Philadelphia', 'scheduled');

-- GRUPO I — Monterrey, Guadalajara (México)
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_i', 49, (select id from teams where code='CAN'), (select id from teams where code='FRA'), '2026-06-18 21:00:00-03', 'Estadio BBVA',  'Monterrey',    'scheduled'),
  ('group_i', 50, (select id from teams where code='GAB'), (select id from teams where code='FIJ'), '2026-06-19 18:00:00-03', 'Estadio AKRON', 'Guadalajara',  'scheduled'),
  ('group_i', 51, (select id from teams where code='CAN'), (select id from teams where code='GAB'), '2026-06-22 21:00:00-03', 'Estadio BBVA',  'Monterrey',    'scheduled'),
  ('group_i', 52, (select id from teams where code='FRA'), (select id from teams where code='FIJ'), '2026-06-22 18:00:00-03', 'Estadio AKRON', 'Guadalajara',  'scheduled'),
  ('group_i', 53, (select id from teams where code='CAN'), (select id from teams where code='FIJ'), '2026-06-26 21:00:00-03', 'Estadio AKRON', 'Guadalajara',  'scheduled'),
  ('group_i', 54, (select id from teams where code='FRA'), (select id from teams where code='GAB'), '2026-06-26 21:00:00-03', 'Estadio BBVA',  'Monterrey',    'scheduled');

-- GRUPO J — Vancouver, Toronto
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_j', 55, (select id from teams where code='ITA'), (select id from teams where code='SEN'), '2026-06-19 21:00:00-03', 'BC Place',       'Vancouver',    'scheduled'),
  ('group_j', 56, (select id from teams where code='PER'), (select id from teams where code='SUI'), '2026-06-20 18:00:00-03', 'BMO Field',      'Toronto',      'scheduled'),
  ('group_j', 57, (select id from teams where code='ITA'), (select id from teams where code='PER'), '2026-06-23 21:00:00-03', 'BC Place',       'Vancouver',    'scheduled'),
  ('group_j', 58, (select id from teams where code='SUI'), (select id from teams where code='SEN'), '2026-06-23 18:00:00-03', 'BMO Field',      'Toronto',      'scheduled'),
  ('group_j', 59, (select id from teams where code='ITA'), (select id from teams where code='SUI'), '2026-06-27 21:00:00-03', 'BMO Field',      'Toronto',      'scheduled'),
  ('group_j', 60, (select id from teams where code='SEN'), (select id from teams where code='PER'), '2026-06-27 21:00:00-03', 'BC Place',       'Vancouver',    'scheduled');

-- GRUPO K — Chicago, Seattle, Kansas City
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_k', 61, (select id from teams where code='AUS'), (select id from teams where code='UKR'), '2026-06-20 21:00:00-03', 'Soldier Field',  'Chicago',      'scheduled'),
  ('group_k', 62, (select id from teams where code='IRQ'), (select id from teams where code='IDN'), '2026-06-21 18:00:00-03', 'Lumen Field',    'Seattle',      'scheduled'),
  ('group_k', 63, (select id from teams where code='AUS'), (select id from teams where code='IRQ'), '2026-06-24 21:00:00-03', 'Arrowhead Stad.','Kansas City',  'scheduled'),
  ('group_k', 64, (select id from teams where code='UKR'), (select id from teams where code='IDN'), '2026-06-24 18:00:00-03', 'Soldier Field',  'Chicago',      'scheduled'),
  ('group_k', 65, (select id from teams where code='AUS'), (select id from teams where code='IDN'), '2026-06-28 21:00:00-03', 'Lumen Field',    'Seattle',      'scheduled'),
  ('group_k', 66, (select id from teams where code='UKR'), (select id from teams where code='IRQ'), '2026-06-28 21:00:00-03', 'Arrowhead Stad.','Kansas City',  'scheduled');

-- GRUPO L — Houston, Philadelphia, Dallas
insert into public.matches (phase, match_number, home_team_id, away_team_id, match_date, venue, city, status) values
  ('group_l', 67, (select id from teams where code='BEL'), (select id from teams where code='CRC'), '2026-06-21 21:00:00-03', 'NRG Stadium',    'Houston',      'scheduled'),
  ('group_l', 68, (select id from teams where code='TUR'), (select id from teams where code='NZL'), '2026-06-22 18:00:00-03', 'Lincoln Fin. F.','Philadelphia', 'scheduled'),
  ('group_l', 69, (select id from teams where code='BEL'), (select id from teams where code='TUR'), '2026-06-25 21:00:00-03', 'NRG Stadium',    'Houston',      'scheduled'),
  ('group_l', 70, (select id from teams where code='NZL'), (select id from teams where code='CRC'), '2026-06-25 18:00:00-03', 'AT&T Stadium',   'Dallas',       'scheduled'),
  ('group_l', 71, (select id from teams where code='BEL'), (select id from teams where code='NZL'), '2026-06-29 21:00:00-03', 'Lincoln Fin. F.','Philadelphia', 'scheduled'),
  ('group_l', 72, (select id from teams where code='CRC'), (select id from teams where code='TUR'), '2026-06-29 21:00:00-03', 'NRG Stadium',    'Houston',      'scheduled');

-- ── MATA-MATA (a definir conforme classificados) ──────────
-- Oitavas de final: 32 classificados
-- Os slots são preenchidos pelo admin quando os confrontos forem definidos
insert into public.matches (phase, match_number, match_date, venue, city, status) values
  ('round_of_32', 73,  '2026-07-04 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 74,  '2026-07-04 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 75,  '2026-07-05 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 76,  '2026-07-05 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 77,  '2026-07-06 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 78,  '2026-07-06 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 79,  '2026-07-07 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 80,  '2026-07-07 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 81,  '2026-07-08 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 82,  '2026-07-08 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 83,  '2026-07-09 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 84,  '2026-07-09 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 85,  '2026-07-10 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 86,  '2026-07-10 21:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 87,  '2026-07-11 18:00:00-03', NULL, NULL, 'scheduled'),
  ('round_of_32', 88,  '2026-07-11 21:00:00-03', NULL, NULL, 'scheduled');

-- Oitavas de final (16 times)
insert into public.matches (phase, match_number, match_date, status) values
  ('round_of_16', 89,  '2026-07-14 18:00:00-03', 'scheduled'),
  ('round_of_16', 90,  '2026-07-14 21:00:00-03', 'scheduled'),
  ('round_of_16', 91,  '2026-07-15 18:00:00-03', 'scheduled'),
  ('round_of_16', 92,  '2026-07-15 21:00:00-03', 'scheduled'),
  ('round_of_16', 93,  '2026-07-16 18:00:00-03', 'scheduled'),
  ('round_of_16', 94,  '2026-07-16 21:00:00-03', 'scheduled'),
  ('round_of_16', 95,  '2026-07-17 18:00:00-03', 'scheduled'),
  ('round_of_16', 96,  '2026-07-17 21:00:00-03', 'scheduled');

-- Quartas de final
insert into public.matches (phase, match_number, match_date, status) values
  ('quarter_final', 97, '2026-07-20 18:00:00-03', 'scheduled'),
  ('quarter_final', 98, '2026-07-20 21:00:00-03', 'scheduled'),
  ('quarter_final', 99, '2026-07-21 18:00:00-03', 'scheduled'),
  ('quarter_final', 100,'2026-07-21 21:00:00-03', 'scheduled');

-- Semifinais
insert into public.matches (phase, match_number, match_date, status) values
  ('semi_final', 101, '2026-07-24 21:00:00-03', 'scheduled'),
  ('semi_final', 102, '2026-07-25 21:00:00-03', 'scheduled');

-- Disputa de 3º lugar
insert into public.matches (phase, match_number, match_date, venue, city, status) values
  ('third_place', 103, '2026-07-28 21:00:00-03', 'MetLife Stadium', 'Nova York', 'scheduled');

-- Final
insert into public.matches (phase, match_number, match_date, venue, city, status) values
  ('final', 104, '2026-07-29 21:00:00-03', 'MetLife Stadium', 'Nova York', 'scheduled');
