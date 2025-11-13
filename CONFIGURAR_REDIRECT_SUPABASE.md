# 🔧 Configurar Redirect URLs no Supabase

## ⚠️ Problema
O login com Google está redirecionando para `localhost:3000` em vez da porta correta do servidor.

## ✅ Solução

### 1. Verificar qual porta você está usando

Execute no terminal:
```bash
npm run dev
```

Anote a porta que aparece (provavelmente `8080` ou `5173`).

### 2. Configurar no Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto:** mover3-banco (ou o projeto com URL `dqsgxbheslqmqsvmmqfk`)
3. **Vá em:** Authentication → **URL Configuration**

4. **Configure Site URL:**
   - Se estiver usando porta 8080: `http://localhost:8080`
   - Se estiver usando porta 5173: `http://localhost:5173`
   - Ou use: `http://localhost:8080` (padrão do Vite config)

5. **Configure Redirect URLs:**
   Adicione todas essas URLs (uma por linha):
   ```
   http://localhost:8080/**
   http://localhost:5173/**
   http://localhost:3000/**
   http://localhost:8080/auth/callback
   http://localhost:5173/auth/callback
   http://localhost:3000/auth/callback
   ```

6. **Clique em "Save"**

### 3. Aguardar propagação

Após salvar, aguarde 2-5 minutos para as mudanças entrarem em vigor.

### 4. Testar novamente

1. Pare o servidor (Ctrl+C)
2. Inicie novamente: `npm run dev`
3. Acesse: `http://localhost:8080/login` (ou a porta que aparecer)
4. Tente fazer login com Google

## 🔍 Debug

Se ainda não funcionar, abra o Console do navegador (F12) e verifique:
- A URL de redirecionamento que aparece no log
- Qualquer erro que apareça

Os logs agora mostram:
- `🔐 Iniciando login com Google...`
- `📍 URL de redirecionamento: http://localhost:XXXX/auth/callback`
- `✅ Redirecionando para Google...`

## 📝 Nota

O código agora usa automaticamente `window.location.origin`, que pega a porta atual do navegador. Certifique-se apenas de que o Supabase tenha as URLs de redirect configuradas corretamente.

