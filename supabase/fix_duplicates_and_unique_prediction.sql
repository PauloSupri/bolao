-- 1. Remove jogos duplicados (mantém o mais antigo de cada match_number)
DELETE FROM matches
WHERE id NOT IN (
  SELECT DISTINCT ON (match_number, phase) id
  FROM matches
  ORDER BY match_number, phase, created_at ASC
);

-- 2. Garante que cada usuário só pode ter um palpite por jogo
ALTER TABLE predictions
  DROP CONSTRAINT IF EXISTS predictions_user_match_unique;

ALTER TABLE predictions
  ADD CONSTRAINT predictions_user_match_unique UNIQUE (user_id, match_id);
