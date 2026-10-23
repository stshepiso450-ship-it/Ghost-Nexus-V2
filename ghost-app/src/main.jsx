import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import { AppProvider } from "./context/AppContext";
import MT5Provider from "./context/MT5Context";
import { ServerProvider } from "./context/ServerContext";
import { SignalProvider } from "./context/SignalContext";
import { QuotesProvider } from "./context/QuotesContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ServerProvider>
          <MT5Provider>
            <SignalProvider>
              <QuotesProvider>
                <App />
              </QuotesProvider>
            </SignalProvider>
          </MT5Provider>
        </ServerProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);