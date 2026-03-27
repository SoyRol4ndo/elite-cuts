# EliteCuts – Barbershop Booking App

A full-stack barbershop management application built as a portfolio project.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend / DB**: Supabase (PostgreSQL + Auth)
- **State**: Zustand (auth) + TanStack Query (server state)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Features

### Customer (public)
- Landing page with services and team showcase
- Email/password registration and login
- Multi-step appointment booking (service → barber → date/time → confirm)
- View and cancel upcoming appointments

### Admin (protected)
- Dashboard with today's metrics and revenue
- Weekly schedule calendar view
- Full appointments table with status management
- Customer list

## Project Structure

```
src/
├── features/
│   ├── landing/        # Landing page
│   ├── auth/           # Login & Register pages
│   ├── booking/        # Booking flow & My Appointments
│   └── admin/          # Admin dashboard, schedule, appointments, customers
├── shared/
│   ├── components/     # AuthProvider, ProtectedRoute, layouts
│   ├── hooks/          # useAuth
│   ├── lib/            # Supabase client + DB types
│   ├── stores/         # Zustand auth store
│   └── types/          # Shared TypeScript types
└── router/             # React Router configuration
```

## Setup

### 1. Supabase project

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Copy your **Project URL** and **Anon Key** from Settings → API

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Create an admin user

1. Register normally through the app
2. In Supabase SQL Editor, promote to admin:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
