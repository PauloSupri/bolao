-- Adiciona coluna goals à tabela prediction_goalscorers
-- Execute no Supabase SQL Editor

ALTER TABLE prediction_goalscorers
  ADD COLUMN IF NOT EXISTS goals integer NOT NULL DEFAULT 1;
