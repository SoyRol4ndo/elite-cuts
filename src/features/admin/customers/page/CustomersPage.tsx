import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Users, Phone, Calendar } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';
import { LoadingSpinner } from '../../../../shared/components/LoadingSpinner';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const { data: customers, isLoading } = useCustomers();

  const filtered = customers?.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Clientes</h1>
        <p className="text-zinc-400 mt-1">
          {customers?.length ?? 0} clientes registrados.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No se encontraron clientes.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 font-black">
                  {customer.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{customer.full_name}</p>
                  <p className="text-xs text-zinc-500">
                    Cliente desde{' '}
                    {format(new Date(customer.created_at), "MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Phone className="w-3.5 h-3.5 text-zinc-600" />
                    {customer.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                  {customer.appointment_count} turno
                  {customer.appointment_count !== 1 ? 's' : ''}
                </div>
                {customer.last_appointment && (
                  <div className="text-xs text-zinc-600">
                    Último:{' '}
                    {format(new Date(customer.last_appointment), "d 'de' MMM yyyy", {
                      locale: es,
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
