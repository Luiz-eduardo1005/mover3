-- ============================================
-- MOVER - Script SQL Completo
-- Copie e cole TUDO de uma vez no SQL Editor do Supabase
-- ============================================

-- 1. Tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('candidate', 'employer')),
  profession TEXT,
  location TEXT,
  bio TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  languages JSONB DEFAULT '[]'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  company_name TEXT,
  company_size TEXT,
  company_description TEXT,
  profile_visible BOOLEAN DEFAULT true,
  resume_searchable BOOLEAN DEFAULT true,
  job_alerts_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Employers can view candidate profiles" ON profiles;
CREATE POLICY "Employers can view candidate profiles" ON profiles
  FOR SELECT USING (
    user_type = 'candidate' AND 
    profile_visible = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );

-- 2. Tabela job_postings
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  work_model TEXT NOT NULL CHECK (work_model IN ('presencial', 'remoto', 'hibrido')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('clt', 'pj', 'estagio', 'temporario')),
  experience_level TEXT CHECK (experience_level IN ('estagiario', 'junior', 'pleno', 'senior', 'especialista')),
  salary_range TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  required_skills TEXT[],
  plan_type TEXT CHECK (plan_type IN ('basic', 'standard', 'premium')) DEFAULT 'basic',
  plan_price DECIMAL(10, 2),
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'expired')),
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_postings_employer_id ON job_postings(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_location ON job_postings(location);
CREATE INDEX IF NOT EXISTS idx_job_postings_work_model ON job_postings(work_model);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at DESC);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active job postings" ON job_postings;
CREATE POLICY "Anyone can view active job postings" ON job_postings
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Employers can insert own job postings" ON job_postings;
CREATE POLICY "Employers can insert own job postings" ON job_postings
  FOR INSERT WITH CHECK (
    auth.uid() = employer_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );

DROP POLICY IF EXISTS "Employers can update own job postings" ON job_postings;
CREATE POLICY "Employers can update own job postings" ON job_postings
  FOR UPDATE USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can delete own job postings" ON job_postings;
CREATE POLICY "Employers can delete own job postings" ON job_postings
  FOR DELETE USING (auth.uid() = employer_id);

-- 3. Tabela saved_jobs (VAGAS SALVAS)
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_posting_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_candidate_id ON saved_jobs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_posting_id ON saved_jobs(job_posting_id);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Candidates can manage own saved jobs" ON saved_jobs;
CREATE POLICY "Candidates can manage own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = candidate_id);

-- 4. Tabela job_applications (CANDIDATURAS)
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'in_review', 'interview', 'accepted', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_posting_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_posting_id ON job_applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Candidates can view own applications" ON job_applications;
CREATE POLICY "Candidates can view own applications" ON job_applications
  FOR SELECT USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Candidates can insert own applications" ON job_applications;
CREATE POLICY "Candidates can insert own applications" ON job_applications
  FOR INSERT WITH CHECK (
    auth.uid() = candidate_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'candidate'
    )
  );

DROP POLICY IF EXISTS "Employers can view applications to their jobs" ON job_applications;
CREATE POLICY "Employers can view applications to their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_postings 
      WHERE id = job_applications.job_posting_id 
      AND employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Employers can update applications to their jobs" ON job_applications;
CREATE POLICY "Employers can update applications to their jobs" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_postings 
      WHERE id = job_applications.job_posting_id 
      AND employer_id = auth.uid()
    )
  );

-- 5. Triggers e Funções

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;
CREATE TRIGGER update_job_postings_updated_at 
  BEFORE UPDATE ON job_postings
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at 
  BEFORE UPDATE ON job_applications
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidate')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();


