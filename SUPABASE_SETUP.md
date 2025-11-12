# 📋 Configuração do Supabase - MOVER

Este documento contém todas as instruções necessárias para configurar o banco de dados Supabase para o projeto MOVER.

## 🔑 Credenciais do Projeto

- **URL da API:** `https://mcvkfxpgrmraqsjrcuxu.supabase.co`
- **Publishable Key:** `sb_publishable_3uZOs5Nia5bBt_p1EdGIYA_oVXZBX4T`
- **Secret Key:** `sb_secret_OUkYwp15s4eqHmqDuofbOg_t6mQu4Rf`
- **Senha do Supabase:** `U7kdcl6zOWHvMIcv`

## 📊 Tabelas Necessárias

### 1. Tabela `profiles`

Esta tabela armazena os perfis dos usuários (candidatos e empresas).

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('candidate', 'employer')),
  
  -- Campos específicos para candidatos
  profession TEXT,
  location TEXT,
  bio TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  languages JSONB,
  
  -- Campos específicos para empresas
  company_name TEXT,
  company_size TEXT,
  company_description TEXT,
  
  -- Configurações de privacidade
  profile_visible BOOLEAN DEFAULT true,
  resume_searchable BOOLEAN DEFAULT true,
  job_alerts_enabled BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para recrutadores visualizarem perfis de candidatos
CREATE POLICY "Employers can view candidate profiles" ON profiles
  FOR SELECT USING (
    user_type = 'candidate' AND 
    profile_visible = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );
```

### 2. Tabela `job_postings`

Esta tabela armazena as vagas de emprego postadas pelas empresas.

```sql
CREATE TABLE job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações básicas
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  work_model TEXT NOT NULL CHECK (work_model IN ('presencial', 'remoto', 'hibrido')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('clt', 'pj', 'estagio', 'temporario')),
  experience_level TEXT CHECK (experience_level IN ('estagiario', 'junior', 'pleno', 'senior', 'especialista')),
  
  -- Remuneração
  salary_range TEXT,
  
  -- Benefícios
  benefits JSONB DEFAULT '[]'::jsonb,
  
  -- Habilidades
  required_skills TEXT[],
  
  -- Plano de anúncio
  plan_type TEXT CHECK (plan_type IN ('basic', 'standard', 'premium')) DEFAULT 'basic',
  plan_price DECIMAL(10, 2),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'expired')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Estatísticas
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_job_postings_employer_id ON job_postings(employer_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_location ON job_postings(location);
CREATE INDEX idx_job_postings_work_model ON job_postings(work_model);
CREATE INDEX idx_job_postings_created_at ON job_postings(created_at DESC);

-- RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can view active job postings" ON job_postings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can insert own job postings" ON job_postings
  FOR INSERT WITH CHECK (
    auth.uid() = employer_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );

CREATE POLICY "Employers can update own job postings" ON job_postings
  FOR UPDATE USING (auth.uid() = employer_id);

CREATE POLICY "Employers can delete own job postings" ON job_postings
  FOR DELETE USING (auth.uid() = employer_id);
```

### 3. Tabela `resumes`

Esta tabela armazena os currículos dos candidatos.

```sql
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações pessoais
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  profession TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  
  -- Resumo profissional
  professional_summary TEXT,
  
  -- Experiências profissionais
  experiences JSONB DEFAULT '[]'::jsonb,
  
  -- Formação acadêmica
  education JSONB DEFAULT '[]'::jsonb,
  
  -- Habilidades
  skills TEXT[],
  
  -- Idiomas
  languages JSONB DEFAULT '[]'::jsonb,
  
  -- Cursos e certificações
  courses JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Preferências de trabalho
  desired_position TEXT,
  desired_location TEXT,
  employment_type_preference TEXT,
  work_model_preference TEXT,
  salary_expectation TEXT,
  
  -- Documentos
  resume_file_url TEXT,
  
  -- Configurações
  is_visible BOOLEAN DEFAULT true,
  is_searchable BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_resumes_candidate_id ON resumes(candidate_id);
CREATE INDEX idx_resumes_is_searchable ON resumes(is_searchable) WHERE is_searchable = true;

-- RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Candidates can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (
    auth.uid() = candidate_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'candidate'
    )
  );

CREATE POLICY "Candidates can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = candidate_id);

-- Política para recrutadores visualizarem currículos pesquisáveis
CREATE POLICY "Employers can view searchable resumes" ON resumes
  FOR SELECT USING (
    is_searchable = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );
```

### 4. Tabela `courses`

Esta tabela armazena os cursos postados pelos usuários.

```sql
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações do curso
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  duration TEXT,
  level TEXT CHECK (level IN ('iniciante', 'intermediario', 'avancado', 'iniciante-avancado')),
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  
  -- Categorias
  categories TEXT[],
  
  -- Certificação
  certification_included BOOLEAN DEFAULT false,
  
  -- Imagem
  image_url TEXT,
  
  -- URLs
  course_url TEXT,
  provider_url TEXT,
  
  -- Avaliação
  rating DECIMAL(3, 2),
  rating_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_courses_user_id ON courses(user_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_categories ON courses USING GIN(categories);

-- RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own courses" ON courses
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Tabela `job_applications`

Esta tabela armazena as candidaturas dos usuários às vagas.

```sql
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  
  -- Status da candidatura
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'in_review', 'interview', 'accepted', 'rejected', 'withdrawn')),
  
  -- Mensagem do candidato
  cover_letter TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para evitar candidaturas duplicadas
  UNIQUE(job_posting_id, candidate_id)
);

-- Índices
CREATE INDEX idx_job_applications_job_posting_id ON job_applications(job_posting_id);
CREATE INDEX idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Candidates can view own applications" ON job_applications
  FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can insert own applications" ON job_applications
  FOR INSERT WITH CHECK (
    auth.uid() = candidate_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'candidate'
    )
  );

CREATE POLICY "Employers can view applications to their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_postings 
      WHERE id = job_applications.job_posting_id 
      AND employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update applications to their jobs" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_postings 
      WHERE id = job_applications.job_posting_id 
      AND employer_id = auth.uid()
    )
  );
```

### 6. Tabela `saved_jobs`

Esta tabela armazena as vagas salvas pelos candidatos.

```sql
CREATE TABLE saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para evitar salvar a mesma vaga duas vezes
  UNIQUE(job_posting_id, candidate_id)
);

-- Índices
CREATE INDEX idx_saved_jobs_candidate_id ON saved_jobs(candidate_id);

-- RLS
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Candidates can manage own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = candidate_id);
```

## 🔐 Configuração de Autenticação

### 1. Configurar Google OAuth no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá em **Authentication** → **Providers**
3. Ative o provider **Google**
4. Configure as credenciais:
   - **Client ID:** `556576785426-tss0i95svvhhbsmao1asse0pklc6agjs.apps.googleusercontent.com`
   - **Client Secret:** (obtenha no Google Cloud Console)
5. Em **Redirect URLs**, adicione as seguintes URLs:
   - **Produção:** `https://moverbeta.vercel.app/auth/callback`
   - **Desenvolvimento local:** `http://localhost:3000/auth/callback`
   - **URL do Supabase (necessária):** `https://mcvkfxpgrmraqsjrcuxu.supabase.co/auth/v1/callback`

### 2. Configurar URL de Redirecionamento no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services** → **Credentials**
3. Edite o OAuth 2.0 Client ID
4. Adicione as seguintes URLs em **Authorized redirect URIs**:
   - `https://mcvkfxpgrmraqsjrcuxu.supabase.co/auth/v1/callback`
   - `https://moverbeta.vercel.app/auth/callback` (para produção)
   - `http://localhost:3000/auth/callback` (para desenvolvimento local)

### 3. Configurar Site URL no Supabase

1. No painel do Supabase, vá em **Authentication** → **URL Configuration**
2. Configure os seguintes campos:
   - **Site URL:** `https://moverbeta.vercel.app`
   - **Redirect URLs:** Adicione as mesmas URLs do passo 1.5

## 📝 Funções e Triggers

### Trigger para atualizar `updated_at`

```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger para criar perfil automaticamente

```sql
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para chamar a função após criar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🗄️ Storage Buckets

### Bucket para Currículos

```sql
-- Criar bucket para armazenar currículos em PDF
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Política para usuários fazerem upload de seus próprios currículos
CREATE POLICY "Users can upload own resumes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para usuários visualizarem seus próprios currículos
CREATE POLICY "Users can view own resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para recrutadores visualizarem currículos de candidatos
CREATE POLICY "Employers can view candidate resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );
```

## 📋 Ordem de Execução dos Scripts

Execute os scripts SQL na seguinte ordem:

1. **Tabela `profiles`** (primeiro, pois é referenciada por outras)
2. **Tabela `job_postings`**
3. **Tabela `resumes`**
4. **Tabela `courses`**
5. **Tabela `job_applications`**
6. **Tabela `saved_jobs`**
7. **Funções e Triggers**
8. **Storage Buckets**

## ⚠️ Notas Importantes

1. **RLS (Row Level Security)**: Todas as tabelas têm RLS habilitado para segurança.
2. **Políticas de Acesso**: As políticas RLS garantem que usuários só acessem dados próprios (exceto quando permitido explicitamente).
3. **Índices**: Os índices foram criados para otimizar consultas frequentes.
4. **Constraints**: As constraints garantem integridade referencial e evitam dados duplicados.
5. **Triggers**: Os triggers automatizam a atualização de timestamps e criação de perfis.

## 🔧 Variáveis de Ambiente

Adicione ao arquivo `.env` (ou `.env.local`):

```env
VITE_SUPABASE_URL=https://mcvkfxpgrmraqsjrcuxu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_3uZOs5Nia5bBt_p1EdGIYA_oVXZBX4T
```

## 📚 Documentação Adicional

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Autenticação](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

