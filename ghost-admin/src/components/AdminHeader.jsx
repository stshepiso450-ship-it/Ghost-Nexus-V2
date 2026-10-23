import {
  Bell,
  ShieldCheck,
} from "lucide-react";

import "./AdminHeader.css";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header-system">
        <span className="admin-status-dot" />

        <span>
          SYSTEM ONLINE
        </span>
      </div>

      <div className="admin-header-right">
        <button
          type="button"
          className="admin-header-button"
        >
          <Bell size={17} />
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">
            <ShieldCheck size={16} />
          </div>

          <div>
            <strong>
              Administrator
            </strong>

            <span>
              Ghost Nexus Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}