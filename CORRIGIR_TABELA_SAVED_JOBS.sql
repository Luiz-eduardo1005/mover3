-- ============================================
-- Script de Correção: Renomear colunas da tabela saved_jobs
-- Execute este script se você recebeu erro "column candidate_id does not exist"
-- ============================================

-- Verificar se a tabela existe com nomes errados e corrigir
DO $$
BEGIN
  -- Se a tabela tem user_id e job_id, renomear para candidate_id e job_posting_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_jobs' 
    AND column_name = 'user_id'
  ) THEN
    -- Renomear coluna user_id para candidate_id
    ALTER TABLE saved_jobs RENAME COLUMN user_id TO candidate_id;
    RAISE NOTICE 'Coluna user_id renomeada para candidate_id';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_jobs' 
    AND column_name = 'job_id'
  ) THEN
    -- Renomear coluna job_id para job_posting_id
    ALTER TABLE saved_jobs RENAME COLUMN job_id TO job_posting_id;
    RAISE NOTICE 'Coluna job_id renomeada para job_posting_id';
  END IF;
END $$;

-- Recriar índices com os nomes corretos
DROP INDEX IF EXISTS idx_saved_jobs_user_id;
DROP INDEX IF EXISTS idx_saved_jobs_job_id;

CREATE INDEX IF NOT EXISTS idx_saved_jobs_candidate_id ON saved_jobs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_posting_id ON saved_jobs(job_posting_id);

-- Recriar constraint UNIQUE com os nomes corretos
ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_user_id_job_id_key;
ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_candidate_id_job_posting_id_key;
ALTER TABLE saved_jobs ADD CONSTRAINT saved_jobs_candidate_id_job_posting_id_key 
  UNIQUE (candidate_id, job_posting_id);

-- Recriar foreign keys se necessário
DO $$
BEGIN
  -- Verificar e recriar foreign key para candidate_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'saved_jobs_candidate_id_fkey'
    AND table_name = 'saved_jobs'
  ) THEN
    ALTER TABLE saved_jobs 
    ADD CONSTRAINT saved_jobs_candidate_id_fkey 
    FOREIGN KEY (candidate_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  -- Verificar e recriar foreign key para job_posting_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'saved_jobs_job_posting_id_fkey'
    AND table_name = 'saved_jobs'
  ) THEN
    ALTER TABLE saved_jobs 
    ADD CONSTRAINT saved_jobs_job_posting_id_fkey 
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Recriar políticas RLS com os nomes corretos
DROP POLICY IF EXISTS "Users can view own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can insert own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can delete own saved jobs" ON saved_jobs;

DROP POLICY IF EXISTS "Candidates can manage own saved jobs" ON saved_jobs;
CREATE POLICY "Candidates can manage own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = candidate_id);

-- ============================================
-- FIM DO SCRIPT DE CORREÇÃO
-- ============================================

