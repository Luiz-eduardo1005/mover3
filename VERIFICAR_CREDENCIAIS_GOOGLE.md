# ✅ Verificação de Credenciais Google OAuth

## 🔑 Credenciais Fornecidas

### Client ID
```
(seu Client ID do Google Cloud Console)
```

### Client Secret
```
(seu Client Secret do Google Cloud Console)
```

## ⚠️ IMPORTANTE: Verificar o Client Secret

**ATENÇÃO:** O Client Secret que você forneceu tem um "l" minúsculo no final: `...7Ml6L`

Mas anteriormente apareceu com "I" maiúsculo: `...7MI6L`

**Isso pode ser o problema!** O Client Secret precisa estar **exatamente** como está no Google Cloud Console.

## 📋 Checklist de Configuração

### 1. No Google Cloud Console

1. Acesse: **https://console.cloud.google.com/**
2. Vá em: **APIs & Services** → **Credentials**
3. Clique no OAuth Client ID: `312420914814-rs4hjqf5cv6t73tqvqh7r4pfohpte4vg`

4. **Copie o Client Secret EXATO:**
   - Clique no ícone de "olho" para revelar
   - **Copie EXATAMENTE** como aparece (preste atenção em maiúsculas/minúsculas)
   - Verifique se é `...7MI6L` (I maiúsculo) ou `...7Ml6L` (l minúsculo)

### 2. No Supabase Dashboard

1. Acesse: **https://supabase.com/dashboard**
2. Selecione o projeto: **mover3-banco**
3. Vá em: **Authentication** → **Providers** → **Google**

4. **Configure EXATAMENTE assim:**

   **Client IDs:**
   ```
   (seu Client ID do Google Cloud Console)
   ```
   - Sem espaços
   - Sem quebras de linha
   - Exatamente como está acima

   **Client Secret (for OAuth):**
   ```
   (seu Client Secret do Google Cloud Console)
   ```
   - Cole o Client Secret **EXATO** do Google Cloud Console
   - Preste atenção em maiúsculas/minúsculas
   - Sem espaços extras
   - Sem quebras de linha

5. **Clique em "Save"**

### 3. Verificar Redirect URI

No Google Cloud Console, certifique-se de que tem:
```
https://dqsgxbheslqmqsvmmqfk.supabase.co/auth/v1/callback
```

## 🔍 Como Verificar se Está Correto

1. **No Google Cloud Console:**
   - O Client Secret deve estar visível quando você clica no ícone de olho
   - Copie EXATAMENTE como aparece

2. **No Supabase:**
   - Cole o Client Secret exatamente como copiou
   - Não adicione espaços
   - Não adicione quebras de linha

3. **Teste:**
   - Aguarde 2-5 minutos após salvar
   - Tente fazer login com Google
   - Deve funcionar agora!

## ⚠️ Erros Comuns

### Client Secret com caractere errado
- **Problema:** `...7Ml6L` (l minúsculo) em vez de `...7MI6L` (I maiúsculo)
- **Solução:** Copie novamente do Google Cloud Console

### Espaços extras
- **Problema:** Espaços no início ou fim do Client Secret
- **Solução:** Remova todos os espaços

### Quebra de linha
- **Problema:** Client Secret com quebra de linha
- **Solução:** Cole tudo em uma linha só

## ✅ Depois de Configurar

1. Salve no Supabase
2. Aguarde 2-5 minutos
3. Teste o login em: `https://mover3.vercel.app/login`
4. Deve funcionar! 🎉

---

**Última atualização:** Verificação de credenciais

