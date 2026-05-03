---
description: 
---

Aqui está o esquema de banco de dados (ERD - Entity Relationship Diagram) otimizado para o projeto:

---

## 1. O Modelo de Dados (Schema)

Como utilizaremos o **PostgreSQL**, o ideal é trabalhar com quatro tabelas principais:

### A. Tabela `users` (Usuários)
Armazena quem pode acessar o sistema.
* `id`: UUID ou Integer (Chave primária).
* `name`: Nome completo do funcionário.
* `username`: O login único (ex: `joao.silva`).
* `password_hash`: A senha criptografada.
* `role`: Nível de acesso (Ex: `'ADMIN'` ou `'USER'`).

### B. Tabela `rooms` (Salas)
Armazena os locais disponíveis.
* `id`: UUID ou Integer (Chave primária).
* `name`: Nome da sala (ex: "Sala de Reunião Alpha").
* `capacity`: Capacidade máxima de pessoas.
* `description`: Pequena descrição (ex: "Possui TV e Quadro Branco").
* `is_active`: Booleano para desativar salas em manutenção.

### C. Tabela `bookings` (Reservas)
A tabela mais importante, que conecta usuários e salas.
* `id`: UUID ou Integer (Chave primária).
* `room_id`: Chave estrangeira ligada à tabela `rooms`.
* `user_id`: Chave estrangeira ligada à tabela `users`.
* `title`: Título ou assunto da reunião.
* `start_time`: Data e hora de início (`TIMESTAMP`).
* `end_time`: Data e hora de término (`TIMESTAMP`).
* `created_at`: Data de criação do registro.

### D. Tabela `settings` (Configurações - Opcional)
Para você não precisar mexer no código caso queira mudar algo no sistema.
* `key`: Nome da configuração (ex: `opening_hour`).
* `value`: Valor (ex: `08:00`).



---

## 2. A Lógica de Validação (O "Pulo do Gato")

Para evitar que duas pessoas reservem a mesma sala no mesmo horário, o seu **Backend (NestJS)** deve executar uma verificação antes de salvar no banco. A lógica matemática para detectar sobreposição é:

> Uma nova reserva **conflita** se:
> `Início_Novo < Fim_Existente` **E** `Fim_Novo > Início_Existente`

No PostgreSQL, você pode até criar um `EXCLUDE CONSTRAINT` que impede isso automaticamente no nível do banco de dados, garantindo 100% de integridade.

---

## 3. Implementação com Prisma ORM

Como sugeri usar o **Prisma**, o seu arquivo de configuração (`schema.prisma`) ficaria mais ou menos assim (versão simplificada):

```prisma
model User {
  id       Int       @id @default(autoincrement())
  username String    @unique
  password String
  role     Role      @default(USER)
  bookings Booking[]
}

model Room {
  id       Int       @id @default(autoincrement())
  name     String
  bookings Booking[]
}

model Booking {
  id        Int      @id @default(autoincrement())
  startTime DateTime
  endTime   DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  room      Room     @relation(fields: [roomId], references: [id])
  roomId    Int
}

enum Role {
  USER
  ADMIN
}
```

---

## 4. Próximos Passos Técnicos

Para colocar essa estrutura de pé localmente, eu recomendaria os seguintes comandos (após instalar o Node.js):

1.  **Instalar o NestJS CLI:** `npm i -g @nestjs/cli`
2.  **Criar o projeto:** `nest new backend-salas`
3.  **Adicionar o Prisma:** `npx prisma init`
4.  **Configurar o Docker:** Criar um arquivo `docker-compose.yml` para subir o PostgreSQL com um clique.

