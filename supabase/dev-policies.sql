-- ─────────────────────────────────────────────────────────────────────────────
-- DEV POLICIES — permissive RLS for local development
-- Run this in the Supabase SQL Editor while building/testing.
-- When going to production, run prod-policies.sql instead.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Profiles ─────────────────────────────────────────────────────────────────
drop policy if exists "Users can view their own profile"  on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can view all profiles"       on public.profiles;

create policy "Dev: authenticated users can read all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Dev: authenticated users can update all profiles"
  on public.profiles for update
  using (auth.role() = 'authenticated');

create policy "Dev: authenticated users can insert profiles"
  on public.profiles for insert
  with check (auth.role() = 'authenticated');

-- ── Barbers ──────────────────────────────────────────────────────────────────
drop policy if exists "Anyone can view active barbers" on public.barbers;
drop policy if exists "Admins can manage barbers"      on public.barbers;

create policy "Dev: anyone can read barbers"
  on public.barbers for select
  using (true);

create policy "Dev: authenticated users can manage barbers"
  on public.barbers for all
  using (auth.role() = 'authenticated');

-- ── Services ─────────────────────────────────────────────────────────────────
drop policy if exists "Anyone can view active services" on public.services;
drop policy if exists "Admins can manage services"      on public.services;

create policy "Dev: anyone can read services"
  on public.services for select
  using (true);

create policy "Dev: authenticated users can manage services"
  on public.services for all
  using (auth.role() = 'authenticated');

-- ── Appointments ─────────────────────────────────────────────────────────────
drop policy if exists "Customers can view their own appointments"   on public.appointments;
drop policy if exists "Customers can create their own appointments" on public.appointments;
drop policy if exists "Customers can cancel their own appointments" on public.appointments;
drop policy if exists "Admins can view all appointments"            on public.appointments;
drop policy if exists "Admins can update all appointments"          on public.appointments;

create policy "Dev: authenticated users can do everything with appointments"
  on public.appointments for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
