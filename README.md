# SMGR - Sistema Moderno de Gestão de Reservas

O **SMGR** é uma plataforma de gerenciamento de salas e recursos on-premises, focada em minimalismo, fluidez e alta usabilidade. Desenvolvido com uma estética contemporânea "Bio-Tech", o sistema substitui modelos obsoletos por uma interface de alto desempenho e navegação instantânea.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js (React)**: Framework para a interface rápida e moderna.
- **Tailwind CSS v4**: Estilização de última geração com alta performance.
- **FullCalendar**: Grade de agendamento interativa com suporte a "arrastar e soltar".
- **Lucide React**: Biblioteca de ícones minimalistas.

### Backend
- **NestJS (Node.js)**: "Cérebro" da aplicação, robusto e escalável.
- **Prisma ORM**: Gerenciamento de banco de dados simplificado e tipado.
- **PostgreSQL**: Banco de dados relacional de alta confiabilidade.

### Infraestrutura
- **Docker**: Containerização para facilitar o deploy e a execução local.

## ✨ Funcionalidades Principais

- **Autenticação Restrita**: Tela de login moderna para acesso seguro.
  - *Credenciais Padrão (Teste):* Usuário: `admin` | Senha: `admin`
- **Agenda Interativa**: Visualização dinâmica de horários e reservas.
- **Gestão de Salas**: Cadastro e visualização de salas, capacidades e recursos.
- **Gestão de Usuários**: Painel administrativo para controle de acessos e permissões.
- **Design Bio-Tech**: Interface Dark Mode premium com micro-animações e foco na tarefa.

## 📦 Como Instalar e Rodar

Siga os passos abaixo para colocar o sistema de pé no seu ambiente local:

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose

### 2. Clonar o Repositório
```bash
git clone <url-do-seu-repositorio>
cd "gerenciador de salas"
```

### 3. Configurar o Banco de Dados
Acesse a pasta docker e inicie o PostgreSQL:
```bash
cd docker
docker-compose up -d
cd ..
```

### 4. Instalar Dependências
Instale as dependências na raiz do projeto:
```bash
npm install
```
*O script de instalação também deve ser executado dentro de `apps/web` e `apps/api` se não houver um workspace configurado.*

### 5. Configurar o Backend (Prisma)
Dentro da pasta `apps/api`, sincronize o banco de dados:
```bash
cd apps/api
npx prisma db push
cd ../..
```

### 6. Executar o Projeto
Na raiz do projeto, inicie o Frontend e o Backend simultaneamente:
```bash
npm run dev
```

O sistema estará disponível nos seguintes endereços:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend (API)**: [http://localhost:3001](http://localhost:3001)

## 🛠️ Estrutura de Pastas
```text
/gestao-salas
├── /apps
│   ├── /web (Frontend - Next.js)
│   └── /api (Backend - NestJS)
├── /docker
│   ├── docker-compose.yml
│   └── init.sql
└── package.json
```

---
Desenvolvido por **Antigravity** (AI Coding Assistant) em parceria com **Fabio**.
