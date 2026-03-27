import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  {
    to: "/admin",
    end: true,
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/admin/schedule",
    end: false,
    icon: Calendar,
    label: "Agenda",
  },
  {
    to: "/admin/appointments",
    end: false,
    icon: ClipboardList,
    label: "Turnos",
  },
  {
    to: "/admin/customers",
    end: false,
    icon: Users,
    label: "Clientes",
  },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, profile } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-60"
        } shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-zinc-800">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500 rounded-lg">
                <Scissors className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-bold text-sm">
                Elite<span className="text-amber-500">Cuts</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="p-1.5 bg-amber-500 rounded-lg mx-auto">
              <Scissors className="w-4 h-4 text-zinc-950" />
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-2 border-t border-zinc-800 space-y-1">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs text-zinc-500">Administrador</p>
              <p className="text-sm text-zinc-300 truncate">
                {profile?.full_name}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span>Colapsar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
