import {
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import "./AdminUsers.css";

export default function AdminUsers() {
  const users = [];

  return (
    <div className="admin-users-page">
      <section className="admin-page-heading">
        <div>
          <span>
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage Ghost Nexus user accounts.
          </p>
        </div>

        <button className="admin-primary-button">
          <UserPlus size={16} />

          ADD USER
        </button>
      </section>

      <div className="admin-users-toolbar">
        <div className="admin-search-box">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search users..."
          />
        </div>

        <span>
          {users.length} USERS
        </span>
      </div>

      <div className="admin-users-table">
        <div className="admin-table-head">
          <span>
            USER
          </span>

          <span>
            EMAIL
          </span>

          <span>
            STATUS
          </span>

          <span>
            LICENSE
          </span>

          <span>
            ACTION
          </span>
        </div>

        {users.length === 0 ? (
          <div className="admin-empty-state">
            <div>
              <Users size={30} />
            </div>

            <strong>
              NO USERS YET
            </strong>

            <p>
              User accounts will appear here once
              the authentication system is connected.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="admin-table-row"
            >
              {/* REAL USERS WILL GO HERE */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}