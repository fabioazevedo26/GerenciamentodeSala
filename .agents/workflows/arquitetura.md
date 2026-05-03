---
description: 
---

Aqui está o passo a passo da arquitetura :

---

## 1. Visão Geral da Arquitetura (Full Stack)

A estrutura será dividida em três partes principais, rodando de forma independente, mas conectadas pela rede local:



### A. Camada de Apresentação (Frontend)
* **Tecnologia:** Next.js (React).
* **Papel:** Gerar a interface. Quando o usuário digita o login, o Frontend envia os dados para o Backend. Se o Backend disser "OK", o Frontend libera as páginas de reserva.
* **Estilo:** Tailwind CSS para garantir que o visual seja minimalista (uso de espaços em branco, fontes limpas e sombras leves).

### B. Camada de Aplicação (Backend API)
* **Tecnologia:** NestJS (Node.js).
* **Papel:** É o "cérebro". Ele recebe as requisições, verifica se a senha está correta, checa se a sala já está ocupada naquele horário e salva as informações no banco.
* **Segurança:** Utiliza **JWT (JSON Web Tokens)**. Após o login, o servidor envia um "passe" para o navegador, que o apresenta em todas as próximas ações.

### C. Camada de Dados (Database)
* **Tecnologia:** PostgreSQL.
* **Papel:** Armazena as tabelas de usuários, salas e agendamentos. Por ser um banco relacional, ele é perfeito para garantir que duas pessoas não reservem a mesma sala no mesmo segundo (transações).

---

## 2. Passo a Passo do Funcionamento

### Passo 1: Autenticação Restrita
O sistema terá um "Guarda" (Middleware) na frente de todas as rotas.
* Se o usuário acessar `http://sala-reuniao/`, o sistema checa se existe um token ativo.
* Se não houver, ele redireciona para `/login`.

### Passo 2: O Painel do Administrador
Como você quer criar usuários manualmente (como no MRBS):
1.  O Admin loga e acessa a aba **Gerenciar Usuários**.
2.  Ele preenche o nome e a senha. O Backend usa o **Bcrypt** para esconder essa senha antes de salvar no banco.
3.  O Admin também cadastra as **Salas** (Nome, capacidade, recursos como TV/Ar-condicionado).

### Passo 3: A Grade de Agendamento (Visual Moderno)
Diferente das tabelas travadas do MRBS, usaremos uma biblioteca de calendário (como FullCalendar).
* **Visualização:** O usuário vê os blocos de tempo.
* **Ação:** Ele clica e arrasta sobre o horário desejado.
* **Validação:** O Backend verifica: `Sala X + Horário Y está livre?`. Se sim, grava a reserva.

---

## 3. Estrutura de Pastas Recomendada (Monorepo)

Para facilitar o desenvolvimento e o deploy local, organize assim:

```text
/gestao-salas
├── /apps
│   ├── /web (Frontend - Next.js)
│   └── /api (Backend - NestJS)
├── /docker
│   ├── docker-compose.yml (O arquivo que "liga" tudo)
│   └── init.sql (Script para criar o primeiro usuário Admin)
└── package.json
```

---

## 4. Como as Tecnologias se Conectam (O Fluxo do Dado)

1.  **Usuário** interage com o **Frontend** (React/Next.js).
2.  O **Frontend** faz uma chamada `HTTP POST` para o **Backend** (NestJS).
3.  O **Backend** usa o **Prisma** (ou Drizzle) para traduzir o código TypeScript em comandos de banco de dados.
4.  O **PostgreSQL** processa a informação e responde.
5.  O **Backend** devolve a resposta para o **Frontend**, que atualiza a tela instantaneamente (sem dar F5).

---

## 5. Por que essa arquitetura é melhor que a do MRBS?

1.  **Independência:** Você pode atualizar o visual do Frontend no futuro sem mexer na lógica do Backend.
2.  **Performance:** Como o Next.js pré-renderiza as páginas, o sistema parece uma aplicação de desktop, muito rápida.
3.  **Segurança Local:** Mesmo sem internet, o login funciona perfeitamente via rede interna.

Você gostaria que eu detalhasse como seria o esquema das tabelas do banco de dados (quais campos cada uma deve ter) para esse modelo?