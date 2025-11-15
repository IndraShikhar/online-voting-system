
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  PlusCircle,
  List,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/elections/create", label: "Create Election", icon: <PlusCircle size={18} /> },
    { to: "/admin/candidates", label: "Candidates", icon: <Users size={18} /> },
    { to: "/admin/candidates/add", label: "Add Candidate", icon: <PlusCircle size={18} /> },
    { to: "/admin/profile", label: "Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">

      <aside className="w-72 bg-[#14213D] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <p className="text-sm text-gray-300">Online Voting System</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-[#14213D] font-semibold"
                    : "hover:bg-white/10"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-2 px-4 py-2 w-full bg-red-600 text-white rounded-lg">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
