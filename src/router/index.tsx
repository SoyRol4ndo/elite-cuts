import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "../shared/components/Layout/PublicLayout";
import { AdminLayout } from "../shared/components/Layout/AdminLayout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { SuspenseWrapper } from "../shared/components/SuspenseWrapper";

import {
  LandingPage,
  LoginPage,
  RegisterPage,
  BookingPage,
  MyAppointmentsPage,
  DashboardPage,
  SchedulePage,
  AppointmentsPage,
  CustomersPage,
} from "./lazyPages";

export const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/login",
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/register",
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },

      // ── Customer protected routes ──────────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/booking",
            element: (
              <SuspenseWrapper>
                <BookingPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/my-appointments",
            element: (
              <SuspenseWrapper>
                <MyAppointmentsPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },

  // ── Admin protected routes ───────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRole="admin" redirectTo="/login" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/admin/schedule",
            element: (
              <SuspenseWrapper>
                <SchedulePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/admin/appointments",
            element: (
              <SuspenseWrapper>
                <AppointmentsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/admin/customers",
            element: (
              <SuspenseWrapper>
                <CustomersPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
