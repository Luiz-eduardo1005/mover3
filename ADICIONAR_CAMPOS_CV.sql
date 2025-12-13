-- ============================================
-- Script para adicionar campos de CV na tabela profiles
-- Execute este script se a tabela profiles já existe
-- ============================================

-- Adicionar colunas experiences e education se não existirem
DO $$
BEGIN
  -- Adicionar coluna experiences
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'experiences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN experiences JSONB DEFAULT '[]'::jsonb;
    RAISE NOTICE 'Coluna experiences adicionada';
  END IF;

  -- Adicionar coluna education
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'education'
  ) THEN
    ALTER TABLE profiles ADD COLUMN education JSONB DEFAULT '[]'::jsonb;
    RAISE NOTICE 'Coluna education adicionada';
  END IF;

  -- Garantir que languages tem default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'languages'
    AND column_default IS NULL
  ) THEN
    ALTER TABLE profiles ALTER COLUMN languages SET DEFAULT '[]'::jsonb;
    RAISE NOTICE 'Default adicionado para languages';
  END IF;
END $$;







