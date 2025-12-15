# Correções de `user_type` (candidato x empresa)

Este arquivo documenta rapidamente o que foi feito no código para garantir
que a plataforma diferencie bem **candidatos** de **empresas**.

## 1. Contexto de autenticação (`AuthContext`)

- `Profile.user_type: 'candidate' | 'employer'`.
- Ao buscar o perfil, se não existir, é criado um básico com `user_type = 'candidate'`.
- O `signUp` sempre grava `user_type` corretamente de acordo com o tipo escolhido no cadastro.

## 2. Login (`Login.tsx`)

Após login com email/senha:

- Aguarda a sessão estabilizar.
- Chama `refreshProfile()`.
- Lê o `profiles.user_type` pelo Supabase.
- Redireciona:
  - `employer` → `/company/dashboard`
  - `candidate` (ou sem valor) → `/profile`

## 3. Callback de OAuth / Email (`AuthCallback.tsx`)

- Garante que exista um registro em `profiles`.
- Se não houver perfil, cria com `user_type = 'candidate'`.
- Lê `user_type`:
  - `employer` → `/company/dashboard`
  - Caso contrário → `/profile`

## 4. Rotas protegidas (`ProtectedRoute.tsx`)

- Recebe `allowedUserTypes` (ex.: `['candidate']` ou `['employer']`).
- Se o `profile.user_type` não estiver na lista:
  - Empresa é enviada para `/company/dashboard`.
  - Candidato é enviado para `/profile`.

## 5. Separação de menus (`Header.tsx`)

### Desktop
- **Empresa autenticada**:
  - `Dashboard`, `Minhas Vagas`, `Candidaturas`, `Anunciar Vaga`.
- **Candidato**:
  - `Cadastrar Currículo`, `Minhas Candidaturas` (se logado).

### Dropdown / Mobile
- Empresa vê atalhos para:
  - `Dashboard da Empresa`, `Minhas Vagas`, `Candidaturas`.
- Candidato vê:
  - `Meu Perfil`, `Minhas Candidaturas`.

## 6. Rotas específicas (`App.tsx`)

- Candidato apenas:
  - `/curriculum`, `/applications`.
- Empresa apenas:
  - `/advertise`, `/company/dashboard`, `/company/jobs`, `/company/applications`.

Todas essas rotas usam `ProtectedRoute` com `allowedUserTypes` corretos.

## 7. Redireciono automático (`LoginRedirect.tsx`)

- Se uma **empresa** tentar abrir rota de candidato (`/profile`, `/curriculum`, `/applications`):
  - É automaticamente levada para `/company/dashboard`.
- Se um **candidato** tentar abrir rota de empresa (`/company/*`, `/advertise`):
  - É levado de volta para `/profile`.


