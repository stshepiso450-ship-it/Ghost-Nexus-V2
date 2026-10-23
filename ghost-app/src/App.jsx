import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import AIScanner from "./pages/AIScanner";
import MetaTrader from "./pages/MetaTrader";

import BottomNav from "./components/Shared/BottomNav";

import DashboardProvider from "./context/DashboardContext";

export default function App() {
  return (
    <DashboardProvider>
      <div className="app">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-scanner" element={<AIScanner />} />
            <Route path="/mt5" element={<MetaTrader />} />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>

        {/* ONE global navigation only */}
        <BottomNav />
      </div>
    </DashboardProvider>
  );
}