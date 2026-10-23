import React, { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function MentorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadApplications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/mentor-applications/`
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const approve = async (id) => {
    if (!window.confirm("Approve this mentor application?")) {
      return;
    }

    const response = await fetch(
      `${API_URL}/api/mentor-applications/${id}/approve`,
      {
        method: "PATCH",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Approval failed.");
      return;
    }

    alert(
      `Mentor approved.\nMentor ID: ${data.mentor.mentor_id}`
    );

    setSelected(null);
    loadApplications();
  };

  const reject = async (id) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason) {
      return;
    }

    const response = await fetch(
      `${API_URL}/api/mentor-applications/${id}/reject`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Rejection failed.");
      return;
    }

    alert("Mentor application rejected.");

    setSelected(null);
    loadApplications();
  };

  if (loading) {
    return <div>Loading mentor applications...</div>;
  }

  return (
    <div className="mentor-admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Mentor Applications</h1>
          <p>
            Review and manage Ghost Nexus mentor applications.
          </p>
        </div>

        <div className="application-count">
          {applications.length} Applications
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          No mentor applications yet.
        </div>
      ) : (
        <div className="applications-list">

          {applications.map((application) => (
            <div
              key={application.id}
              className="application-card"
            >

              <div>
                <h3>
                  {application.full_name}
                </h3>

                <p>
                  {application.email}
                </p>

                <span className={`status ${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </div>

              <div className="application-actions">

                <button
                  onClick={() =>
                    setSelected(application)
                  }
                >
                  View
                </button>

                {application.status === "PENDING" && (
                  <>
                    <button
                      className="approve"
                      onClick={() =>
                        approve(application.id)
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject"
                      onClick={() =>
                        reject(application.id)
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}

        </div>
      )}

      {selected && (
        <div className="application-modal">

          <div className="modal-content">

            <button
              className="close-modal"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <h2>{selected.full_name}</h2>

            <p>
              <strong>Email:</strong>{" "}
              {selected.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selected.phone || "Not provided"}
            </p>

            <p>
              <strong>Country:</strong>{" "}
              {selected.country || "Not provided"}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {selected.mentorship_category}
            </p>

            <p>
              <strong>Skills:</strong>
              <br />
              {selected.skills}
            </p>

            <p>
              <strong>Experience:</strong>
              <br />
              {selected.experience}
            </p>

            <p>
              <strong>Trading Experience:</strong>
              <br />
              {selected.trading_experience ||
                "Not provided"}
            </p>

            <p>
              <strong>Motivation:</strong>
              <br />
              {selected.motivation}
            </p>

            <p>
              <strong>Availability:</strong>{" "}
              {selected.availability || "Not provided"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selected.status}
            </p>

            {selected.status === "PENDING" && (
              <div className="modal-actions">

                <button
                  className="approve"
                  onClick={() =>
                    approve(selected.id)
                  }
                >
                  Approve Mentor
                </button>

                <button
                  className="reject"
                  onClick={() =>
                    reject(selected.id)
                  }
                >
                  Reject Application
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}