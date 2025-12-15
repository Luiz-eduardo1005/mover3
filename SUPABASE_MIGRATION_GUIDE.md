# Guia de migração de `user_type` no Supabase (MOVER)

Este guia explica, de forma resumida, como garantir que a tabela `profiles`
esteja preparada para diferenciar **candidatos** e **empresas**.

## 1. Campo `user_type` na tabela `profiles`

- Coluna: `user_type`
- Tipo sugerido: `text` (com constraint para `'candidate'` ou `'employer'`)
- Papel: indicar se a conta é de **candidato** ou **empresa**.

### Passos básicos

1. Abra o Supabase Studio.
2. Vá em **SQL Editor**.
3. Cole o conteúdo de `fix_user_types.sql`.
4. Execute o script.

Isso irá:
- Criar a coluna `user_type` caso não exista.
- Definir `user_type = 'candidate'` para perfis sem valor.
- Adicionar um `CHECK` para limitar valores aceitáveis.

## 2. Novos cadastros

No código (AuthContext), o `signUp` sempre grava `user_type` como:

- `'candidate'` para contas de candidato.
- `'employer'` para contas de empresa.

## 3. Logins e redirecionamentos

Depois do login (Email/Senha ou Google):

- É buscado o `profile.user_type`.
- Se for `employer` → redireciona para `/company/dashboard`.
- Caso contrário → redireciona para `/profile`.

## 4. Rotas protegidas

O componente `ProtectedRoute` garante que:

- Rotas de empresa só sejam acessadas por `user_type = 'employer'`.
- Rotas de candidato só sejam acessadas por `user_type = 'candidate'`.

Assim, a separação entre áreas de candidato e empresa fica consistente
no backend (Supabase) e no frontend (React).


