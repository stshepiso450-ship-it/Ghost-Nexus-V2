import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Activity, ChevronRight, Menu, X } from "lucide-react";
import "../styles/navbar.css";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
  { name: "Download", path: "/download" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 950) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="ghost-navbar">
        <Link to="/" className="ghost-navbar-logo" onClick={closeMenu}>
          <img
            src="/ghost-logo.png"
            alt="Ghost Nexus"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <span className="ghost-navbar-logo-text">GHOST NEXUS</span>
        </Link>

        <nav className="ghost-navbar-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `ghost-navbar-link ${isActive ? "active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="ghost-navbar-viewers" title="Ghost Nexus website status">
          <span className="ghost-navbar-live-ring" />
          <span>LIVE SITE</span>
        </div>

        <div className="ghost-navbar-online">
          <span className="ghost-navbar-online-dot" />
          <span>Online</span>
        </div>

        <Link to="/mentor/apply" className="ghost-navbar-mentor" onClick={closeMenu}>
          Become a Mentor
        </Link>

        <Link to="/login" className="ghost-navbar-cta" onClick={closeMenu}>
          Mentor Login
          <ChevronRight size={14} />
        </Link>

        <button
          type="button"
          className="ghost-navbar-menu"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && (
        <div className="ghost-mobile-menu">
          <div className="ghost-mobile-menu-inner">
            <div className="ghost-mobile-status">
              <Activity size={14} />
              <span>Ghost Nexus Online</span>
              <span className="ghost-mobile-live-dot" />
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `ghost-mobile-link ${isActive ? "active" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link to="/mentor/apply" className="ghost-mobile-login" onClick={closeMenu}>
              Become a Mentor
              <ChevronRight size={16} />
            </Link>

            <Link to="/login" className="ghost-mobile-login" onClick={closeMenu}>
              Mentor Login
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
