import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Users,
  UserCheck,
  Bot,
  KeyRound,
  ShoppingCart,
  CreditCard,
  RefreshCw,
  Server,
  AlertTriangle,
} from "lucide-react";

import "./AdminDashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

async function apiRequest(endpoint) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `HTTP ${response.status}`
    );
  }

  return data;
}

function getNumber(data, keys) {
  for (const key of keys) {
    if (
      data &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      const number = Number(data[key]);

      if (!Number.isNaN(number)) {
        return number;
      }
    }
  }

  return 0;
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="admin-stat-card">

      <div className="admin-stat-top">

        <div className="admin-stat-icon">
          <Icon size={19} />
        </div>

      </div>

      <div className="admin-stat-value">
        {value.toLocaleString()}
      </div>

      <div className="admin-stat-label">
        {label}
      </div>

      <div className="admin-stat-description">
        {description}
      </div>

    </div>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState(null);

  const [health, setHealth] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const results =
          await Promise.allSettled([
            apiRequest("/admin/dashboard"),
            apiRequest("/health"),
          ]);

        const dashboardResult =
          results[0];

        const healthResult =
          results[1];

        if (
          dashboardResult.status === "fulfilled"
        ) {
          setDashboard(
            dashboardResult.value
          );
        } else {
          setDashboard(null);
        }

        if (
          healthResult.status === "fulfilled"
        ) {
          setHealth(
            healthResult.value
          );
        } else {
          setHealth(null);
        }

        if (
          dashboardResult.status === "rejected" &&
          healthResult.status === "rejected"
        ) {
          throw dashboardResult.reason;
        }
      } catch (err) {
        setError(
          err?.message ||
            "Unable to connect to the API."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const data =
    dashboard?.data ||
    dashboard ||
    {};

  const totalUsers = getNumber(
    data,
    [
      "total_users",
      "users",
      "user_count",
    ]
  );

  const activeUsers = getNumber(
    data,
    [
      "active_users",
      "active_user_count",
    ]
  );

  const mentors = getNumber(
    data,
    [
      "mentors",
      "mentor_count",
      "total_mentors",
    ]
  );

  const applications = getNumber(
    data,
    [
      "pending_applications",
      "applications_pending",
      "pending_mentors",
    ]
  );

  const eas = getNumber(
    data,
    [
      "eas",
      "ea_count",
      "total_eas",
    ]
  );

  const licenses = getNumber(
    data,
    [
      "active_licenses",
      "licenses",
      "license_count",
    ]
  );

  const orders = getNumber(
    data,
    [
      "mql5_orders",
      "orders",
      "order_count",
    ]
  );

  const payments = getNumber(
    data,
    [
      "payments",
      "payment_count",
    ]
  );

  const backendOnline =
    Boolean(health) &&
    (
      health.status === "healthy" ||
      health.status === "ONLINE" ||
      health.status === "online"
    );

  return (
    <div className="admin-dashboard">

      <div className="admin-dashboard-heading">

        <div>
          <h2>Command Center</h2>

          <p>
            Manage Ghost Nexus users,
            mentors, EAs, orders and
            platform operations.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "admin-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing"
            : "Refresh"}
        </button>

      </div>

      {error && (
        <div className="admin-api-warning">

          <AlertTriangle size={18} />

          <div>
            <strong>
              Backend connection problem
            </strong>

            <span>
              {error}
            </span>
          </div>

        </div>
      )}

      <div className="admin-overview-grid">

        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          description="Registered platform users"
        />

        <StatCard
          icon={UserCheck}
          label="Active Users"
          value={activeUsers}
          description="Currently active accounts"
        />

        <StatCard
          icon={UserCheck}
          label="Mentors"
          value={mentors}
          description="Approved mentor accounts"
        />

        <StatCard
          icon={Bot}
          label="EAs"
          value={eas}
          description="Registered Expert Advisors"
        />

        <StatCard
          icon={KeyRound}
          label="Active Licenses"
          value={licenses}
          description="Currently active licenses"
        />

        <StatCard
          icon={ShoppingCart}
          label="MQL5 Orders"
          value={orders}
          description="EA orders in the system"
        />

        <StatCard
          icon={CreditCard}
          label="Payments"
          value={payments}
          description="Recorded payment transactions"
        />

        <StatCard
          icon={UserCheck}
          label="Pending Applications"
          value={applications}
          description="Mentor applications awaiting review"
        />

      </div>

      <div className="admin-dashboard-bottom">

        <div className="admin-panel">

          <div className="admin-panel-header">
            <div>
              <h3>Backend Status</h3>
              <p>
                Ghost Nexus API connection
              </p>
            </div>

            <Server size={18} />
          </div>

          <div className="admin-backend-status">

            <div
              className={`admin-large-status ${
                backendOnline
                  ? "online"
                  : "offline"
              }`}
            >
              <span />
              {backendOnline
                ? "ONLINE"
                : "OFFLINE"}
            </div>

            <div className="admin-backend-details">

              <div>
                <span>API</span>
                <strong>
                  {API_BASE_URL}
                </strong>
              </div>

              <div>
                <span>Service</span>
                <strong>
                  {health?.service ||
                    "Ghost Nexus API"}
                </strong>
              </div>

              <div>
                <span>Version</span>
                <strong>
                  {health?.version ||
                    "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>

        <div className="admin-panel">

          <div className="admin-panel-header">
            <div>
              <h3>Administration</h3>
              <p>
                Platform management
              </p>
            </div>
          </div>

          <div className="admin-admin-list">

            <div>
              <span>Mentor Applications</span>
              <strong>
                {applications}
              </strong>
            </div>

            <div>
              <span>Active EAs</span>
              <strong>
                {eas}
              </strong>
            </div>

            <div>
              <span>Active Licenses</span>
              <strong>
                {licenses}
              </strong>
            </div>

            <div>
              <span>MQL5 Orders</span>
              <strong>
                {orders}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}