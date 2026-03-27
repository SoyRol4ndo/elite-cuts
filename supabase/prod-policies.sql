-- ─────────────────────────────────────────────────────────────────────────────
-- PROD POLICIES — strict RLS for production
-- Run this in the Supabase SQL Editor before going live.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Profiles ─────────────────────────────────────────────────────────────────
drop policy if exists "Dev: authenticated users can read all profiles"   on public.profiles;
drop policy if exists "Dev: authenticated users can update all profiles" on public.profiles;
drop policy if exists "Dev: authenticated users can insert profiles"     on public.profiles;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins: use a security-definer function to avoid the recursive RLS reference
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ── Barbers ──────────────────────────────────────────────────────────────────
drop policy if exists "Dev: anyone can read barbers"                on public.barbers;
drop policy if exists "Dev: authenticated users can manage barbers" on public.barbers;

create policy "Anyone can view active barbers"
  on public.barbers for select
  using (is_active = true);

create policy "Admins can manage barbers"
  on public.barbers for all
  using (public.is_admin());

-- ── Services ─────────────────────────────────────────────────────────────────
drop policy if exists "Dev: anyone can read services"                on public.services;
drop policy if exists "Dev: authenticated users can manage services" on public.services;

create policy "Anyone can view active services"
  on public.services for select
  using (is_active = true);

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin());

-- ── Appointments ─────────────────────────────────────────────────────────────
drop policy if exists "Dev: authenticated users can do everything with appointments" on public.appointments;

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
  using (public.is_admin());

create policy "Admins can update all appointments"
  on public.appointments for update
  using (public.is_admin());
