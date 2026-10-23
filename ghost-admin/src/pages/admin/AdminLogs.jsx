import {
  ScrollText,
  Trash2,
} from "lucide-react";

import "./AdminLogs.css";

export default function AdminLogs() {
  const logs = [];

  return (
    <div className="admin-logs-page">
      <section className="admin-page-heading">
        <div>
          <span>
            SYSTEM ACTIVITY
          </span>

          <h1>
            Logs
          </h1>

          <p>
            Monitor administrative and system activity.
          </p>
        </div>

        <button className="admin-secondary-button">
          <Trash2 size={16} />

          CLEAR LOGS
        </button>
      </section>

      <div className="admin-logs-container">
        {logs.length === 0 ? (
          <div className="admin-logs-empty">
            <div>
              <ScrollText size={30} />
            </div>

            <strong>
              NO LOGS AVAILABLE
            </strong>

            <p>
              System and administrative activity
              will appear here.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="admin-log-item"
            >
              {/* REAL LOG */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}