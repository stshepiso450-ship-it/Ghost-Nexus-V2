
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public website pages
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Download from "./pages/Download";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Mentor pages
import MentorApplication from "./pages/MentorApplication";
import MentorLogin from "./pages/MentorLogin";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorProfile from "./pages/mentor/MentorProfile";
import MentorEAs from "./pages/mentor/MentorEAs";
import MentorOrders from "./pages/mentor/MentorOrders";
import MentorPayments from "./pages/mentor/MentorPayments";
import MentorCredentials from "./pages/mentor/MentorCredentials";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Fallback
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* ================================================
          PUBLIC WEBSITE
      ================================================= */}

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/pricing" element={<Pricing />} />

      <Route path="/download" element={<Download />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/blog" element={<Blog />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================================================
          MENTOR APPLICATION AND LOGIN
      ================================================= */}

      <Route
        path="/mentor/apply"
        element={<MentorApplication />}
      />

      <Route
        path="/mentor/login"
        element={<MentorLogin />}
      />

      {/* ================================================
          MENTOR WORKSPACE
      ================================================= */}

      <Route
        path="/mentor"
        element={<Navigate to="/mentor/dashboard" replace />}
      />

      <Route
        path="/mentor/dashboard"
        element={<MentorDashboard />}
      />

      <Route
        path="/mentor/profile"
        element={<MentorProfile />}
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
        path="/mentor/credentials"
        element={<MentorCredentials />}
      />

      {/* ================================================
          ADMIN
      ================================================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* ================================================
          404
      ================================================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
