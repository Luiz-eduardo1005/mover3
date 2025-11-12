# 🎯 MOVER - Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito

**Desenvolvido por:** Luis Roberto Lins de Almeida e equipe ADS FAMetro  
**Curso:** Análise e Desenvolvimento de Sistemas (ADS)  
**Instituição:** FAMETRO - Faculdade Metropolitana de Manaus  
**Período:** 2º Período - 2025  
**Copyright (c) 2025 Luis Roberto Lins de Almeida e equipe ADS FAMetro**

Plataforma inclusiva de vagas de emprego desenvolvida por alunos do curso de Análise e Desenvolvimento de Sistemas (ADS) da **FAMETRO - Faculdade Metropolitana de Manaus**, Unidade Sul Cachoeirinha, no 2º período de 2025.

## 📋 Sobre o Projeto

A MOVER é uma plataforma focada em conectar pessoas com deficiência a oportunidades de trabalho inclusivas e acessíveis, seguindo rigorosamente as diretrizes **WCAG 2.1 Nível AA** para garantir acessibilidade completa.

### 🎯 Objetivo
Criar uma plataforma de vagas de emprego totalmente acessível que atenda pessoas com todos os tipos de deficiência (visual, auditiva, motora e cognitiva), promovendo inclusão no mercado de trabalho.

## 🏛️ Instituição de Ensino

- **Instituição:** FAMETRO - Faculdade Metropolitana de Manaus
- **Curso:** Análise e Desenvolvimento de Sistemas (ADS)
- **Período:** 2º Período - 2025
- **Unidade:** Sul Cachoeirinha, Manaus - AM

## ✅ Certificação WCAG 2.1 Nível AA

O projeto foi desenvolvido seguindo rigorosamente as **Diretrizes de Acessibilidade para o Conteúdo da Web (WCAG) 2.1, Nível AA**, uma norma internacional desenvolvida pelo W3C que descreve como proporcionar acessibilidade de conteúdos Web a pessoas com deficiência.

### Níveis de Conformidade:
- **Nível A** - Mínimo de conformidade
- **Nível AA** - ✅ **Alcançado pelo projeto** (conformidade preferida por legislação)
- **Nível AAA** - Nível mais elevado de acessibilidade

## 🚀 Tecnologias Utilizadas

- **Frontend:** React.js 18.3, Vite 5.4, TypeScript 5.5
- **Estilização:** TailwindCSS 3.4, ShadCN UI, Tailwind Animate
- **Validação de Formulários:** react-hook-form + zod
- **Roteamento:** React Router DOM 6.26
- **Componentes UI:** Radix UI, Lucide React
- **Estado:** TanStack Query (React Query) 5.56
- **Ícones:** Lucide React
- **Build:** Vite (SWC)

## 🎨 Recursos de Acessibilidade Implementados

### ✅ Conformidade WCAG 2.1 Nível AA
- ✅ **Perceptível** - Informações e componentes da interface são apresentáveis aos usuários de forma que possam perceber
- ✅ **Operável** - Componentes da interface e navegação devem ser operáveis
- ✅ **Compreensível** - Informações e operação da interface devem ser compreensíveis
- ✅ **Robusto** - O conteúdo deve ser robusto o suficiente para ser interpretado de forma confiável por uma grande variedade de agentes de usuário

### 🛠️ Recursos Específicos
1. **Navegação por teclado completa** - Todos os elementos são acessíveis via teclado
2. **Suporte a leitores de tela** - Compatível com NVDA, JAWS, VoiceOver
3. **Alto contraste** - Suporte automático para modo de alto contraste
4. **Redução de animações** - Respeita preferências do usuário (`prefers-reduced-motion`)
5. **Labels descritivos** - Todos os campos com labels acessíveis (`sr-only`)
6. **Focus visível** - Indicadores de foco aprimorados
7. **Estrutura semântica** - HTML5 semântico correto
8. **ARIA labels** - Todos os elementos interativos com atributos ARIA apropriados
9. **Contraste de cores** - Mínimo 4.5:1 para texto normal e 3:1 para texto grande

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── jobs/           # Componentes de vagas
│   ├── layout/         # Header e Footer
│   ├── search/         # Barra de busca
│   ├── ui/             # Componentes UI reutilizáveis
│   └── AccessibilityNotice.tsx
├── hooks/              # Custom Hooks
├── lib/                # Utilitários
├── pages/              # Páginas principais
│   ├── Index.tsx      # Home
│   ├── About.tsx      # Sobre
│   ├── Jobs.tsx       # Listagem de vagas
│   ├── Login.tsx      # Login
│   ├── Register.tsx   # Cadastro
│   └── ...
└── index.css          # Estilos globais com acessibilidade
```

## 📱 Responsividade

A UI é 100% responsiva, utilizando TailwindCSS com breakpoints customizados para experiência fluida em mobile, tablet e desktop.

## 🎯 Funcionalidades

### Para Candidatos
- Cadastro/Login acessível
- Pesquisa e candidatura a vagas
- Dashboard pessoal
- Perfil com informações sobre deficiência
- Vagas salvas e recomendadas

### Para Empresas
- Cadastro/Login
- Publicação de vagas inclusivas
- Filtros para vagas acessíveis
- Gerenciamento de candidaturas

### Acessibilidade Universal
- Navegação completa por teclado
- Suporte a leitores de tela
- Alto contraste automático
- Redução de animações
- Labels descritivos
- Focus visível

## 🛠️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🧪 Testes de Acessibilidade

O projeto foi desenvolvido seguindo as seguintes práticas:
- Testes com leitores de tela (NVDA, JAWS, VoiceOver)
- Navegação por teclado completa
- Verificação de contraste de cores
- Validação semântica HTML5
- Testes com ferramentas automatizadas

## 📞 Contato

**Email de Suporte:** acessibilidade@mover.com.br

## 📜 Licença

Este projeto foi desenvolvido como trabalho acadêmico pelos alunos de ADS da FAMETRO Manaus.

## 🙏 Agradecimentos

À FAMETRO - Faculdade Metropolitana de Manaus por proporcionar o ambiente de aprendizado e desenvolvimento deste projeto focado em acessibilidade e inclusão digital.

---

**Desenvolvido com ❤️ por Luis Roberto Lins de Almeida e equipe ADS da FAMETRO Manaus - 2025**
