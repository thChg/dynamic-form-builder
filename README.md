# Dynamic Form Builder

A full-stack application for creating dynamic forms, publishing them for employees, validating responses with database-defined rules, and storing submissions.

## What This App Does

- ADMIN users can:
  - Create forms with dynamic fields (text, number, email, date, color, select)
  - Configure per-field validation conditions
  - Save forms as `DRAFT` or publish them as `PUBLISHED`
  - Reorder forms and manage form lifecycle
- EMPLOYEE users can:
  - View published forms
  - Fill and submit forms
  - View submission history
- Backend validates submissions using field conditions stored in the database.
- Submission data is persisted in relational tables (`Submission`, `FieldResponse`).

## Tech Stack

- Frontend: React + Vite + React Router + Axios + dnd-kit
- Backend: Node.js + Express (Gateway, Main Service, Auth Service)
- Database: PostgreSQL + Prisma ORM
- API Docs: Swagger UI (`swagger-jsdoc`, `swagger-ui-express`)
- Runtime: Docker Compose

## Architecture

- `frontend`: User interface
- `gateway`: Reverse proxy to internal services
- `main-service`: Form management + submission logic
- `auth-service`: Login/register/user info
- `db`: PostgreSQL

Traffic flow:

1. Frontend calls Gateway (`/api/...`)
2. Gateway proxies to `main-service` or `auth-service`
3. Services use PostgreSQL through Prisma

## Project Structure

```txt
.
├── frontend/
├── backend/
│   ├── gateway/
│   ├── mainService/
│   └── authService/
├── docker-compose.yml
├── .env
└── .env.example
```

## Configuration

### 1) Create Environment File

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required variables:

```env
# Ports
GATEWAY_PORT=3000
MAIN_SERVICE_PORT=3001
AUTH_SERVICE_PORT=3002
VITE_PORT=5173

# Postgres
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=dynamic_form_builder

# Service DB URLs
MAIN_SERVICE_DB_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/main_service
AUTH_SERVICE_DB_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/auth_service

# JWT
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret

# Frontend -> Gateway base URL
VITE_API_BASE_URL=http://localhost:${GATEWAY_PORT}
```

Note: frontend code reads `VITE_API_BASE_URL`.

## Run With Docker (Recommended)

### 1) Start all services

```bash
docker compose up --build
```

### 2) Run database migrations

```bash
docker compose exec main-service npx prisma migrate deploy
docker compose exec auth-service npx prisma migrate deploy
```

### 3) Open app

- Frontend: `http://localhost:${VITE_PORT}` (default `http://localhost:5173`)
- Gateway base API: `http://localhost:${GATEWAY_PORT}` (default `http://localhost:3000`)

## Swagger API Docs

After services are running:

- Main Service docs (via gateway): `http://localhost:3000/api/main-service/docs`
- Main Service docs (direct): `http://localhost:3001/docs`
- Auth Service docs (via gateway): `http://localhost:3000/api/auth-service/docs`
- Auth Service docs (direct): `http://localhost:3002/docs`

For protected endpoints, click **Authorize** in Swagger UI and provide:

```txt
Bearer <your_jwt_token>
```

## Implementation Guide

### Core Domain Models (Prisma)

- `Form`: metadata, status, owner, fields
- `Field`: label/type/order + JSON `conditions`
- `Submission`: per-form submission record
- `FieldResponse`: value per field per submission

### Submission Flow

1. Employee fills a published form in frontend.
2. Frontend sends payload like `{ fieldId: value }` to `POST /forms/:id/submit`.
3. Main-service middleware loads field conditions from DB and validates input.
4. Controller writes `Submission` + `FieldResponse` in a Prisma transaction.
5. Response is returned to frontend.

### Auth Flow

1. User logs in with `POST /login`.
2. JWT is returned and stored in localStorage (`access_token`).
3. Axios interceptor attaches `Authorization: Bearer <token>` automatically.
4. Protected routes use token verification middleware.

## Useful Commands

From project root:

```bash
# Start stack
docker compose up --build

# Stop stack
docker compose down

# Main service migration
docker compose exec main-service npx prisma migrate deploy

# Auth service migration
docker compose exec auth-service npx prisma migrate deploy

# Main service Prisma Studio
docker compose up prisma-studio
```

## Troubleshooting

- `401/403` errors in API:
  - Verify token exists in localStorage and is not expired.
  - Confirm `ACCESS_TOKEN_SECRET` is consistent for auth token verification.
- Frontend cannot call API:
  - Confirm `VITE_API_BASE_URL` points to gateway URL.
  - Confirm gateway is running and ports are exposed.
- DB connection issues:
  - Confirm `MAIN_SERVICE_DB_URL` and `AUTH_SERVICE_DB_URL` host is `db` (inside Docker network).
  - Ensure postgres container is healthy before services start.
- Swagger not loading:
  - Ensure service container restarted after dependency/config changes.

## Current Status

- Dynamic form creation and editing: implemented
- Draft and publish workflow: implemented
- DB-driven submission validation: implemented
- Submission persistence and viewing: implemented
- Swagger documentation for main/auth services: implemented
