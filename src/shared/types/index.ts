// ─── Database Types ────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin';

export type ServiceType = 'haircut' | 'beard' | 'facial_cleaning';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// ─── Entity Types ──────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name: ServiceType;
  label: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  customer_id: string;
  barber_id: string;
  service_id: string;
  appointment_date: string; // ISO date string: 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
  end_time: string; // 'HH:MM'
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  // Joined relations
  profiles?: Profile;
  barbers?: Barber;
  services?: Service;
}

// ─── Form Types ────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface BookingFormData {
  barber_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
}

// ─── UI / Util Types ───────────────────────────────────────────────────────

export interface TimeSlot {
  time: string; // 'HH:MM'
  available: boolean;
}

export interface AdminMetrics {
  today_appointments: number;
  week_appointments: number;
  pending_appointments: number;
  total_customers: number;
  revenue_today: number;
  revenue_week: number;
}
