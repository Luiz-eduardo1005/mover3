# 🔧 Solução: Erro "server_error" no Login com Google

## ❌ Problema
Ao tentar fazer login com Google, aparece o erro:
- `error=server_error`
- `error_code=unexpected_failure`
- A sessão não é criada e o usuário volta para a tela de login

## 🔍 Causa
Este erro indica que o **Supabase não conseguiu processar o callback do Google OAuth**. Geralmente é causado por:

1. **Client Secret incorreto ou expirado** no Supabase
2. **Client ID incorreto** no Supabase
3. **Credenciais não correspondem** entre Supabase e Google Cloud Console

## ✅ Solução Passo a Passo

### 1. Verificar Credenciais no Google Cloud Console

1. Acesse: **https://console.cloud.google.com/**
2. Vá em: **APIs & Services** → **Credentials**
3. Clique no OAuth Client ID: `312420914814-rs4hjqf5cv6t73tqvqh7r4pfohpte4vg`

4. **Verifique o Client Secret:**
   - Em "Chaves secretas do cliente", verifique se está **"Ativadas"** (verde)
   - Se não estiver, você pode precisar criar uma nova
   - **Copie o Client Secret completo** (começa com `GOCSPX-`)

### 2. Atualizar Credenciais no Supabase

1. Acesse: **https://supabase.com/dashboard**
2. Selecione o projeto: **mover3-banco**
3. Vá em: **Authentication** → **Providers** → **Google**

4. **Verifique/Atualize:**
   - **Client ID:** `312420914814-rs4hjqf5cv6t73tqvqh7r4pfohpte4vg.apps.googleusercontent.com`
     - Deve estar **exatamente** assim, sem espaços
   - **Client Secret:** Cole o Client Secret do Google Cloud Console
     - Deve começar com `GOCSPX-`
     - **Sem espaços extras**
     - **Sem quebras de linha**

5. **Clique em "Save"**

### 3. Verificar Redirect URI

1. No **Google Cloud Console**, verifique se tem:
   ```
   https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback
   ```
2. Se não tiver, adicione e salve

### 4. Aguardar Propagação

Após salvar, aguarde **2-5 minutos** para as mudanças entrarem em vigor.

### 5. Testar Novamente

1. Acesse: `https://mover3.vercel.app/login`
2. Clique em "Continuar com Google"
3. Faça login
4. Deve funcionar agora! ✅

## 🔍 Verificação Adicional

### Verificar Logs do Supabase

1. No Supabase Dashboard, vá em: **Authentication** → **Logs**
2. Procure por erros relacionados ao Google OAuth
3. Isso pode mostrar o problema específico

### Verificar Console do Navegador

1. Abra o Console (F12 → Console)
2. Tente fazer login
3. Veja os logs:
   - `🔄 Processando callback de autenticação...`
   - `❌ Erro na URL do callback:` (se houver erro)
   - Os logs agora mostram mais detalhes sobre o erro

## ⚠️ Erros Comuns

### "Client Secret inválido"
- **Solução:** Verifique se copiou o Client Secret completo do Google Cloud Console
- Certifique-se de que não há espaços extras

### "Client ID não encontrado"
- **Solução:** Verifique se o Client ID está correto no Supabase
- Deve corresponder exatamente ao do Google Cloud Console

### "Redirect URI mismatch"
- **Solução:** Verifique se a URL `https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback` está no Google Cloud Console

## 📝 Checklist

Antes de testar, certifique-se de que:

- [ ] **Client ID no Supabase** = Client ID no Google Cloud Console
- [ ] **Client Secret no Supabase** = Client Secret no Google Cloud Console (copiado recentemente)
- [ ] **Redirect URI no Google Cloud Console** = `https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback`
- [ ] **Aguardou 2-5 minutos** após salvar
- [ ] **Client Secret está "Ativadas"** no Google Cloud Console

## 🎯 Resultado Esperado

Após seguir todos os passos:
- ✅ Login com Google funciona
- ✅ Usuário é redirecionado para `/profile`
- ✅ Sessão é criada corretamente
- ✅ Perfil é criado automaticamente (se for primeira vez)

---

**Última atualização:** Código melhorado para mostrar erros mais detalhados no console

