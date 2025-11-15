import { useState } from "react";
import {
  LayoutDashboard,
  Lock,
  Database,
  Zap,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  Globe,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear JWT
    navigate("/"); // redirect to login
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Globe, label: "APIs", href: "/apis" },
    { icon: Lock, label: "Auth Service", href: "/auth-service" },
    { icon: Database, label: "Schema Registry", href: "/schemas" },
    { icon: Zap, label: "CRUD Service", href: "/crud-service" },
    { icon: BarChart3, label: "Usage & Billing", href: "/billing" },
    { icon: BookOpen, label: "Docs", href: "/docs" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-zinc-900 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 w-64 h-screen bg-black border-r border-zinc-800 p-6 flex flex-col transition-transform duration-300 z-40`}
      >
        {/* Logo */}
        <div className="mb-12 mt-12 md:mt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-lg">D</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">
                Dashboard
              </span>
              <p className="text-xs text-gray-500">BackStack</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-zinc-900"
                }`
              }
            >
              <item.icon className="w-5 h-5 transition-colors" />
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-white transition-colors" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
          <p className="text-xs text-gray-600 text-center mt-4">
            © 2025 BackStack
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
