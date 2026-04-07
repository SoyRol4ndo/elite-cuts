import { lazy } from 'react';

export const LandingPage = lazy(() =>
  import('../features/landing/page/LandingPage').then((m) => ({
    default: m.LandingPage,
  })),
);

export const LoginPage = lazy(() =>
  import('../features/auth/login/page/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
);

export const RegisterPage = lazy(() =>
  import('../features/auth/register/page/RegisterPage').then((m) => ({
    default: m.RegisterPage,
  })),
);

export const BookingPage = lazy(() =>
  import('../features/booking/new/page/BookingPage').then((m) => ({
    default: m.BookingPage,
  })),
);

export const MyAppointmentsPage = lazy(() =>
  import('../features/booking/my-appointments/page/MyAppointmentsPage').then((m) => ({
    default: m.MyAppointmentsPage,
  })),
);

export const DashboardPage = lazy(() =>
  import('../features/admin/dashboard/page/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);

export const SchedulePage = lazy(() =>
  import('../features/admin/schedule/page/SchedulePage').then((m) => ({
    default: m.SchedulePage,
  })),
);

export const AppointmentsPage = lazy(() =>
  import('../features/admin/appointments/page/AppointmentsPage').then((m) => ({
    default: m.AppointmentsPage,
  })),
);

export const CustomersPage = lazy(() =>
  import('../features/admin/customers/page/CustomersPage').then((m) => ({
    default: m.CustomersPage,
  })),
);
