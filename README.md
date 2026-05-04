# SMGR - Sistema Moderno de Gestão de Reservas

O **SMGR** é uma plataforma de gerenciamento de salas e recursos on-premises, focada em minimalismo, fluidez e alta usabilidade. Desenvolvido com uma estética contemporânea "Bio-Tech", o sistema substitui modelos obsoletos por uma interface de alto desempenho e navegação instantânea.

## 📸 Demonstração do Sistema

<img width="1917" height="943" alt="Login" src="https://github.com/user-attachments/assets/fdbb76e6-cde2-4d7c-b02f-92e2320abdf1" />

<img width="1919" height="941" alt="Dashboard" src="https://github.com/user-attachments/assets/e131f0ba-ad18-4773-8fff-fbef1bef8e99" />

<img width="1919" height="943" alt="Salas" src="https://github.com/user-attachments/assets/dae9277b-3d99-4da5-ae63-72d5977d6820" />

<img width="1919" height="945" alt="Usuarios" src="https://github.com/user-attachments/assets/d7f17de7-1197-425e-9cd2-382c39e3398d" />

<img width="1919" height="943" alt="Historico" src="https://github.com/user-attachments/assets/f00026f3-f5ad-4785-b336-3e5282bd1afc" />

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js (React)**: Interface ultra-rápida com renderização otimizada.
- **Tailwind CSS v4**: Estilização moderna e responsiva.
- **FullCalendar**: Grade de agendamento interativa.
- **Lucide React**: Ícones minimalistas e consistentes.

### Backend
- **NestJS (Node.js)**: API escalável e modular.
- **Prisma ORM**: Modelagem de dados segura e tipada.
- **PostgreSQL**: Banco de dados robusto e confiável.

### Infraestrutura
- **Docker**: Containerização completa do ambiente de dados.

---

## ✨ Funcionalidades Principais

- **🛡️ Setup Inicial**: Ao rodar o sistema pela primeira vez, ele detecta a ausência de administradores e solicita a configuração do usuário principal.
- **📅 Painel de Reservas**: Visualização semanal/mensal com suporte a arrastar e soltar.
- **⏱️ Reserva Manual**: Opção de inserir data e hora manualmente para reservas de longa duração.
- **✅ Fluxo de Aprovação**: Usuários solicitam reservas que ficam pendentes até que um administrador as aprove.
- **🏢 Gestão de Salas**: CRUD completo de salas com capacidade e recursos.
- **👥 Gestão de Usuários**: Controle de permissões (ADMIN/USER).
- **📜 Histórico Completo**: Registro auditável de todas as solicitações, aprovações e rejeições.

---

## 📦 Como Instalar e Rodar (Passo a Passo)

Siga estas instruções para rodar o SMGR do zero no seu computador:

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker Desktop](https://www.docker.com/) instalado e rodando.

### 2. Clonar e Instalar
```bash
# Clone o repositório
git clone https://github.com/fabioazevedo26/GerenciamentodeSala.git
cd GerenciamentodeSala

# Instale as dependências na raiz
npm install
```

### 3. Iniciar o Banco de Dados (Docker)
```bash
# Vá para a pasta docker e suba o PostgreSQL
cd docker
docker-compose up -d
cd ..
```

### 4. Configurar o Backend e Prisma
É necessário sincronizar o banco com o código:
```bash
cd apps/api

# Cria as tabelas no banco
npx prisma db push

# Gera o cliente do Prisma
npx prisma generate

cd ..
```

### 5. Executar o Projeto
Na pasta raiz (GerenciamentodeSala), execute:
```bash
npm run dev
```

### 6. Primeiro Acesso
- Abra seu navegador em: **[http://localhost:3000](http://localhost:3000)**
- O sistema detectará que é o primeiro acesso.
- **Configure seu usuário Administrador** e pronto! O sistema está liberado para uso.

---

## 🛠️ Estrutura do Projeto
```text
/gerenciador de salas
├── /apps
│   ├── /web (Frontend - Next.js)
│   └── /api (Backend - NestJS)
├── /docker
│   ├── docker-compose.yml
│   └── init.sql
└── package.json
```

---
Desenvolvido com ❤️ por **Fabio**.
