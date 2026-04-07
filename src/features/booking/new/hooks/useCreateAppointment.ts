import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';
import { useAuthStore } from '../../../../shared/stores/authStore';

interface CreateAppointmentPayload {
  barber_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes?: string | null;
}

export function useCreateAppointment() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => {
      if (!user) throw new Error('Debés iniciar sesión para reservar un turno.');
      return appointmentsService.create({ ...payload, customer_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.mine(user?.id ?? ''),
      });
    },
  });
}
