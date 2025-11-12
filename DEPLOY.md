# 🚀 Guia de Deploy - MOVER na DisCloud

Este guia explica como hospedar o projeto MOVER na plataforma DisCloud.

## 📋 Pré-requisitos

1. Conta na [DisCloud](https://discloudbot.com/)
2. Bot do Discord da DisCloud configurado
3. Node.js e npm instalados localmente

## ⚙️ Configuração do arquivo `discloud.config`

O arquivo já está configurado com as seguintes definições:

```ini
TYPE=site              # Tipo de aplicação: site web
MAIN=dist             # Pasta principal do build
NAME=MOVER            # Nome da aplicação
RAM=512               # Memória RAM em MB (mínimo 512)
AUTORESTART=false     # Auto-restart desabilitado
VERSION=latest        # Versão do Node.js
START=npx serve dist -s -l 3000  # Comando de inicialização
```

## 📝 Passo a Passo para Deploy

### 1. **Fazer o Build da Aplicação**

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos estáticos da aplicação.

### 2. **Criar o arquivo ZIP para upload**

A DisCloud requer que você envie um arquivo ZIP contendo:

- Pasta `dist/`
- Arquivo `package.json`
- Arquivo `discloud.config`

**No Windows (PowerShell):**
```powershell
Compress-Archive -Path dist,package.json,discloud.config -DestinationPath mover-deploy.zip
```

**No Linux/Mac:**
```bash
zip -r mover-deploy.zip dist/ package.json discloud.config
```

### 3. **Obter o ID da Aplicação**

1. Acesse o Discord da DisCloud
2. Use o comando: `/discloud upload`
3. Anexe o arquivo ZIP criado
4. Anote o ID que será retornado

### 4. **Atualizar o discloud.config**

Abra o arquivo `discloud.config` e substitua:

```ini
ID=preencha-com-seu-id
```

Pelo ID real obtido no passo 3.

### 5. **Reenviar o arquivo atualizado**

Crie um novo ZIP com o `discloud.config` atualizado e reenvie para a DisCloud.

## 🛠️ Comandos Úteis na DisCloud

Após o deploy, você pode usar os seguintes comandos no Discord:

- `/discloud status` - Verificar status da aplicação
- `/discloud restart` - Reiniciar a aplicação
- `/discloud logs` - Ver logs da aplicação
- `/discloud commits` - Ver últimas atualizações

## 📊 Monitoramento

A aplicação estará disponível no endereço fornecido pela DisCloud após o deploy.

## ⚠️ Observações Importantes

1. **RAM Mínima**: A DisCloud requer no mínimo 512MB de RAM para sites
2. **Porta**: A aplicação usa a porta 3000 internamente
3. **Build**: Certifique-se de fazer o build antes de fazer o upload
4. **Dependências**: O arquivo `package.json` será usado para instalação automática

## 🐛 Solução de Problemas

### Erro: Aplicação não inicia
- Verifique se o build foi feito corretamente
- Confirme que a pasta `dist/` existe
- Verifique os logs com `/discloud logs`

### Erro: Memória insuficiente
- Aumente o valor de RAM no `discloud.config`
- Verifique se há planos disponíveis com mais memória

### Erro: Porta já em uso
- A DisCloud gerencia as portas automaticamente
- Não é necessário configurar portas manualmente

## 📞 Suporte

Para mais informações, consulte:
- [Documentação DisCloud](https://docs.discloudbot.com/)
- [Servidor Discord DisCloud](https://discord.gg/discloud)

---

**Boa sorte com o deploy! 🚀**
