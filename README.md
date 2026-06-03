# Inventory & Order Management System

A full-stack, production-ready **Inventory & Order Management System** built with React, Node.js, Express, Sequelize, PostgreSQL, and Docker. Manage products, customers, and orders with real-time inventory tracking, transactional order processing, and a modern responsive dashboard.

![Stack](https://img.shields.io/badge/React-18-blue) ![Stack](https://img.shields.io/badge/Node.js-20-green) ![Stack](https://img.shields.io/badge/PostgreSQL-16-blue) ![Stack](https://img.shields.io/badge/Docker-Compose-blue)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [License](#license)

---

## Features

### Backend
- RESTful API with Express.js
- PostgreSQL with Sequelize ORM
- Full CRUD for Products and Customers
- Order creation with stock validation and inventory deduction
- Database transactions with automatic rollback on failure
- Dashboard analytics endpoint
- Security: Helmet, CORS, Rate Limiting, Joi validation
- Global error handling and async wrapper

### Frontend
- Modern React dashboard with Vite
- Redux Toolkit state management
- Responsive sidebar navigation
- Product CRUD with form validation
- Customer management
- Order creation with multi-item support
- Order details view
- Toast notifications and loading states

### DevOps
- Docker & Docker Compose with health checks
- Named volumes for PostgreSQL persistence
- Internal Docker networking

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Redux Toolkit, Axios |
| Backend    | Node.js, Express.js, Sequelize ORM  |
| Database   | PostgreSQL 16                       |
| Container  | Docker, Docker Compose              |

---

## Project Structure

```
inventory-management-system/
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Route pages
│   │   ├── redux/            # Redux Toolkit slices
│   │   ├── services/         # Toast & utilities
│   │   └── utils/            # Formatters & validators
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/           # App & DB configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Error, validation, 404
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic layer
│   │   ├── validations/      # Joi schemas
│   │   ├── utils/            # ApiError, asyncHandler
│   │   └── database/         # DB sync script
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+
- **PostgreSQL** 14+ (for local dev without Docker)
- **Docker** & **Docker Compose** (for containerized setup)

---

## Quick Start (Docker)

1. **Clone and enter the project:**

```bash
cd inventory-management-system
```

2. **Create environment file:**

```bash
cp .env.example .env
```

3. **Start all services:**

```bash
docker compose up --build -d
```

4. **Access the application:**

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:4173        |
| Backend API| http://localhost:5000/api    |
| Health     | http://localhost:5000/api/health |

5. **View logs:**

```bash
docker compose logs -f
```

6. **Stop services:**

```bash
docker compose down
```

---

## Local Development Setup

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE inventory_db;
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials

npm install
npm run dev
```

Backend runs at: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Ensure VITE_API_URL=http://localhost:5000/api

npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Environment Variables

### Root / Docker (`.env`)

| Variable              | Description                    | Default                    |
|-----------------------|--------------------------------|----------------------------|
| `DB_HOST`             | PostgreSQL host                | `postgres`                 |
| `DB_PORT`             | PostgreSQL port                | `5432`                     |
| `DB_NAME`             | Database name                  | `inventory_db`             |
| `DB_USER`             | Database user                  | `postgres`                 |
| `DB_PASSWORD`         | Database password              | `postgres`                 |
| `BACKEND_PORT`        | Backend exposed port           | `5000`                     |
| `FRONTEND_PORT`       | Frontend exposed port          | `4173`                     |
| `CORS_ORIGIN`         | Allowed CORS origin            | `http://localhost:4173`  |
| `VITE_API_URL`        | Frontend API base URL          | `http://localhost:5000/api`|
| `RATE_LIMIT_WINDOW_MS`| Rate limit window (ms)         | `900000`                   |
| `RATE_LIMIT_MAX`      | Max requests per window        | `100`                      |

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=postgres
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this format:

```json
{
  "success": true,
  "data": { }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "..." }]
}
```

---

### Health Check

```
GET /api/health
```

---

### Products

| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | `/api/products`       | Create product    |
| GET    | `/api/products`       | List all products |
| GET    | `/api/products/:id`   | Get product by ID |
| PUT    | `/api/products/:id`   | Update product    |
| DELETE | `/api/products/:id`   | Delete product    |

**Create Product Body:**

```json
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "price": 29.99,
  "quantity": 100
}
```

**Rules:** SKU must be unique. Quantity cannot be negative.

---

### Customers

| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| POST   | `/api/customers`        | Create customer     |
| GET    | `/api/customers`        | List all customers  |
| GET    | `/api/customers/:id`    | Get customer by ID  |
| DELETE | `/api/customers/:id`    | Delete customer     |

**Create Customer Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Rules:** Email must be unique and valid format.

---

### Orders

| Method | Endpoint            | Description      |
|--------|---------------------|------------------|
| POST   | `/api/orders`       | Create order     |
| GET    | `/api/orders`       | List all orders  |
| GET    | `/api/orders/:id`   | Get order by ID  |
| DELETE | `/api/orders/:id`   | Delete order     |

**Create Order Body:**

```json
{
  "customerId": 1,
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

**Business Rules:**
- Validates customer and products exist
- Checks stock availability before processing
- Calculates `totalAmount` automatically
- Reduces inventory on success
- Uses database transactions (rollback on failure)

---

### Dashboard

```
GET /api/dashboard
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalProducts": 10,
    "totalCustomers": 5,
    "totalOrders": 20,
    "lowStockProducts": [
      { "id": 1, "name": "Mouse", "sku": "WM-001", "quantity": 3, "price": "29.99" }
    ]
  }
}
```

Low stock = quantity less than 5.

---

## Deployment Guide

### Deploy Backend on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Create a **PostgreSQL** database on Render.
5. Set environment variables:

```env
NODE_ENV=production
PORT=5000
DB_HOST=<render-db-host>
DB_PORT=5432
DB_NAME=<render-db-name>
DB_USER=<render-db-user>
DB_PASSWORD=<render-db-password>
CORS_ORIGIN=https://your-frontend-url.com
```

6. Deploy and note your API URL: `https://your-app.onrender.com`

---

### Deploy Backend on Railway

1. Create a new project on [Railway](https://railway.app).
2. Add a **PostgreSQL** plugin.
3. Deploy from GitHub, set root to `backend`.
4. Railway auto-injects `DATABASE_URL`. Add these variables:

```env
NODE_ENV=production
PORT=5000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

5. Set start command: `node server.js`
6. Generate a public domain for the backend service.

---

### Deploy Frontend on Vercel

1. Import project on [Vercel](https://vercel.com).
2. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Set environment variable:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

4. Deploy. Update backend `CORS_ORIGIN` to your Vercel URL.

---

### Deploy Frontend on Render (Static Site)

1. Create a **Static Site** on Render.
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Environment: `VITE_API_URL=https://your-backend.onrender.com/api`

---

### Full Stack with Docker (VPS / Cloud VM)

```bash
# On your server
git clone <your-repo>
cd inventory-management-system
cp .env.example .env
# Edit .env with production values

docker compose up --build -d
```

Use a reverse proxy (Nginx/Caddy) for HTTPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4173;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

---

## HTTP Status Codes

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 400  | Validation error / Bad request       |
| 404  | Resource not found                   |
| 409  | Conflict (duplicate SKU/email)         |
| 429  | Rate limit exceeded                  |
| 500  | Internal server error                |

---

## Scripts Reference

### Backend

| Command         | Description              |
|-----------------|--------------------------|
| `npm start`     | Start production server  |
| `npm run dev`   | Start with nodemon       |
| `npm run db:sync` | Sync database models   |

### Frontend

| Command           | Description           |
|-------------------|-----------------------|
| `npm run dev`     | Start dev server      |
| `npm run build`   | Production build      |
| `npm run preview` | Preview production    |

---

## License

MIT License — free to use for personal and commercial projects.
