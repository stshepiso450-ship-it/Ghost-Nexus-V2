import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import SEO from "../components/SEO";

import "../styles/admin-dashboard.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


const ADMIN_URL =
  import.meta.env.VITE_ADMIN_URL ||
  "http://127.0.0.1:5174";


export default function AdminDashboard() {

  const [
    applications,
    setApplications,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    apk,
    setApk,
  ] = useState(null);


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    reviewingId,
    setReviewingId,
  ] = useState(null);


  const [
    resendingId,
    setResendingId,
  ] = useState(null);


  // ==========================================================
  // LOAD APPLICATIONS
  // ==========================================================

  const loadApplications = async () => {

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/api/mentor-applications/`,
        {
          cache: "no-store",
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Could not load mentor applications."
        );

      }


      setApplications(
        Array.isArray(data)
          ? data
          : data.applications || []
      );


      setMessage("");

    } catch (error) {

      setMessage(
        error.message ||
        "Unable to load applications."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadApplications();

  }, []);


  // ==========================================================
  // REVIEW
  // ==========================================================

  const review = async (
    id,
    action
  ) => {

    if (
      action === "approve"
    ) {

      const confirmed =
        window.confirm(
          "Approve this mentor application?\n\n" +
          "A Mentor ID and API key will be created " +
          "and the approval email will be sent to " +
          "the email address used on the application."
        );


      if (!confirmed) {
        return;
      }
    }


    if (
      action === "reject"
    ) {

      const confirmed =
        window.confirm(
          "Reject this mentor application?"
        );


      if (!confirmed) {
        return;
      }
    }


    setReviewingId(id);

    setMessage("");


    try {

      const url =
        `${API_URL}/api/mentor-applications/${id}/${action}`;


      const options = {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },
      };


      if (
        action === "reject"
      ) {

        options.body =
          JSON.stringify({
            rejection_reason:
              "Application rejected by administrator.",
          });

      }


      const response =
        await fetch(
          url,
          options
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          `Unable to ${action} application.`
        );

      }


      if (
        action === "approve"
      ) {

        setMessage(
          `Mentor approved. Mentor ID: ${
            data.application?.mentor_id ||
            "generated"
          }. Approval email queued for ${
            data.email || "the applicant"
          }.`
        );

      } else {

        setMessage(
          "Mentor application rejected successfully."
        );

      }


      await loadApplications();

    } catch (error) {

      setMessage(
        error.message ||
        "Unable to update application."
      );

    } finally {

      setReviewingId(null);

    }
  };


  // ==========================================================
  // RESEND EMAIL
  // ==========================================================

  const resendEmail = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Send the mentor approval email again?"
      );


    if (!confirmed) {
      return;
    }


    setResendingId(id);

    setMessage("");


    try {

      const response =
        await fetch(
          `${API_URL}/api/mentor-applications/${id}/resend-email`,
          {
            method: "POST",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to resend email."
        );

      }


      setMessage(
        `Approval email queued for ${data.email}.`
      );


      await loadApplications();

    } catch (error) {

      setMessage(
        error.message ||
        "Unable to resend email."
      );

    } finally {

      setResendingId(null);

    }
  };


  // ==========================================================
  // APK UPLOAD
  // ==========================================================

  const uploadApk = async (
    event
  ) => {

    event.preventDefault();


    if (!apk) {
      return;
    }


    setUploading(true);

    setMessage("");


    try {

      const formData =
        new FormData();


      formData.append(
        "file",
        apk
      );


      const response =
        await fetch(
          `${API_URL}/api/admin/apk`,
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "APK upload failed."
        );

      }


      setMessage(
        "APK uploaded successfully."
      );


      setApk(null);


      event.target.reset();

    } catch (error) {

      setMessage(
        error.message ||
        "APK upload failed."
      );

    } finally {

      setUploading(false);

    }
  };


  return (
    <>
      <SEO
        title="Ghost Nexus Admin"
        description="Ghost Nexus administration portal."
        path="/admin"
      />


      <main className="gn-admin-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="gn-admin-header">

          <div>

            <span>
              GHOST NEXUS
            </span>

            <h1>
              Administration
            </h1>

          </div>


          <div className="gn-admin-actions">

            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              OPEN ADMIN APP
            </a>


            <Link to="/">
              WEBSITE
            </Link>

          </div>

        </header>


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (

          <div className="gn-admin-message">

            {message}

          </div>

        )}


        {/* =================================================
            MENTOR APPLICATIONS
        ================================================= */}

        <section className="gn-admin-card">

          <div className="gn-admin-card-heading">

            <div>

              <span>
                MENTOR SYSTEM
              </span>

              <h2>
                Mentor Applications
              </h2>

            </div>


            <button
              type="button"
              onClick={loadApplications}
              disabled={loading}
            >
              {loading
                ? "LOADING..."
                : "REFRESH"}
            </button>

          </div>


          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "12px",
              background:
                "rgba(255,0,0,0.06)",
              border:
                "1px solid rgba(255,0,0,0.2)",
            }}
          >

            <strong>
              APPROVAL FLOW
            </strong>

            <p
              style={{
                marginBottom: 0,
              }}
            >
              Approve an application →
              generate Mentor ID →
              generate API key →
              send approval email to
              the exact application email.
            </p>

          </div>


          {loading ? (

            <p>
              Loading applications...
            </p>

          ) : applications.length === 0 ? (

            <p>
              No mentor applications yet.
            </p>

          ) : (

            <div className="gn-applications">

              {applications.map(
                (app) => (

                  <article
                    className="gn-application"
                    key={app.id}
                  >

                    <div>

                      <h3>
                        {app.full_name}
                      </h3>


                      <p>
                        {app.email}

                        {app.phone
                          ? ` · ${app.phone}`
                          : ""}
                      </p>


                      <p>

                        {app.mentorship_category ||
                          "Mentorship"}

                        {" · "}

                        <strong>
                          {app.status}
                        </strong>

                      </p>


                      {app.country && (

                        <p>
                          Country: {app.country}
                        </p>

                      )}


                      {app.skills && (

                        <p>
                          Skills: {app.skills}
                        </p>

                      )}


                      {app.experience && (

                        <p>
                          Experience: {app.experience}
                        </p>

                      )}


                      {app.trading_experience && (

                        <p>
                          Trading:
                          {" "}
                          {app.trading_experience}
                        </p>

                      )}


                      {app.motivation && (

                        <p className="gn-application-detail">
                          {app.motivation}
                        </p>

                      )}


                      {app.status ===
                        "APPROVED" && (

                        <div
                          style={{
                            marginTop: "15px",
                            padding: "12px",
                            borderRadius: "10px",
                            background:
                              "rgba(0,255,120,0.06)",
                            border:
                              "1px solid rgba(0,255,120,0.2)",
                          }}
                        >

                          <div>
                            <strong>
                              Mentor ID:
                            </strong>

                            {" "}

                            {app.mentor_id ||
                              "Not available"}
                          </div>


                          <div
                            style={{
                              marginTop: "5px",
                            }}
                          >
                            <strong>
                              Email:
                            </strong>

                            {" "}

                            {app.email_sent
                              ? "SENT"
                              : "PENDING / FAILED"}
                          </div>

                        </div>

                      )}


                      {app.status ===
                        "REJECTED" &&
                        app.rejection_reason && (

                        <p>

                          Rejection:
                          {" "}
                          {app.rejection_reason}

                        </p>

                      )}

                    </div>


                    <div className="gn-review-buttons">

                      {app.status !==
                        "APPROVED" &&
                        app.status !==
                        "REJECTED" && (

                        <button
                          type="button"
                          disabled={
                            reviewingId ===
                            app.id
                          }
                          onClick={() =>
                            review(
                              app.id,
                              "approve"
                            )
                          }
                        >

                          {reviewingId ===
                            app.id
                            ? "APPROVING..."
                            : "APPROVE & EMAIL"}

                        </button>

                      )}


                      {app.status !==
                        "REJECTED" && (

                        <button
                          type="button"
                          disabled={
                            reviewingId ===
                            app.id
                          }
                          onClick={() =>
                            review(
                              app.id,
                              "reject"
                            )
                          }
                        >

                          {reviewingId ===
                            app.id
                            ? "PROCESSING..."
                            : "REJECT"}

                        </button>

                      )}


                      {app.status ===
                        "APPROVED" && (

                        <button
                          type="button"
                          disabled={
                            resendingId ===
                            app.id
                          }
                          onClick={() =>
                            resendEmail(
                              app.id
                            )
                          }
                        >

                          {resendingId ===
                            app.id
                            ? "SENDING..."
                            : "RESEND EMAIL"}

                        </button>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* =================================================
            APK
        ================================================= */}

        <section className="gn-admin-card">

          <div className="gn-admin-card-heading">

            <div>

              <span>
                APP DISTRIBUTION
              </span>

              <h2>
                Upload APK
              </h2>

            </div>

          </div>


          <p>
            Upload the newest Android APK.
            The public Download page uses
            the backend APK endpoint.
          </p>


          <form
            onSubmit={uploadApk}
            className="gn-apk-form"
          >

            <input
              type="file"
              accept=".apk,application/vnd.android.package-archive"
              onChange={(event) =>
                setApk(
                  event.target.files?.[0] ||
                  null
                )
              }
              required
            />


            <button
              type="submit"
              disabled={uploading}
            >

              {uploading
                ? "UPLOADING..."
                : "UPLOAD APK"}

            </button>

          </form>

        </section>

      </main>
    </>
  );
}