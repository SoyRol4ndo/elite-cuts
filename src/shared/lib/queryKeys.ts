// Centralized TanStack Query key factory.
// Keeps cache invalidation consistent across the app —
// changing a key here automatically updates every hook that uses it.

export const queryKeys = {
  barbers: {
    all: () => ['barbers'] as const,
    active: () => ['barbers', 'active'] as const,
  },

  catalog: {
    all: () => ['catalog'] as const,
    active: () => ['catalog', 'active'] as const,
  },

  appointments: {
    all: () => ['appointments'] as const,
    // Admin — full list with optional status filter
    list: (status?: string) => ['appointments', 'list', status ?? 'all'] as const,
    // Admin — appointments for a specific week
    week: (weekStart: string, weekEnd: string) =>
      ['appointments', 'week', weekStart, weekEnd] as const,
    // Admin — appointments for today
    today: (date: string) => ['appointments', 'today', date] as const,
    // Customer — their own appointments
    mine: (userId: string) => ['appointments', 'mine', userId] as const,
    // Available time slots for booking
    slots: (barberId: string, date: string, duration: number) =>
      ['appointments', 'slots', barberId, date, duration] as const,
    // Count of appointments pending admin action
    pendingCount: () => ['appointments', 'pending', 'count'] as const,
  },

  profiles: {
    all: () => ['profiles'] as const,
    customers: () => ['profiles', 'customers'] as const,
    byId: (userId: string) => ['profiles', userId] as const,
  },

  metrics: {
    admin: (today: string, weekStart: string, weekEnd: string) =>
      ['metrics', 'admin', today, weekStart, weekEnd] as const,
  },
} as const;
