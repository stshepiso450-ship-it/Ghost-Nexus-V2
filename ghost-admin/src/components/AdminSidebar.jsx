import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bot,
  KeyRound,
  ShoppingCart,
  CreditCard,
  Palette,
  Settings,
  ScrollText,
  ArrowLeft,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import "./AdminSidebar.css";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Mentor Applications",
    path: "/admin/applications",
    icon: UserCheck,
  },
  {
    label: "EAs",
    path: "/admin/eas",
    icon: Bot,
  },
  {
    label: "Licenses",
    path: "/admin/licenses",
    icon: KeyRound,
  },
  {
    label: "MQL5 Orders",
    path: "/admin/mql5-orders",
    icon: ShoppingCart,
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Branding",
    path: "/admin/branding",
    icon: Palette,
  },
  {
    label: "System Settings",
    path: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Logs",
    path: "/admin/logs",
    icon: ScrollText,
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <aside className="admin-sidebar">

      <div className="admin-sidebar-brand">

        <div className="admin-brand-mark">
          GN
        </div>

        <div className="admin-brand-text">
          <strong>GHOST NEXUS</strong>
          <span>ADMINISTRATION</span>
        </div>

      </div>

      <div className="admin-sidebar-divider" />

      <nav className="admin-sidebar-nav">

        <div className="admin-nav-label">
          MANAGEMENT
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={18} />

              <span>
                {item.label}
              </span>
            </NavLink>
          );
        })}

      </nav>

      <div className="admin-sidebar-bottom">

        <NavLink
          to="/"
          className="admin-bottom-item"
        >
          <ArrowLeft size={17} />
          <span>Back to App</span>
        </NavLink>

        <button
          type="button"
          className="admin-bottom-item logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}