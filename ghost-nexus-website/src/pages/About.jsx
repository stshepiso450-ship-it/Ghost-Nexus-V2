import React from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  ShieldCheck,
  Target,
  Users,
  ArrowRight,
} from "lucide-react";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/about.css";

export default function About() {
  return (
    <>
      <SEO
        title="About Ghost Nexus"
        description="Learn about Ghost Nexus, an intelligent market technology ecosystem built for modern traders and financial technology users."
        path="/about"
      />

      <Navbar />

      <main className="gn-about">

        <section className="gn-about-hero">

          <div className="gn-about-orb" />

          <span className="gn-section-kicker">
            ABOUT GHOST NEXUS
          </span>

          <h1>
            Technology built
            <br />
            for the
            <span> market.</span>
          </h1>

          <p>
            Ghost Nexus is an intelligent financial
            technology ecosystem focused on helping
            people interact with market information
            through modern technology.
          </p>

        </section>


        <section className="gn-about-story">

          <div className="gn-about-story-heading">

            <span className="gn-section-kicker">
              OUR VISION
            </span>

            <h2>
              Making complex
              <span> markets clearer.</span>
            </h2>

          </div>

          <div className="gn-about-story-text">

            <p>
              Markets move continuously. Information
              changes rapidly. Technology gives traders
              the ability to process more information
              than ever before.
            </p>

            <p>
              Ghost Nexus is being developed around
              that idea — creating a connected ecosystem
              where market intelligence, technology and
              user experience work together.
            </p>

            <p>
              Our public platform gives visitors access
              to market information and the Ghost Nexus
              ecosystem, while protected systems remain
              separated for authorized users.
            </p>

          </div>

        </section>


        <section className="gn-about-values">

          <div className="gn-section-heading">

            <span className="gn-section-kicker">
              WHAT DRIVES US
            </span>

            <h2>
              The Ghost Nexus
              <span> principles.</span>
            </h2>

          </div>


          <div className="gn-about-value-grid">

            <article className="gn-about-value-card">

              <BrainCircuit />

              <h3>
                Intelligence
              </h3>

              <p>
                Build technology that helps users
                process information and understand
                markets more effectively.
              </p>

            </article>


            <article className="gn-about-value-card">

              <Target />

              <h3>
                Precision
              </h3>

              <p>
                Focus on clean interfaces, useful
                information and technology designed
                around real user needs.
              </p>

            </article>


            <article className="gn-about-value-card">

              <ShieldCheck />

              <h3>
                Security
              </h3>

              <p>
                Keep public website information
                separated from protected user and
                trading functionality.
              </p>

            </article>


            <article className="gn-about-value-card">

              <Users />

              <h3>
                Community
              </h3>

              <p>
                Create an ecosystem where traders,
                mentors and technology can connect.
              </p>

            </article>

          </div>

        </section>


        <section className="gn-about-cta">

          <div>

            <span className="gn-section-kicker">
              DISCOVER MORE
            </span>

            <h2>
              Explore the
              <span> ecosystem.</span>
            </h2>

          </div>

          <Link
            to="/dashboard"
            className="gn-btn gn-btn-primary"
          >
            LIVE DASHBOARD
            <ArrowRight size={18} />
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}