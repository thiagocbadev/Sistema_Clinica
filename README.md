# Sistema de Clínicas

Sistema completo de gestão para clínicas médicas desenvolvido com tecnologias modernas.

## Funcionalidades

- **Dashboard**: Visão geral com métricas e gráficos de consultas, faturamento e pacientes
- **Agenda**: Calendário semanal para visualização e gestão de consultas
- **Pacientes**: Cadastro e gestão completa de pacientes
- **Profissionais**: Gerenciamento de profissionais da clínica
- **Serviços**: Cadastro e configuração de serviços oferecidos
- **Configurações**: Configurações gerais do sistema

## Tecnologias Utilizadas

Este projeto foi construído com:

- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React** - Biblioteca UI
- **shadcn-ui** - Componentes UI
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado e cache
- **date-fns** - Manipulação de datas
- **Recharts** - Gráficos e visualizações

## Como executar o projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

```sh
# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

### Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run build:dev` - Cria a build em modo desenvolvimento
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── calendar/   # Componentes de calendário
│   ├── dashboard/  # Componentes do dashboard
│   ├── layout/     # Componentes de layout
│   ├── patients/   # Componentes de pacientes
│   ├── professionals/ # Componentes de profissionais
│   ├── services/   # Componentes de serviços
│   └── ui/         # Componentes UI base (shadcn)
├── contexts/       # Contextos React
├── data/          # Dados mockados
├── hooks/         # Custom hooks
├── lib/           # Utilitários
├── pages/         # Páginas da aplicação
└── types/         # Definições de tipos TypeScript
```

## Deploy

Para fazer o deploy do projeto:

```sh
# Criar build de produção
npm run build

# A pasta dist/ conterá os arquivos prontos para deploy
```

Você pode fazer deploy em qualquer serviço de hospedagem estática como:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Entre outros
