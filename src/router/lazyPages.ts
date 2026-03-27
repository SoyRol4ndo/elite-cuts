import { lazy } from 'react';

export const LandingPage = lazy(() =>
  import('../features/landing/pages/LandingPage').then((m) => ({
    default: m.LandingPage,
  })),
);

export const LoginPage = lazy(() =>
  import('../features/auth/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
);

export const RegisterPage = lazy(() =>
  import('../features/auth/pages/RegisterPage').then((m) => ({
    default: m.RegisterPage,
  })),
);

export const BookingPage = lazy(() =>
  import('../features/booking/pages/BookingPage').then((m) => ({
    default: m.BookingPage,
  })),
);

export const MyAppointmentsPage = lazy(() =>
  import('../features/booking/pages/MyAppointmentsPage').then((m) => ({
    default: m.MyAppointmentsPage,
  })),
);

export const DashboardPage = lazy(() =>
  import('../features/admin/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);

export const SchedulePage = lazy(() =>
  import('../features/admin/pages/SchedulePage').then((m) => ({
    default: m.SchedulePage,
  })),
);

export const AppointmentsPage = lazy(() =>
  import('../features/admin/pages/AppointmentsPage').then((m) => ({
    default: m.AppointmentsPage,
  })),
);

export const CustomersPage = lazy(() =>
  import('../features/admin/pages/CustomersPage').then((m) => ({
    default: m.CustomersPage,
  })),
);
