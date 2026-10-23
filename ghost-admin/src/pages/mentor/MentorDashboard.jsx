import React, { useEffect, useState } from "react";
import {
  Bot,
  CreditCard,
  KeyRound,
  Package,
  ShieldCheck,
  User,
  Wallet,
  FileKey,
  PlusCircle,
  Users,
  Activity,
  ArrowRight,
} from "lucide-react";

import mentorApi from "../../services/mentorApi";
import "./MentorDashboard.css";

export default function MentorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await mentorApi.getDashboard();
        setData(result);
      } catch (error) {
        console.error("Mentor dashboard error:", error);

        setData({
          name: "Mentor",
          mentor_id: "GN-MTR-000001",
          profile_picture: "",
          ea_count: 0,
          order_count: 0,
          payment_count: 0,
          license_count: 0,
          client_count: 0,
          balance: 0,
          sales: 0,
          withdrawal_count: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="mentor-page">
        <div className="mentor-loading">
          <div className="mentor-loading-ring" />
          <span>Loading mentor dashboard...</span>
        </div>
      </section>
    );
  }

  const mentorName = data?.name || data?.mentor_name || "Mentor";
  const mentorId = data?.mentor_id || "GN-MTR-000001";
  const profilePicture =
    data?.profile_picture || data?.profile_image || "";

  const eaCount = data?.ea_count ?? data?.eas?.length ?? 0;
  const orderCount =
    data?.order_count ?? data?.orders?.length ?? 0;
  const paymentCount =
    data?.payment_count ?? data?.payments?.length ?? 0;
  const licenseCount =
    data?.license_count ?? data?.licenses?.length ?? 0;
  const clientCount =
    data?.client_count ?? data?.clients?.length ?? 0;
  const withdrawalCount =
    data?.withdrawal_count ?? data?.withdrawals?.length ?? 0;

  const balance = Number(data?.balance || 0);
  const sales = Number(data?.sales || 0);

  return (
    <section className="mentor-page">

      {/* HEADER */}
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">
            GHOST NEXUS MENTOR
          </div>

          <h1>
            Welcome back, {mentorName}
          </h1>

          <p>
            Manage your mentor profile, EAs, licenses,
            clients, orders and payments.
          </p>
        </div>

        <div className="mentor-header-status">
          <ShieldCheck size={17} />
          <span>MENTOR ACTIVE</span>
        </div>
      </div>

      {/* PROFILE + CREDENTIALS */}
      <div className="mentor-top-grid">

        <div className="mentor-card mentor-profile-card">
          <div className="mentor-card-title">
            <User size={18} />
            <span>PROFILE</span>
          </div>

          <div className="mentor-profile-content">
            <div className="mentor-profile-picture">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={mentorName}
                />
              ) : (
                <User size={34} />
              )}
            </div>

            <div className="mentor-profile-info">
              <span>MENTOR NAME</span>
              <strong>{mentorName}</strong>

              <span>MENTOR ID</span>
              <strong className="mentor-mono">
                {mentorId}
              </strong>
            </div>
          </div>

          <a
            href="/mentor/profile"
            className="mentor-card-action"
          >
            Manage Profile
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="mentor-card mentor-credentials-card">
          <div className="mentor-card-title">
            <KeyRound size={18} />
            <span>CREDENTIALS</span>
          </div>

          <div className="mentor-credential-row">
            <div className="mentor-credential-icon">
              <ShieldCheck size={17} />
            </div>

            <div>
              <span>MENTOR ID</span>
              <strong className="mentor-mono">
                {mentorId}
              </strong>
            </div>
          </div>

          <div className="mentor-credential-row">
            <div className="mentor-credential-icon">
              <KeyRound size={17} />
            </div>

            <div>
              <span>API KEY</span>
              <strong>
                Protected
              </strong>
            </div>
          </div>

          <a
            href="/mentor/credentials"
            className="mentor-card-action"
          >
            View Credentials
            <ArrowRight size={15} />
          </a>
        </div>

      </div>

      {/* EAs */}
      <div className="mentor-section-heading">
        <div>
          <span>TRADING AUTOMATION</span>
          <h2>EAs</h2>
        </div>

        <a
          href="/mentor/eas"
          className="mentor-section-link"
        >
          View All
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="mentor-main-grid">

        <div className="mentor-card mentor-large-card">
          <div className="mentor-card-title">
            <Bot size={18} />
            <span>MY EAs</span>
          </div>

          <div className="mentor-big-number">
            {eaCount}
          </div>

          <p>
            Expert Advisors connected to your mentor
            account.
          </p>

          <div className="mentor-card-buttons">
            <a
              href="/mentor/eas"
              className="mentor-primary-button"
            >
              <Bot size={16} />
              Manage EAs
            </a>

            <a
              href="/mentor/orders"
              className="mentor-secondary-button"
            >
              <PlusCircle size={16} />
              Create EA Order
            </a>
          </div>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <Package size={18} />
            <span>EA ORDERS</span>
          </div>

          <div className="mentor-big-number">
            {orderCount}
          </div>

          <p>
            EA orders submitted by your mentor account.
          </p>

          <a
            href="/mentor/orders"
            className="mentor-card-action"
          >
            View Orders
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <Activity size={18} />
            <span>EA STATUS</span>
          </div>

          <div className="mentor-status-large">
            <ShieldCheck size={25} />
            <strong>ACTIVE</strong>
          </div>

          <p>
            Your mentor EA services are available.
          </p>

          <a
            href="/mentor/eas"
            className="mentor-card-action"
          >
            Check EA Status
            <ArrowRight size={15} />
          </a>
        </div>

      </div>

      {/* LICENSES */}
      <div className="mentor-section-heading">
        <div>
          <span>LICENSE MANAGEMENT</span>
          <h2>Licenses</h2>
        </div>
      </div>

      <div className="mentor-license-grid">

        <div className="mentor-card">
          <div className="mentor-card-title">
            <FileKey size={18} />
            <span>ACTIVE LICENSES</span>
          </div>

          <div className="mentor-big-number">
            {licenseCount}
          </div>

          <p>
            Licenses currently associated with your
            mentor account.
          </p>

          <a
            href="/mentor/credentials"
            className="mentor-card-action"
          >
            Manage Licenses
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <PlusCircle size={18} />
            <span>GENERATE LICENSE</span>
          </div>

          <div className="mentor-license-action">
            <FileKey size={28} />
            <strong>Create New License</strong>
            <span>
              Generate a client license for an approved EA.
            </span>
          </div>

          <a
            href="/mentor/eas"
            className="mentor-primary-button mentor-full-button"
          >
            <PlusCircle size={16} />
            Generate License
          </a>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <Users size={18} />
            <span>CLIENTS</span>
          </div>

          <div className="mentor-big-number">
            {clientCount}
          </div>

          <p>
            Clients connected to your mentor licenses.
          </p>

          <a
            href="/mentor/eas"
            className="mentor-card-action"
          >
            View Clients
            <ArrowRight size={15} />
          </a>
        </div>

      </div>

      {/* PAYMENTS */}
      <div className="mentor-section-heading">
        <div>
          <span>FINANCIAL OVERVIEW</span>
          <h2>Payments</h2>
        </div>

        <a
          href="/mentor/payments"
          className="mentor-section-link"
        >
          View Payments
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="mentor-payment-grid">

        <div className="mentor-card">
          <div className="mentor-card-title">
            <CreditCard size={18} />
            <span>SALES</span>
          </div>

          <div className="mentor-money">
            R{sales.toFixed(2)}
          </div>

          <p>
            Total recorded mentor sales.
          </p>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <Wallet size={18} />
            <span>BALANCE</span>
          </div>

          <div className="mentor-money">
            R{balance.toFixed(2)}
          </div>

          <p>
            Available mentor balance.
          </p>

          <a
            href="/mentor/payments"
            className="mentor-card-action"
          >
            Manage Balance
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <CreditCard size={18} />
            <span>WITHDRAWALS</span>
          </div>

          <div className="mentor-big-number">
            {withdrawalCount}
          </div>

          <p>
            Withdrawal requests submitted by you.
          </p>

          <a
            href="/mentor/payments"
            className="mentor-card-action"
          >
            Manage Withdrawals
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="mentor-card">
          <div className="mentor-card-title">
            <Package size={18} />
            <span>PAYMENT RECORDS</span>
          </div>

          <div className="mentor-big-number">
            {paymentCount}
          </div>

          <p>
            Payment records associated with your account.
          </p>

          <a
            href="/mentor/payments"
            className="mentor-card-action"
          >
            View Records
            <ArrowRight size={15} />
          </a>
        </div>

      </div>

    </section>
  );
}