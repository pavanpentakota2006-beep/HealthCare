# ⚙️ HealthCare Backend API (Port 4001)

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-dev.db-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Port-4001-success?style=for-the-badge" alt="Port 4001" />
  <img src="https://img.shields.io/badge/JWT-Protected-blue?style=for-the-badge&logo=json-web-tokens" alt="JWT" />
</p>

The core REST API service powering the **HealthCare Platform**, built with **NestJS 11**, **Prisma ORM**, and **SQLite**.

---

## 🚀 Running the Backend Server

```bash
# Development mode with hot reload:
npm run start:dev

# Production build:
npm run build
npm run start:prod
```

The API starts on **Port 4001**:
👉 **[http://localhost:4001](http://localhost:4001)**

---

## 📦 Modules & Capabilities

| Module | Description | Key Routes |
| :--- | :--- | :--- |
| **Auth** | User registration, login, JWT issuance & verification | `POST /auth/register`<br/>`POST /auth/login` |
| **Users** | User profiles, medical records | `GET /users/me`<br/>`PUT /users/profile` |
| **Health Tracking** | Daily logs: meals, water, sleep, workouts | `GET /health/sync`<br/>`POST /health/meal`<br/>`POST /health/water`<br/>`POST /health/sleep`<br/>`POST /health/workout` |
| **AI Engine** | OpenAI GPT-4o-mini & Pollinations.ai fallback coach | `POST /ai/chat`<br/>`POST /ai/meal-plan` |
| **Telemedicine** | Doctor profiles, scheduling, booking management | `GET /telemedicine/doctors`<br/>`POST /telemedicine/book`<br/>`GET /telemedicine/bookings` |
| **Gamification** | XP levels, challenges, badges, reward coins | `GET /gamification/profile`<br/>`GET /gamification/challenges` |
| **Commerce** | E-commerce wellness store, product catalogue, orders | `GET /commerce/products`<br/>`POST /commerce/orders` |
| **Community** | Social fitness feed, user posts, comments, likes | `GET /community/posts`<br/>`POST /community/posts`<br/>`POST /community/comments` |

---

## 🗄 Database (Prisma + SQLite)

The backend uses Prisma with an embedded SQLite database (`prisma/dev.db`):

```bash
# Seed initial doctors & dietitians
node seed_doctors.js

# Seed store products & categories
node seed_store.js

# Run full health check & verification
node health_check.js
```

---

## 🔑 Environment Configuration (`.env`)

```ini
PORT=4001
JWT_SECRET=supersecret_healthcare_jwt_key_2026
JWT_REFRESH_SECRET=supersecret_healthcare_refresh_key_2026

# Optional: Add OpenAI API key for AI Nutritionist
# OPENAI_API_KEY=sk-...
```
*(If `OPENAI_API_KEY` is not provided, the AI module automatically falls back to Pollinations.ai for free instant responses.)*
