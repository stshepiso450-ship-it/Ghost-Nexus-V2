
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileKey,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  RefreshCw,
  ShieldCheck,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";

import mentorApi from "../../services/mentorApi";
import "./MentorDashboard.css";

const menuItems = [
  { label: "Overview", path: "/mentor/dashboard", icon: LayoutDashboard },
  { label: "My Profile", path: "/mentor/profile", icon: User },
  { label: "My EAs", path: "/mentor/eas", icon: Bot },
  { label: "My Orders", path: "/mentor/orders", icon: Package },
  { label: "Payments", path: "/mentor/payments", icon: Wallet },
  {
    label: "Credentials",
    path: "/mentor/credentials",
    icon: FileKey,
  },
];

const initialData = {
  name: "Mentor",
  mentor_name: "Mentor",
  mentor_id: "",
  profile_picture: "",
  ea_count: 0,
  order_count: 0,
  payment_count: 0,
  license_count: 0,
  client_count: 0,
  withdrawal_count: 0,
  balance: 0,
  sales: 0,
};

function readStoredMentor() {
  try {
    const stored = localStorage.getItem("ghost_nexus_mentor");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function formatMoney(value) {
  const amount = Number(value ?? 0);

  return `R${(Number.isFinite(amount) ? amount : 0).toLocaleString(
    "en-ZA",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  destination,
  money = false,
}) {
  return (
    <article className="gnm-metric-card">
      <div className="gnm-metric-top">
        <span className="gnm-metric-icon">
          <Icon size={20} />
        </span>
        <span className="gnm-metric-label">{title}</span>
      </div>

      <div className="gnm-metric-value">
        {money ? formatMoney(value) : value}
      </div>

      <p className="gnm-metric-description">{description}</p>

      <Link to={destination} className="gnm-metric-link">
        View details <ArrowRight size={15} />
      </Link>
    </article>
  );
}

export default function MentorDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storedMentor = readStoredMentor();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const result = await mentorApi.getDashboard();

        if (!active) return;

        const payload = result?.data ?? result ?? {};

        setData({
          ...initialData,
          ...payload,
          name:
            payload.name ||
            payload.mentor_name ||
            storedMentor.name ||
            storedMentor.mentor_name ||
            "Mentor",
          mentor_id:
            payload.mentor_id || storedMentor.mentor_id || "",
          profile_picture:
            payload.profile_picture ||
            payload.profile_image ||
            storedMentor.profile_picture ||
            storedMentor.profile_image ||
            "",
        });
      } catch (err) {
        if (!active) return;

        console.error("Mentor dashboard error:", err);

        // Keep the dashboard usable with the saved login information.
        // Metrics remain zero until the backend supplies real values.
        setData({
          ...initialData,
          name:
            storedMentor.name ||
            storedMentor.mentor_name ||
            "Mentor",
          mentor_id: storedMentor.mentor_id || "",
          profile_picture:
            storedMentor.profile_picture ||
            storedMentor.profile_image ||
            "",
        });

        setError(
          "Dashboard data could not be refreshed. Check your backend connection."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("ghost_nexus_mentor");
    localStorage.removeItem("ghost_nexus_mentor_logged_in");
    localStorage.removeItem("ghost_nexus_mentor_token");
    localStorage.removeItem("mentor_token");
    localStorage.removeItem("ghost_mentor_token");
    localStorage.removeItem("ghost_mentor");

    sessionStorage.removeItem("ghost_nexus_mentor_logged_in");

    navigate("/mentor/login", { replace: true });
  }

  const mentor = data || initialData;

  const mentorName =
    mentor.name || mentor.mentor_name || "Mentor";

  const mentorId = mentor.mentor_id || "Not assigned";

  const profilePicture =
    mentor.profile_picture || mentor.profile_image || "";

  const eaCount = mentor.ea_count ?? mentor.eas?.length ?? 0;
  const orderCount =
    mentor.order_count ?? mentor.orders?.length ?? 0;
  const paymentCount =
    mentor.payment_count ?? mentor.payments?.length ?? 0;
  const licenseCount =
    mentor.license_count ?? mentor.licenses?.length ?? 0;
  const clientCount =
    mentor.client_count ?? mentor.clients?.length ?? 0;
  const withdrawalCount =
    mentor.withdrawal_count ?? mentor.withdrawals?.length ?? 0;

  return (
    <div className="gnm-layout">
      {mobileMenuOpen && (
        <button
          type="button"
          className="gnm-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`gnm-sidebar ${
          mobileMenuOpen ? "gnm-sidebar-open" : ""
        }`}
      >
        <Link
          to="/mentor/dashboard"
          className="gnm-brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="gnm-brand-mark">
            <ShieldCheck size={25} />
          </span>

          <span className="gnm-brand-copy">
            <strong>GHOST NEXUS</strong>
            <small>MENTOR PORTAL</small>
          </span>

          <button
            type="button"
            className="gnm-mobile-close"
            aria-label="Close menu"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setMobileMenuOpen(false);
            }}
          >
            <X size={20} />
          </button>
        </Link>

        <div className="gnm-sidebar-label">WORKSPACE</div>

        <nav className="gnm-navigation" aria-label="Mentor navigation">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`gnm-nav-link ${
                path === "/mentor/dashboard"
                  ? "gnm-nav-active"
                  : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {path === "/mentor/dashboard" && (
                <span className="gnm-nav-indicator" />
              )}
            </Link>
          ))}
        </nav>

        <div className="gnm-sidebar-bottom">
          <div className="gnm-security-card">
            <span className="gnm-security-icon">
              <ShieldCheck size={20} />
            </span>
            <strong>Mentor workspace</strong>
            <p>Keep your credentials private and secure.</p>
          </div>

          <button
            type="button"
            className="gnm-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>

          <div className="gnm-sidebar-footer">
            Ghost Nexus · Mentor Portal
          </div>
        </div>
      </aside>

      <main className="gnm-main">
        <header className="gnm-topbar">
          <div className="gnm-topbar-left">
            <button
              type="button"
              className="gnm-menu-toggle"
              aria-label="Open navigation"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="gnm-breadcrumb">
                Mentor Portal <ChevronRight size={13} /> Overview
              </span>
              <span className="gnm-topbar-caption">
                Your trading business at a glance
              </span>
            </div>
          </div>

          <div className="gnm-topbar-right">
            <span className="gnm-online-dot" />
            <span className="gnm-online-text">MENTOR AREA</span>

            <div className="gnm-topbar-avatar">
              {profilePicture ? (
                <img src={profilePicture} alt={mentorName} />
              ) : (
                <User size={19} />
              )}
            </div>
          </div>
        </header>

        <div className="gnm-content">
          <section className="gnm-welcome">
            <div className="gnm-welcome-copy">
              <span className="gnm-eyebrow">
                <Activity size={15} /> MENTOR OVERVIEW
              </span>

              <h1>
                Welcome back, <span>{mentorName}</span>
              </h1>

              <p>
                Manage your Expert Advisors, licenses, clients,
                orders, and mentor payments from one workspace.
              </p>
            </div>

            <button
              type="button"
              className="gnm-refresh-button"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </section>

          {error && (
            <div className="gnm-warning" role="status">
              <Activity size={17} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <section className="gnm-loading" aria-live="polite">
              <span className="gnm-loading-ring" />
              <strong>Loading mentor dashboard...</strong>
              <p>Fetching your account information.</p>
            </section>
          ) : (
            <>
              <section className="gnm-profile-strip">
                <div className="gnm-profile-identity">
                  <div className="gnm-profile-avatar">
                    {profilePicture ? (
                      <img src={profilePicture} alt={mentorName} />
                    ) : (
                      <User size={31} />
                    )}
                  </div>

                  <div className="gnm-profile-text">
                    <span className="gnm-small-label">
                      YOUR MENTOR ACCOUNT
                    </span>
                    <h2>{mentorName}</h2>
                    <span className="gnm-mentor-id">
                      ID: {mentorId}
                    </span>
                  </div>
                </div>

                <div className="gnm-account-status">
                  <span className="gnm-status-indicator" />
                  <div>
                    <strong>Mentor workspace</strong>
                    <span>Account overview</span>
                  </div>
                </div>

                <Link
                  to="/mentor/profile"
                  className="gnm-profile-action"
                >
                  Edit profile <ArrowRight size={16} />
                </Link>
              </section>

              <section className="gnm-section">
                <div className="gnm-section-heading">
                  <div>
                    <span className="gnm-section-kicker">
                      PERFORMANCE
                    </span>
                    <h2>Account overview</h2>
                  </div>
                  <span className="gnm-section-note">
                    <Activity size={15} /> Account totals
                  </span>
                </div>

                <div className="gnm-metrics-grid">
                  <MetricCard
                    title="My EAs"
                    value={eaCount}
                    description="Expert Advisors on your account"
                    icon={Bot}
                    destination="/mentor/eas"
                  />

                  <MetricCard
                    title="EA orders"
                    value={orderCount}
                    description="Orders associated with your account"
                    icon={Package}
                    destination="/mentor/orders"
                  />

                  <MetricCard
                    title="Licenses"
                    value={licenseCount}
                    description="Licenses associated with your account"
                    icon={FileKey}
                    destination="/mentor/credentials"
                  />

                  <MetricCard
                    title="Clients"
                    value={clientCount}
                    description="Clients associated with your licenses"
                    icon={Users}
                    destination="/mentor/eas"
                  />
                </div>
              </section>

              <section className="gnm-section">
                <div className="gnm-section-heading">
                  <div>
                    <span className="gnm-section-kicker">
                      FINANCIAL SUMMARY
                    </span>
                    <h2>Payments and earnings</h2>
                  </div>

                  <Link
                    to="/mentor/payments"
                    className="gnm-text-link"
                  >
                    Open payments <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="gnm-finance-grid">
                  <article className="gnm-finance-card">
                    <div className="gnm-finance-top">
                      <span className="gnm-finance-icon">
                        <CircleDollarSign size={21} />
                      </span>
                      <span className="gnm-finance-label">
                        RECORDED SALES
                      </span>
                    </div>

                    <strong className="gnm-finance-amount">
                      {formatMoney(mentor.sales)}
                    </strong>

                    <span className="gnm-finance-foot">
                      <ArrowUpRight size={15} />
                      Recorded account total
                    </span>
                  </article>

                  <article className="gnm-finance-card">
                    <div className="gnm-finance-top">
                      <span className="gnm-finance-icon">
                        <Wallet size={21} />
                      </span>
                      <span className="gnm-finance-label">
                        AVAILABLE BALANCE
                      </span>
                    </div>

                    <strong className="gnm-finance-amount">
                      {formatMoney(mentor.balance)}
                    </strong>

                    <Link
                      to="/mentor/payments"
                      className="gnm-finance-foot gnm-finance-link"
                    >
                      View balance details <ArrowRight size={15} />
                    </Link>
                  </article>

                  <article className="gnm-finance-card">
                    <div className="gnm-finance-top">
                      <span className="gnm-finance-icon">
                        <CreditCard size={21} />
                      </span>
                      <span className="gnm-finance-label">
                        PAYMENT RECORDS
                      </span>
                    </div>

                    <strong className="gnm-finance-amount">
                      {paymentCount}
                    </strong>

                    <Link
                      to="/mentor/payments"
                      className="gnm-finance-foot gnm-finance-link"
                    >
                      View payment history <ArrowRight size={15} />
                    </Link>
                  </article>

                  <article className="gnm-finance-card">
                    <div className="gnm-finance-top">
                      <span className="gnm-finance-icon">
                        <ArrowDownRight size={21} />
                      </span>
                      <span className="gnm-finance-label">
                        WITHDRAWALS
                      </span>
                    </div>

                    <strong className="gnm-finance-amount">
                      {withdrawalCount}
                    </strong>

                    <Link
                      to="/mentor/payments"
                      className="gnm-finance-foot gnm-finance-link"
                    >
                      Manage withdrawals <ArrowRight size={15} />
                    </Link>
                  </article>
                </div>
              </section>

              <section className="gnm-section">
                <div className="gnm-section-heading">
                  <div>
                    <span className="gnm-section-kicker">
                      QUICK ACCESS
                    </span>
                    <h2>Manage your workspace</h2>
                  </div>
                </div>

                <div className="gnm-quick-grid">
                  <Link
                    to="/mentor/eas"
                    className="gnm-quick-card"
                  >
                    <span className="gnm-quick-icon">
                      <Bot size={21} />
                    </span>
                    <span className="gnm-quick-copy">
                      <strong>Manage EAs</strong>
                      <small>View your Expert Advisors</small>
                    </span>
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/mentor/orders"
                    className="gnm-quick-card"
                  >
                    <span className="gnm-quick-icon">
                      <Package size={21} />
                    </span>
                    <span className="gnm-quick-copy">
                      <strong>Manage orders</strong>
                      <small>Review your EA orders</small>
                    </span>
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/mentor/credentials"
                    className="gnm-quick-card"
                  >
                    <span className="gnm-quick-icon">
                      <FileKey size={21} />
                    </span>
                    <span className="gnm-quick-copy">
                      <strong>Credentials and licenses</strong>
                      <small>View your mentor credentials</small>
                    </span>
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/mentor/profile"
                    className="gnm-quick-card"
                  >
                    <span className="gnm-quick-icon">
                      <User size={21} />
                    </span>
                    <span className="gnm-quick-copy">
                      <strong>Update profile</strong>
                      <small>Manage your profile details</small>
                    </span>
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </section>
            </>
          )}

          <footer className="gnm-footer">
            <span>GHOST NEXUS</span>
            <span>Mentor workspace</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
