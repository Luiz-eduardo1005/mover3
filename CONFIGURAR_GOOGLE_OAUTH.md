# 🔐 Guia: Configurar Google OAuth no Supabase

Este guia vai te ajudar a habilitar o login com Google no seu projeto Supabase.

## 📋 Pré-requisitos

- Acesso ao painel do Supabase
- Acesso ao Google Cloud Console (se precisar criar credenciais)

---

## 🚀 Passo 1: Habilitar Google Provider no Supabase

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta

2. **Selecione seu projeto:**
   - Escolha o projeto: **mover3-banco** (ou o projeto com URL `dqsgxbheslqmqsvmmqfk`)

3. **Navegue até Authentication:**
   - No menu lateral esquerdo, clique em **Authentication**
   - Depois clique em **Providers**

4. **Ative o Google:**
   - Role até encontrar o provider **Google**
   - Clique no **toggle** para ativar (deve ficar verde/azul)

5. **Configure as credenciais:**
   - **Client ID (OAuth):** `556576785426-tss0i95svvhhbsmao1asse0pklc6agjs.apps.googleusercontent.com`
   - **Client Secret (OAuth):** 
     - Se você já tem, cole aqui
     - Se não tem, veja o Passo 2 abaixo

6. **Configure Redirect URLs:**
   - No campo **Redirect URLs**, adicione as seguintes URLs (uma por linha):
     ```
     https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback
     http://localhost:3000/auth/callback
     ```
   - Se tiver um domínio em produção, adicione também:
     ```
     https://seu-dominio.vercel.app/auth/callback
     ```

7. **Salve as alterações:**
   - Clique em **Save** ou **Salvar**

---

## 🔑 Passo 2: Obter Client Secret (se necessário)

Se você não tem o Client Secret do Google:

1. **Acesse o Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Faça login com a conta Google que criou o OAuth

2. **Navegue até Credentials:**
   - No menu lateral, vá em **APIs & Services** → **Credentials**

3. **Encontre seu OAuth 2.0 Client ID:**
   - Procure pelo Client ID: `556576785426-tss0i95svvhhbsmao1asse0pklc6agjs`
   - Clique nele para editar

4. **Copie o Client Secret:**
   - No campo **Client secret**, clique em **Show** para revelar
   - Copie o valor
   - Cole no Supabase (Passo 1, item 5)

5. **Verifique as Redirect URIs:**
   - No Google Cloud Console, na seção **Authorized redirect URIs**, certifique-se de ter:
     ```
     https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback
     ```
   - Se não tiver, adicione e salve

---

## ✅ Passo 3: Verificar Configuração de URL no Supabase

1. **Vá em Authentication → URL Configuration:**
   - No menu lateral, Authentication → **URL Configuration**

2. **Configure Site URL:**
   - **Site URL:** `http://localhost:5173` (para desenvolvimento)
   - Ou sua URL de produção se tiver

3. **Adicione Redirect URLs:**
   - Em **Redirect URLs**, adicione:
     ```
     http://localhost:5173/**
     http://localhost:3000/**
     https://dqsgxbheslqmqsvmmqfk.supabase.co/**
     ```
   - Se tiver produção:
     ```
     https://seu-dominio.vercel.app/**
     ```

4. **Salve as alterações**

---

## 🧪 Passo 4: Testar o Login

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse a página de login:**
   - Vá para: `http://localhost:5173/login`

3. **Teste o botão Google:**
   - Clique em **"Continuar com Google"**
   - Deve redirecionar para a página de login do Google
   - Após autorizar, deve voltar para `/auth/callback`
   - E então redirecionar para `/profile`

---

## ❌ Problemas Comuns e Soluções

### Erro: "Unsupported provider: provider is not enabled"
**Solução:** O Google provider não está ativado. Volte ao Passo 1 e certifique-se de que o toggle está ativado.

### Erro: "redirect_uri_mismatch"
**Solução:** 
- Verifique se a URL de callback está correta no Supabase (Passo 1)
- Verifique se a mesma URL está no Google Cloud Console (Passo 2)

### Erro: "invalid_client"
**Solução:**
- Verifique se o Client ID e Client Secret estão corretos
- Certifique-se de que copiou sem espaços extras

### Login funciona mas não cria perfil
**Solução:** 
- Verifique se a tabela `profiles` existe no Supabase
- Verifique se o trigger `handle_new_user` está criado (veja SUPABASE_SETUP.md)

---

## 📝 Checklist Final

Antes de testar, certifique-se de que:

- [ ] Google provider está **ativado** no Supabase
- [ ] Client ID está configurado corretamente
- [ ] Client Secret está configurado corretamente
- [ ] Redirect URLs estão configuradas no Supabase
- [ ] Redirect URIs estão configuradas no Google Cloud Console
- [ ] Site URL está configurada no Supabase
- [ ] Tabela `profiles` existe no banco de dados
- [ ] Trigger `handle_new_user` está criado (opcional, mas recomendado)

---

## 🎉 Pronto!

Após seguir todos os passos, o login com Google deve funcionar perfeitamente!

Se ainda tiver problemas, verifique:
1. O console do navegador (F12) para erros
2. Os logs do Supabase (Authentication → Logs)
3. Se as variáveis de ambiente estão corretas no `.env.local`

