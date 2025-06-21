# 📦 NodeTS Application

This is a Node.js backend application built with TypeScript, Express.js, Prisma ORM, and PostgreSQL. It supports environment-based configuration (development, staging, production) and is designed to be scalable and maintainable.

---

## 🚀 Project Setup Instructions

### ✅ Prerequisites

- Node.js >= 18.x
- PostgreSQL installed locally (e.g., using pgAdmin)
- Yarn or npm
- Prisma CLI
- `.env.*.env` files for each environment

---

### 📦 Install Dependencies

```bash
npm install
# or
yarn install
```

---

### ⚙️ Environment Setup

Create the following environment files:

- `.env.development.env`
- `.env.staging.env`
- `.env.production.env`

Example `.env.development.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/your_db_name"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

---

### 🛠️ Database Setup

First Create all the tables in the database.

To generate the Prisma client and sync schema:

```bash
npm run prisma:pull:dev
npm run prisma:generate:dev

```

---

## 🏁 Running the Project

### Development

```bash
npm run start:dev
```

### Staging

```bash
npm run start:staging
```

### Production

```bash
npm run start:production
```

---

## 📬 Example API Requests

### 🔐 Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "password": "securepassword"
  }'
```

### 🔐 Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword"
  }'
```

### 🔒 Get All Users (Protected Route)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## 📌 Design Decisions & Assumptions

- **Typed ORM**: Prisma is used for schema-safe and efficient DB queries.
- **Environment Handling**: Different `.env` files per environment; managed via dotenv-cli.
- **Auth**: JWT-based authentication with hashed passwords using bcryptjs.
- **Validation**: Zod is used to validate input schemas.
- **Security**: Helmet for secure headers and CORS for cross-origin access.
- **Logging**: Morgan for structured request logging.
- **Code Style**: ESLint and TypeScript configured for consistency and maintainability.

---

## 🧩 Database Schema

### 📘 User Table

- `id` (Int, Primary Key)
- `name` (String)
- `username` (String, Unique)
- `password` (String, Hashed)
- `createdAt`, `updatedAt` (Timestamps)

### 🔐 Role & Permission (RBAC)

- **Role**: Admin, Author, Reviewer, etc.
- **Permission**: View, Create, Update, Delete
- **RolePermission**: Join table for many-to-many relation between Role and Permission

You can view the Prisma schema in `prisma/schema.prisma`.

---

## 📁 Project Scripts Overview

| Script                        | Purpose                        |
| ----------------------------- | ------------------------------ |
| `npm run dev`                 | Run dev with ts-node           |
| `npm run start:dev`           | Nodemon dev with auto-reload   |
| `npm run start:staging`       | Run staging server             |
| `npm run prisma:pull:dev`     | Pull DB to Prisma schema (dev) |
| `npm run prisma:generate:dev` | Generate Prisma client (dev)   |

---

## 🛡️ License

MIT
