import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Users,
  UserCheck,
  AlertCircle,
} from "lucide-react";

import "./AdminApplications.css";

const API_URL = "http://127.0.0.1:8000";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD APPLICATIONS
  // =========================================================

  const loadApplications = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/mentor/applications`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          typeof data === "object" && data?.detail
            ? Array.isArray(data.detail)
              ? data.detail
                  .map((item) => item?.msg || String(item))
                  .join(", ")
              : data.detail
            : `Server returned HTTP ${response.status}`;

        throw new Error(message);
      }

      /*
       * The backend may return either:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * or:
       *
       * {
       *   "applications": [...]
       * }
       */

      let normalizedApplications = [];

      if (Array.isArray(data)) {
        normalizedApplications = data;
      } else if (
        data &&
        Array.isArray(data.applications)
      ) {
        normalizedApplications = data.applications;
      } else if (
        data &&
        Array.isArray(data.items)
      ) {
        normalizedApplications = data.items;
      } else {
        throw new Error(
          "Invalid response received from mentor application API."
        );
      }

      setApplications(normalizedApplications);
    } catch (err) {
      console.error(
        "Ghost Nexus mentor applications error:",
        err
      );

      setApplications([]);

      setError(
        err?.message ||
          "Unable to load mentor applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // =========================================================
  // REFRESH
  // =========================================================

  const refreshApplications = async () => {
    setRefreshing(true);
    await loadApplications();
  };

  // =========================================================
  // APPROVE APPLICATION
  // =========================================================

  const approveApplication = async (id) => {
    const confirmed = window.confirm(
      "Approve this mentor application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/mentor/applications/${id}/approve`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          typeof data === "object" && data?.detail
            ? Array.isArray(data.detail)
              ? data.detail
                  .map((item) => item?.msg || String(item))
                  .join(", ")
              : data.detail
            : `Approval failed with HTTP ${response.status}`;

        throw new Error(message);
      }

      await loadApplications();
    } catch (err) {
      console.error(
        "Ghost Nexus mentor approval error:",
        err
      );

      setError(
        err?.message ||
          "Unable to approve mentor application."
      );
    }
  };

  // =========================================================
  // REJECT APPLICATION
  // =========================================================

  const rejectApplication = async (id) => {
    const reason = window.prompt(
      "Enter a rejection reason:"
    );

    if (reason === null) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/mentor/applications/${id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            rejection_reason:
              reason.trim() ||
              "Application rejected by admin.",
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          typeof data === "object" && data?.detail
            ? Array.isArray(data.detail)
              ? data.detail
                  .map((item) => item?.msg || String(item))
                  .join(", ")
              : data.detail
            : `Rejection failed with HTTP ${response.status}`;

        throw new Error(message);
      }

      await loadApplications();
    } catch (err) {
      console.error(
        "Ghost Nexus mentor rejection error:",
        err
      );

      setError(
        err?.message ||
          "Unable to reject mentor application."
      );
    }
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const pendingCount = applications.filter(
    (application) =>
      String(application.status || "").toUpperCase() ===
      "PENDING"
  ).length;

  const approvedCount = applications.filter(
    (application) =>
      String(application.status || "").toUpperCase() ===
      "APPROVED"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      String(application.status || "").toUpperCase() ===
      "REJECTED"
  ).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-applications">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="applications-header">
        <div>
          <div className="eyebrow">
            MENTOR MANAGEMENT
          </div>

          <h1>Mentor Applications</h1>

          <p>
            Review users requesting access to the
            Ghost Nexus Mentor system.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={refreshApplications}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "refresh-spinning"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="applications-error">
          <AlertCircle size={18} />

          <div>
            <strong>
              Unable to load applications
            </strong>

            <span>{error}</span>
          </div>
        </div>
      )}

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="application-stats">

        <div className="application-stat">
          <div className="stat-icon">
            <Clock size={19} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="application-stat">
          <div className="stat-icon">
            <Users size={19} />
          </div>

          <div>
            <span>Total Applications</span>
            <strong>
              {applications.length}
            </strong>
          </div>
        </div>

        <div className="application-stat">
          <div className="stat-icon">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="application-stat">
          <div className="stat-icon">
            <XCircle size={19} />
          </div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          APPLICATIONS PANEL
      ====================================================== */}

      <div className="applications-panel">

        <div className="panel-title">
          <div>
            <h2>Applications</h2>

            <span>
              {applications.length} application
              {applications.length === 1
                ? ""
                : "s"}
            </span>
          </div>
        </div>

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <div className="applications-state">

            <RefreshCw
              size={25}
              className="refresh-spinning"
            />

            <p>
              Loading mentor applications...
            </p>

          </div>

        ) : applications.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================== */

          <div className="applications-state">

            <Users size={34} />

            <h3>
              No mentor applications found
            </h3>

            <p>
              The Ghost Nexus API returned no
              mentor applications.
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================== */

          <div className="applications-table-wrapper">

            <table className="applications-table">

              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Mentor ID</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {applications.map(
                  (application) => {

                    const status =
                      String(
                        application.status || ""
                      ).toUpperCase();

                    return (
                      <tr
                        key={
                          application.id ||
                          application.application_number
                        }
                      >

                        {/* APPLICANT */}

                        <td>

                          <div className="applicant-cell">

                            <div className="applicant-avatar">

                              {String(
                                application.full_name ||
                                  "?"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <strong>
                                {
                                  application.full_name ||
                                  "Unknown Applicant"
                                }
                              </strong>

                              <span>
                                ID #
                                {
                                  application.id ||
                                  "—"
                                }
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td>

                          <div className="contact-cell">

                            <span>
                              {
                                application.email ||
                                "No email"
                              }
                            </span>

                            {application.phone && (
                              <small>
                                {
                                  application.phone
                                }
                              </small>
                            )}

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="category">

                            {
                              application.mentorship_category ||
                              "Not specified"
                            }

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`status-badge status-${status.toLowerCase()}`}
                          >

                            {status ===
                              "APPROVED" && (
                              <CheckCircle size={14} />
                            )}

                            {status ===
                              "PENDING" && (
                              <Clock size={14} />
                            )}

                            {status ===
                              "REJECTED" && (
                              <XCircle size={14} />
                            )}

                            {status || "UNKNOWN"}

                          </span>

                        </td>

                        {/* MENTOR ID */}

                        <td>

                          {application.mentor_id ? (

                            <code>
                              {
                                application.mentor_id
                              }
                            </code>

                          ) : (

                            <span className="muted">
                              —
                            </span>

                          )}

                        </td>

                        {/* CREATED */}

                        <td>

                          <span className="date">

                            {application.created_at
                              ? new Date(
                                  application.created_at
                                ).toLocaleDateString()
                              : "—"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">

                            {status ===
                              "PENDING" && (
                              <>

                                <button
                                  type="button"
                                  className="approve-button"
                                  onClick={() =>
                                    approveApplication(
                                      application.id
                                    )
                                  }
                                >

                                  <CheckCircle
                                    size={15}
                                  />

                                  Approve

                                </button>

                                <button
                                  type="button"
                                  className="reject-button"
                                  onClick={() =>
                                    rejectApplication(
                                      application.id
                                    )
                                  }
                                >

                                  <XCircle
                                    size={15}
                                  />

                                  Reject

                                </button>

                              </>
                            )}

                            {status ===
                              "APPROVED" && (

                              <span className="approved-label">

                                <CheckCircle
                                  size={15}
                                />

                                Approved

                              </span>

                            )}

                            {status ===
                              "REJECTED" && (

                              <span className="rejected-label">

                                <XCircle
                                  size={15}
                                />

                                Rejected

                              </span>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}