
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import MentorLogin from "./pages/MentorLogin.jsx";
import MentorDashboard from "./pages/mentor/MentorDashboard.jsx";
import MentorProfile from "./pages/mentor/MentorProfile.jsx";
import MentorEAs from "./pages/mentor/MentorEAs.jsx";
import MentorOrders from "./pages/mentor/MentorOrders.jsx";
import MentorPayments from "./pages/mentor/MentorPayments.jsx";
import MentorCredentials from "./pages/mentor/MentorCredentials.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mentor/login" replace />} />
      <Route path="/mentor/login" element={<MentorLogin />} />
      <Route path="/mentor" element={<Navigate to="/mentor/dashboard" replace />} />
      <Route path="/mentor/dashboard" element={<MentorDashboard />} />
      <Route path="/mentor/profile" element={<MentorProfile />} />
      <Route path="/mentor/eas" element={<MentorEAs />} />
      <Route path="/mentor/orders" element={<MentorOrders />} />
      <Route path="/mentor/payments" element={<MentorPayments />} />
      <Route path="/mentor/credentials" element={<MentorCredentials />} />
      <Route path="*" element={<Navigate to="/mentor/dashboard" replace />} />
    </Routes>
  );
}
