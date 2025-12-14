# 📋 Guia de Migração do Supabase

Este guia explica como aplicar as mudanças necessárias no banco de dados Supabase.

## 🚀 Como Executar

### Opção 1: SQL Editor do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole todo o conteúdo do arquivo `supabase_migrations.sql`
6. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
7. Verifique se todas as mensagens de sucesso apareceram

### Opção 2: Via CLI do Supabase

Se você tem o Supabase CLI instalado:

```bash
# Certifique-se de estar logado
supabase login

# Aplique a migração
supabase db push
```

## ✅ O que o script faz

1. **Adiciona colunas necessárias:**
   - `employer_id` na tabela `job_postings`
   - `status` na tabela `job_postings`
   - `status` na tabela `job_applications`
   - `candidate_id` na tabela `job_applications` (se não existir)
   - `user_type` na tabela `profiles` (se não existir)

2. **Cria índices para melhor performance:**
   - Índices em `employer_id`, `status`, `candidate_id`, etc.

3. **Configura políticas RLS (Row Level Security):**
   - Empresas veem apenas suas vagas
   - Empresas podem gerenciar candidaturas de suas vagas
   - Candidatos veem apenas suas próprias candidaturas

4. **Atualiza dados existentes:**
   - Define valores padrão para registros antigos

## ⚠️ Importante

- O script é **idempotente** (pode ser executado múltiplas vezes sem problemas)
- Ele verifica se as colunas já existem antes de criar
- Não vai apagar dados existentes
- As políticas antigas são removidas antes de criar novas (para evitar conflitos)

## 🔍 Verificação

Após executar, você pode verificar se tudo funcionou:

```sql
-- Verificar colunas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('job_postings', 'job_applications', 'profiles')
ORDER BY table_name, column_name;

-- Verificar políticas RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('job_postings', 'job_applications');
```

## 🆘 Problemas?

Se encontrar algum erro:

1. Verifique se você tem permissões de administrador no Supabase
2. Certifique-se de que as tabelas `job_postings`, `job_applications` e `profiles` existem
3. Verifique os logs no SQL Editor para ver mensagens de erro específicas

## 📝 Notas

- O script usa `DO $$` blocks para verificar se colunas existem antes de criar
- Todas as operações são seguras e não vão quebrar dados existentes
- As políticas RLS garantem que empresas só vejam suas próprias vagas e candidaturas

