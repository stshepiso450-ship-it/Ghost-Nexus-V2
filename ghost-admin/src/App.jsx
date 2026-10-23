import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "./pages/admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminEAs from "./pages/admin/AdminEAs";
import AdminLicenses from "./pages/admin/AdminLicenses";
import AdminMQL5Orders from "./pages/admin/AdminMQL5Orders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminBranding from "./pages/admin/AdminBranding";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogs from "./pages/admin/AdminLogs";

import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorCredentials from "./pages/mentor/MentorCredentials";
import MentorEAs from "./pages/mentor/MentorEAs";
import MentorOrders from "./pages/mentor/MentorOrders";
import MentorPayments from "./pages/mentor/MentorPayments";
import MentorProfile from "./pages/mentor/MentorProfile";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050507",
        color: "#ffffff",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "52px", margin: 0 }}>404</h1>

        <p style={{ color: "#888", marginTop: "10px" }}>
          Page not found.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            ROOT
        ========================== */}
        <Route
          path="/"
          element={<Navigate to="/admin" replace />}
        />

        {/* =========================
            ADMIN
        ========================== */}
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="applications"
            element={<AdminApplications />}
          />

          <Route
            path="eas"
            element={<AdminEAs />}
          />

          <Route
            path="licenses"
            element={<AdminLicenses />}
          />

          <Route
            path="mql5-orders"
            element={<AdminMQL5Orders />}
          />

          <Route
            path="payments"
            element={<AdminPayments />}
          />

          <Route
            path="branding"
            element={<AdminBranding />}
          />

          <Route
            path="logs"
            element={<AdminLogs />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />
        </Route>

        {/* =========================
            MENTOR
        ========================== */}
        <Route
          path="/mentor"
          element={<MentorDashboard />}
        />

        <Route
          path="/mentor/dashboard"
          element={<MentorDashboard />}
        />

        <Route
          path="/mentor/credentials"
          element={<MentorCredentials />}
        />

        <Route
          path="/mentor/eas"
          element={<MentorEAs />}
        />

        <Route
          path="/mentor/orders"
          element={<MentorOrders />}
        />

        <Route
          path="/mentor/payments"
          element={<MentorPayments />}
        />

        <Route
          path="/mentor/profile"
          element={<MentorProfile />}
        />

        {/* =========================
            404
        ========================== */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}