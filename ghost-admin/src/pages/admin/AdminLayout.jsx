import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bot,
  KeyRound,
  ShoppingCart,
  CreditCard,
  Palette,
  FileText,
  Settings,
  Ghost,
} from "lucide-react";

import "./AdminLayout.css";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Mentors",
    path: "/admin/applications",
    icon: UserCheck,
  },
  {
    name: "Licenses",
    path: "/admin/licenses",
    icon: KeyRound,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "EAs",
    path: "/admin/eas",
    icon: Bot,
  },
  {
    name: "MQL5 Orders",
    path: "/admin/mql5-orders",
    icon: ShoppingCart,
  },
  {
    name: "Branding",
    path: "/admin/branding",
    icon: Palette,
  },
  {
    name: "Logs",
    path: "/admin/logs",
    icon: FileText,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <Ghost size={24} />
          </div>

          <div>
            <div className="admin-logo-title">
              GHOST NEXUS
            </div>

            <div className="admin-logo-subtitle">
              ADMIN PANEL
            </div>
          </div>
        </div>

        <nav className="admin-nav">
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

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-system">
          <span className="admin-system-dot" />

          <div>
            <strong>System Online</strong>
            <small>Ghost Nexus Admin</small>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="admin-header-label">
              GHOST NEXUS
            </span>

            <h1>Administration</h1>
          </div>

          <div className="admin-online">
            <span className="admin-online-dot" />
            ADMIN ONLINE
          </div>
        </header>

        <div className="admin-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}