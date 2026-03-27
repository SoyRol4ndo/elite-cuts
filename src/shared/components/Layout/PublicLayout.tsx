import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
