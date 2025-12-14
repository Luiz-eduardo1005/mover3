/**
 * MOVER - Migrações do Supabase
 * 
 * Este arquivo contém todas as mudanças necessárias no banco de dados
 * para suportar as funcionalidades de empresas e candidatos separadas.
 * 
 * Execute este arquivo no SQL Editor do Supabase Dashboard.
 */

-- ============================================
-- 0. CRIAR TABELAS SE NÃO EXISTIREM
-- ============================================

-- Criar tabela job_postings se não existir
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  company_name TEXT,
  location TEXT,
  employment_type TEXT,
  salary_range TEXT,
  work_model TEXT,
  requirements TEXT[],
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela job_applications se não existir
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id UUID,
  candidate_id UUID,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Criar tabela saved_jobs se não existir
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL,
  job_posting_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (candidate_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE,
  UNIQUE(candidate_id, job_posting_id)
);

-- ============================================
-- 1. VERIFICAR E ADICIONAR COLUNAS NECESSÁRIAS
-- ============================================

-- Tabela job_postings: Adicionar employer_id se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'employer_id'
  ) THEN
    ALTER TABLE job_postings 
    ADD COLUMN employer_id UUID;
    
    -- Adicionar foreign key se a tabela auth.users existir
    BEGIN
      ALTER TABLE job_postings 
      ADD CONSTRAINT job_postings_employer_id_fkey 
      FOREIGN KEY (employer_id) REFERENCES auth.users(id);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Foreign key para auth.users não pôde ser criada, mas coluna foi adicionada';
    END;
    
    RAISE NOTICE 'Coluna employer_id adicionada à tabela job_postings';
  ELSE
    RAISE NOTICE 'Coluna employer_id já existe na tabela job_postings';
  END IF;
END $$;

-- Tabela job_postings: Adicionar status se não existir
DO $$ 
BEGIN
  -- Remover constraint antiga se existir
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name LIKE 'job_postings_status_check'
  ) THEN
    ALTER TABLE job_postings DROP CONSTRAINT job_postings_status_check;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'status'
  ) THEN
    ALTER TABLE job_postings 
    ADD COLUMN status TEXT DEFAULT 'active';
    
    RAISE NOTICE 'Coluna status adicionada à tabela job_postings';
  ELSE
    RAISE NOTICE 'Coluna status já existe na tabela job_postings';
  END IF;
  
  -- Adicionar constraint de check
  ALTER TABLE job_postings 
  ADD CONSTRAINT job_postings_status_check 
  CHECK (status IN ('active', 'inactive', 'closed'));
END $$;

-- Tabela job_applications: Adicionar status se não existir
DO $$ 
BEGIN
  -- Primeiro, remover constraint se existir para poder modificar
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name LIKE 'job_applications_status_check'
  ) THEN
    ALTER TABLE job_applications DROP CONSTRAINT job_applications_status_check;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'status'
  ) THEN
    ALTER TABLE job_applications 
    ADD COLUMN status TEXT DEFAULT 'pending';
    
    RAISE NOTICE 'Coluna status adicionada à tabela job_applications';
  ELSE
    RAISE NOTICE 'Coluna status já existe na tabela job_applications';
  END IF;
  
  -- Adicionar constraint de check
  ALTER TABLE job_applications 
  ADD CONSTRAINT job_applications_status_check 
  CHECK (status IN ('pending', 'accepted', 'rejected', 'viewed', 'reviewing', 'interview'));
END $$;

-- Tabela job_applications: Verificar se candidate_id existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'candidate_id'
  ) THEN
    -- Verificar se a tabela profiles existe antes de criar foreign key
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
      ALTER TABLE job_applications 
      ADD COLUMN candidate_id UUID REFERENCES profiles(id);
    ELSE
      ALTER TABLE job_applications 
      ADD COLUMN candidate_id UUID;
    END IF;
    
    RAISE NOTICE 'Coluna candidate_id adicionada à tabela job_applications';
  ELSE
    RAISE NOTICE 'Coluna candidate_id já existe na tabela job_applications';
  END IF;
END $$;

-- Tabela profiles: Verificar se user_type existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN user_type TEXT 
    CHECK (user_type IN ('candidate', 'employer'));
    
    RAISE NOTICE 'Coluna user_type adicionada à tabela profiles';
  ELSE
    RAISE NOTICE 'Coluna user_type já existe na tabela profiles';
  END IF;
END $$;

-- ============================================
-- 2. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================

-- Índices para job_postings
CREATE INDEX IF NOT EXISTS idx_job_postings_employer_id 
ON job_postings(employer_id);

CREATE INDEX IF NOT EXISTS idx_job_postings_status 
ON job_postings(status);

-- Índices para job_applications
CREATE INDEX IF NOT EXISTS idx_job_applications_job_posting_id 
ON job_applications(job_posting_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id 
ON job_applications(candidate_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_status 
ON job_applications(status);

-- Índice para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_type 
ON profiles(user_type);

-- ============================================
-- 3. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- Habilitar RLS nas tabelas se ainda não estiver habilitado
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Empresas veem apenas suas vagas" ON job_postings;
DROP POLICY IF EXISTS "Empresas podem criar vagas" ON job_postings;
DROP POLICY IF EXISTS "Empresas podem atualizar suas vagas" ON job_postings;
DROP POLICY IF EXISTS "Empresas podem excluir suas vagas" ON job_postings;
DROP POLICY IF EXISTS "Empresas veem candidaturas de suas vagas" ON job_applications;
DROP POLICY IF EXISTS "Empresas podem atualizar status de candidaturas" ON job_applications;
DROP POLICY IF EXISTS "Candidatos veem suas próprias candidaturas" ON job_applications;
DROP POLICY IF EXISTS "Candidatos podem criar candidaturas" ON job_applications;

-- Políticas para job_postings
-- Empresas veem apenas suas vagas
CREATE POLICY "Empresas veem apenas suas vagas"
ON job_postings
FOR SELECT
USING (
  auth.uid() = employer_id OR
  status = 'active' -- Vagas ativas são visíveis para todos
);

-- Empresas podem criar vagas
CREATE POLICY "Empresas podem criar vagas"
ON job_postings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'employer'
  )
  AND employer_id = auth.uid()
);

-- Empresas podem atualizar suas vagas
CREATE POLICY "Empresas podem atualizar suas vagas"
ON job_postings
FOR UPDATE
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);

-- Empresas podem excluir suas vagas
CREATE POLICY "Empresas podem excluir suas vagas"
ON job_postings
FOR DELETE
USING (auth.uid() = employer_id);

-- Políticas para job_applications
-- Empresas veem candidaturas de suas vagas
CREATE POLICY "Empresas veem candidaturas de suas vagas"
ON job_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM job_postings 
    WHERE job_postings.id = job_applications.job_posting_id 
    AND job_postings.employer_id = auth.uid()
  )
  OR
  candidate_id = auth.uid() -- Candidatos veem suas próprias candidaturas
);

-- Empresas podem atualizar status de candidaturas
CREATE POLICY "Empresas podem atualizar status de candidaturas"
ON job_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM job_postings 
    WHERE job_postings.id = job_applications.job_posting_id 
    AND job_postings.employer_id = auth.uid()
  )
);

-- Candidatos podem criar candidaturas
CREATE POLICY "Candidatos podem criar candidaturas"
ON job_applications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'candidate'
  )
  AND candidate_id = auth.uid()
);

-- Candidatos veem suas próprias candidaturas (já coberto acima, mas explícito)
CREATE POLICY "Candidatos veem suas próprias candidaturas"
ON job_applications
FOR SELECT
USING (candidate_id = auth.uid());

-- ============================================
-- 4. ATUALIZAR DADOS EXISTENTES (SE NECESSÁRIO)
-- ============================================

-- Atualizar status padrão para vagas existentes sem status
UPDATE job_postings 
SET status = 'active' 
WHERE status IS NULL;

-- Atualizar status padrão para candidaturas existentes sem status
UPDATE job_applications 
SET status = 'pending' 
WHERE status IS NULL;

-- Atualizar user_type padrão para perfis existentes sem user_type
-- (assumindo que perfis antigos são candidatos)
UPDATE profiles 
SET user_type = 'candidate' 
WHERE user_type IS NULL;

-- ============================================
-- 5. VERIFICAÇÕES FINAIS
-- ============================================

-- Verificar se todas as colunas foram criadas
DO $$
DECLARE
  missing_columns TEXT[];
BEGIN
  missing_columns := ARRAY[]::TEXT[];
  
  -- Verificar job_postings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'employer_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'job_postings.employer_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'status'
  ) THEN
    missing_columns := array_append(missing_columns, 'job_postings.status');
  END IF;
  
  -- Verificar job_applications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'status'
  ) THEN
    missing_columns := array_append(missing_columns, 'job_applications.status');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'candidate_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'job_applications.candidate_id');
  END IF;
  
  -- Verificar profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    missing_columns := array_append(missing_columns, 'profiles.user_type');
  END IF;
  
  IF array_length(missing_columns, 1) > 0 THEN
    RAISE EXCEPTION 'Colunas faltando: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE 'Todas as colunas necessárias foram criadas com sucesso!';
  END IF;
END $$;

-- Mensagem final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migração concluída com sucesso!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Todas as mudanças foram aplicadas:';
  RAISE NOTICE '- Colunas adicionadas';
  RAISE NOTICE '- Índices criados';
  RAISE NOTICE '- Políticas RLS configuradas';
  RAISE NOTICE '========================================';
END $$;

