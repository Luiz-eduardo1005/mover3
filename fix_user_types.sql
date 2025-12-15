-- Script para corrigir e padronizar o campo user_type na tabela profiles
-- Execute este script no Supabase (SQL editor) com cuidado.

-- 1. Garantir que a coluna user_type exista
alter table profiles
add column if not exists user_type text;

-- 2. Definir valor padrão "candidate" para registros sem user_type
update profiles
set user_type = 'candidate'
where user_type is null or trim(user_type) = '';

-- 3. (Opcional) Forçar valores válidos apenas
-- Você pode ajustar este constraint de acordo com sua necessidade.
alter table profiles
add constraint profiles_user_type_check
check (user_type in ('candidate', 'employer'));


