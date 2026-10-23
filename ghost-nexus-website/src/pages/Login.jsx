
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Redirect the legacy login page to the canonical Ghost Nexus
 * Mentor Login component, which connects to the backend API.
 */
export default function Login() {
  return <Navigate to="/mentor/login" replace />;
}
