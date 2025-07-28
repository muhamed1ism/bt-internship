# BT Internship - Fullstack Project

This repository combines both the backend and frontend for the BT Internship project.

## 📦 Project Structure

 - backend/ # NestJS backend with PostgreSQL and Prisma
 
 - frontend/ # React frontend with Tailwind, Firebase, etc.

## ⚙️ Prerequisites

- **Node.js** (use [`nvm`](https://github.com/nvm-sh/nvm))
- **Docker & Docker Compose**
- **npm**
- **PostgreSQL** (runs in Docker container)
- **Firebase & OpenAI API keys**

---

## 🚀 Getting Started

### 🔧 1. Backend Setup

```bash
cd backend/
```

#### 1.1 Set Node.js Version and Install Dependencies

```bash
nvm use
npm install
```

#### 1.2 Create .env File

Copy the example file and fill in your Firebase and OpenAI credentials:

```bash
cp .env.example .env
```

#### 1.3 Start PostgreSQL Database (Docker)

```bash
docker-compose up postgres -d
```

#### 1.4 Generate Prisma Client

```bash
npx prisma generate --schema=prisma/
```

#### 1.5 Start the Backend Server

```bash
npm run start:dev
```

### 🌐 2. Frontend Setup

```bash
cd ../frontend/
```

#### 2.1 Set Node.js Version and Install Dependencies

```bash
nvm use
npm install
```

#### 2.2 Create .env File

Copy the example file and add your Firebase config variables:

```bash
cp .env.example .env
```

#### 2.3 Start the Frontend

```bash
npm run dev
```

## 🛠 Tech Stack
### 🔙 Backend
- NestJS
- TypeScript
- PostgreSQL (via Docker)
- Prisma
- Firebase Admin SDK
- CASL (Authorization)

### 🔜 Frontend
- React
- React Router DOM
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- TanStack Table
- Firebase (client SDK)
- Zod (validation)
- CASL (Authorization)
- TypeScript

## 📄 Notes
- Ensure Docker is running before starting the backend.
- Use nvm use to ensure the correct Node.js version is active in each directory.
- Prisma schema is defined in backend/prisma/.
- Both frontend and backend require properly configured .env files (.env.example is provided as reference).
