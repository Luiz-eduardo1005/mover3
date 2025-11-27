# 🔐 Configuração Completa - Login com Google para mover3.vercel.app

## 🎯 Objetivo
Configurar o login com Google para que os usuários façam login e sejam redirecionados de volta para `https://mover3.vercel.app/` logados.

---

## ✅ Passo 1: Configurar Supabase Dashboard

### 1.1 Acessar o Supabase
1. Acesse: **https://supabase.com/dashboard**
2. Faça login na sua conta
3. Selecione o projeto: **mover3-banco** (ou o projeto com URL `dqsgxbheslqmqsvmmqfk`)

### 1.2 Configurar URL Configuration
1. No menu lateral, clique em **Authentication**
2. Clique em **URL Configuration**

3. **Configure Site URL:**
   ```
   https://mover3.vercel.app
   ```

4. **Configure Redirect URLs:**
   Adicione todas essas URLs (uma por linha):
   ```
   https://mover3.vercel.app/**
   https://mover3.vercel.app/auth/callback
   http://localhost:8080/**
   http://localhost:8080/auth/callback
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```

5. **Clique em "Save"** (Salvar)

### 1.3 Verificar Google Provider
1. Vá em **Authentication** → **Providers**
2. Clique em **Google**
3. Verifique se está **ativado** (toggle verde/azul)
4. Verifique se tem:
   - **Client ID:** (seu Client ID do Google Cloud Console)
   - **Client Secret:** (seu Client Secret do Google Cloud Console)
5. Se estiver tudo correto, feche a janela
6. Se precisar ajustar, faça e clique em **Save**

---

## ✅ Passo 2: Configurar Google Cloud Console

### 2.1 Acessar o Google Cloud Console
1. Acesse: **https://console.cloud.google.com/**
2. Faça login com a conta Google que criou o OAuth Client
3. Selecione o projeto correto

### 2.2 Configurar OAuth Client
1. No menu lateral, vá em **APIs & Services** → **Credentials**
2. Clique no OAuth 2.0 Client ID: `312420914814-rs4hjqf5cv6t73tqvqh7r4pfohpte4vg`

### 2.3 Adicionar Redirect URIs
1. Na seção **"URIs de redirecionamento autorizados"** (Authorized redirect URIs)
2. Verifique se tem:
   ```
   https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback
   ```
3. Se **NÃO tiver**, clique em **"+ Adicionar URI"** e adicione:
   ```
   https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback
   ```

### 2.4 Salvar
1. Clique em **"Salvar"** (Save) no final da página
2. Aguarde a confirmação

---

## ✅ Passo 3: Verificar Código (Já está correto!)

O código já está configurado corretamente em `src/contexts/AuthContext.tsx`:
- Usa `window.location.origin` automaticamente
- Funciona tanto em desenvolvimento quanto em produção
- Redireciona para `/auth/callback` que processa e vai para `/profile`

**Não precisa alterar nada no código!**

---

## 🧪 Passo 4: Testar

### 4.1 Teste em Produção
1. Acesse: **https://mover3.vercel.app/login**
2. Clique em **"Continuar com Google"**
3. Faça login com sua conta Google
4. Você deve ser redirecionado de volta para: **https://mover3.vercel.app/profile**
5. Deve estar logado! ✅

### 4.2 Teste em Desenvolvimento (opcional)
1. Execute: `npm run dev`
2. Acesse: `http://localhost:8080/login`
3. Teste o login com Google
4. Deve funcionar também! ✅

---

## 🔍 Troubleshooting

### Erro: "redirect_uri_mismatch"
**Solução:**
- Verifique se a URL `https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback` está no Google Cloud Console
- Aguarde 2-5 minutos após salvar (pode levar tempo para propagar)

### Erro: "provider is not enabled"
**Solução:**
- Vá no Supabase → Authentication → Providers → Google
- Certifique-se de que o toggle está **ativado**

### Redireciona para localhost em vez de mover3.vercel.app
**Solução:**
- Verifique se o **Site URL** no Supabase está como `https://mover3.vercel.app`
- Verifique se as **Redirect URLs** incluem `https://mover3.vercel.app/**`

### Login funciona mas não cria perfil
**Solução:**
- Verifique se a tabela `profiles` existe no Supabase
- Verifique os logs do console do navegador (F12)

---

## 📋 Checklist Final

Antes de testar, certifique-se de que:

- [ ] **Supabase Site URL:** `https://mover3.vercel.app`
- [ ] **Supabase Redirect URLs:** Incluem `https://mover3.vercel.app/**` e `https://mover3.vercel.app/auth/callback`
- [ ] **Google Provider ativado** no Supabase
- [ ] **Client ID correto** no Supabase: (seu Client ID do Google Cloud Console)
- [ ] **Client Secret correto** no Supabase: (seu Client Secret do Google Cloud Console)
- [ ] **Redirect URI no Google Cloud:** `https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback`
- [ ] **Aguardou 2-5 minutos** após salvar as configurações

---

## 🎉 Pronto!

Após seguir todos os passos, o login com Google deve funcionar perfeitamente:
- ✅ Usuário faz login no Google
- ✅ É redirecionado de volta para `https://mover3.vercel.app/`
- ✅ Fica logado automaticamente
- ✅ Vai para a página de perfil

---

## 📞 Se ainda não funcionar

1. Abra o Console do navegador (F12 → Console)
2. Tente fazer login
3. Veja os logs:
   - `🔐 Iniciando login com Google...`
   - `📍 URL de redirecionamento: https://mover3.vercel.app/auth/callback`
   - `✅ Redirecionando para Google...`
4. Copie qualquer erro que aparecer
5. Verifique também os logs do Supabase: Authentication → Logs

---

**Última atualização:** Configurado para `https://mover3.vercel.app/`

