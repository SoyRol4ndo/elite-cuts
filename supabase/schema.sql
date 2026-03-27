-- ============================================================
--  EliteCuts – Supabase Database Schema
--  Run this in the Supabase SQL Editor to set up the database.
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup using metadata from signUp options.data
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Usuario'),
    new.raw_user_meta_data->>'phone',
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Barbers ───────────────────────────────────────────────────────────────
create table if not exists public.barbers (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  specialty   text not null,
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Services ──────────────────────────────────────────────────────────────
create table if not exists public.services (
  id                 uuid primary key default uuid_generate_v4(),
  name               text not null check (name in ('haircut', 'beard', 'facial_cleaning')),
  label              text not null,
  description        text not null,
  duration_minutes   integer not null,
  price              numeric(10, 2) not null,
  is_active          boolean not null default true
);

-- ── Appointments ──────────────────────────────────────────────────────────
create table if not exists public.appointments (
  id                 uuid primary key default uuid_generate_v4(),
  customer_id        uuid not null references public.profiles(id) on delete cascade,
  barber_id          uuid not null references public.barbers(id),
  service_id         uuid not null references public.services(id),
  appointment_date   date not null,
  start_time         time not null,
  end_time           time not null,
  status             text not null default 'pending'
                       check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes              text,
  created_at         timestamptz not null default now(),

  -- Prevent double-booking: same barber can't have two appointments
  -- at the same date + start_time
  unique (barber_id, appointment_date, start_time)
);

-- Index for common query patterns
create index if not exists idx_appointments_customer
  on public.appointments(customer_id);
create index if not exists idx_appointments_barber_date
  on public.appointments(barber_id, appointment_date);
create index if not exists idx_appointments_date
  on public.appointments(appointment_date);

-- ── Row Level Security (RLS) ──────────────────────────────────────────────

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Barbers (public read, admin write)
alter table public.barbers enable row level security;

create policy "Anyone can view active barbers"
  on public.barbers for select
  using (is_active = true);

create policy "Admins can manage barbers"
  on public.barbers for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Services (public read, admin write)
alter table public.services enable row level security;

create policy "Anyone can view active services"
  on public.services for select
  using (is_active = true);

create policy "Admins can manage services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Appointments
alter table public.appointments enable row level security;

create policy "Customers can view their own appointments"
  on public.appointments for select
  using (auth.uid() = customer_id);

create policy "Customers can create their own appointments"
  on public.appointments for insert
  with check (auth.uid() = customer_id);

create policy "Customers can cancel their own appointments"
  on public.appointments for update
  using (auth.uid() = customer_id)
  with check (status = 'cancelled');

create policy "Admins can view all appointments"
  on public.appointments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all appointments"
  on public.appointments for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── Seed Data ─────────────────────────────────────────────────────────────

-- Services
insert into public.services (name, label, description, duration_minutes, price) values
  ('haircut',        'Corte de Cabello',  'Cortes modernos y clásicos. Degradados, cortes estructurados y más.', 30,  2500),
  ('beard',          'Arreglo de Barba',  'Perfilado, degradado y acondicionamiento. Terminación con toalla caliente.', 20, 1500),
  ('facial_cleaning','Limpieza Facial',   'Tratamiento completo: limpieza, hidratación y exfoliación.', 40, 3000)
on conflict do nothing;

-- Barbers
insert into public.barbers (name, specialty) values
  ('Carlos Méndez',   'Especialista en degradados'),
  ('Diego Romero',    'Cortes clásicos y modernos'),
  ('Matías Torres',   'Barba y acabados'),
  ('Sebastián Vega',  'Estilos urbanos'),
  ('Facundo Ruiz',    'Limpieza facial y cuidado')
on conflict do nothing;

-- ── How to create an admin user ───────────────────────────────────────────
-- 1. Register normally through the app.
-- 2. Then run in SQL Editor:
--    UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
