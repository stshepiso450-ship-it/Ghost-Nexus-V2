import React from "react";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import "../styles/hero.css";

function Hero() {
  return (
    <section className="ghost-hero">

      {/* Cyber grid */}
      <div className="ghost-hero-grid" />

      <div className="ghost-hero-container">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="ghost-hero-content">

          <div className="ghost-hero-badge">
            <span className="ghost-hero-badge-dot" />

            Ghost Nexus Trading Intelligence
          </div>


          <h1 className="ghost-hero-title">

            <span className="ghost">
              TRADE
            </span>

            <span className="nexus">
              WITHOUT
              <br />
              LIMITS.
            </span>

          </h1>


          <p className="ghost-hero-description">
            Ghost Nexus brings intelligent market analysis,
            live trading tools, AI-powered signals and
            professional trading technology into one
            powerful ecosystem.
          </p>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="ghost-hero-actions">

            <a
              href="#pricing"
              className="ghost-hero-primary"
            >
              Get Ghost Nexus

              <ArrowRight size={16} />
            </a>


            <a
              href="#dashboard"
              className="ghost-hero-secondary"
            >
              <Play size={15} />

              Explore Platform
            </a>

          </div>


          {/* =================================================
              TRUST
          ================================================= */}

          <div className="ghost-hero-trust">

            <div className="ghost-hero-trust-item">
              <ShieldCheck size={14} />

              <span>
                Secure
              </span>
            </div>


            <div className="ghost-hero-trust-item">
              <Zap size={14} />

              <span>
                AI Powered
              </span>
            </div>


            <div className="ghost-hero-trust-item">
              <BarChart3 size={14} />

              <span>
                Live Markets
              </span>
            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT VISUAL
        ================================================= */}

        <div className="ghost-hero-visual">

          <div className="ghost-core">

            <div className="ghost-core-center">
              <span>
                GN
              </span>
            </div>

          </div>


          {/* =================================================
              FLOATING CARD — MARKET
          ================================================= */}

          <div className="ghost-floating-card top">

            <div className="ghost-floating-card-label">
              Market Status
            </div>

            <div className="ghost-floating-card-value green">
              LIVE
            </div>

          </div>


          {/* =================================================
              FLOATING CARD — SIGNAL
          ================================================= */}

          <div className="ghost-floating-card bottom">

            <div className="ghost-floating-card-label">
              AI Signal
            </div>

            <div className="ghost-floating-card-value">
              <TrendingUp
                size={16}
                style={{
                  display: "inline",
                  marginRight: "5px",
                  color: "#00ff9d",
                }}
              />

              BUY
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;