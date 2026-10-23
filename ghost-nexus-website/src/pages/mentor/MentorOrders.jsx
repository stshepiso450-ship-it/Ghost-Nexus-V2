
import React, { useCallback, useEffect, useState } from "react";
import {
  Package,
  Download,
  Clock,
  CheckCircle,
  CreditCard,
  RefreshCw,
  ShoppingCart,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import mql5Api from "../../services/mql5Api";
import "./MentorOrders.css";

const initialForm = {
  ea_name: "Ghost Nexus EA - MT5",
  price: "15",
  currency: "USD",
};

function normaliseOrders(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function getOrderStatus(order) {
  if (
    order.released === true ||
    order.asset_released === true ||
    order.download_ready === true
  ) {
    return "released";
  }

  return String(
    order.status ||
    order.order_status ||
    order.payment_status ||
    "pending"
  ).toLowerCase();
}

function canDownload(order) {
  const status = getOrderStatus(order);

  return (
    status === "released" ||
    status === "ready" ||
    order.released === true ||
    order.asset_released === true ||
    order.download_ready === true
  );
}

function StatusIcon({ status }) {
  if (canDownload({ status })) {
    return <CheckCircle size={15} />;
  }

  if (status === "paid" || status === "complete") {
    return <CreditCard size={15} />;
  }

  return <Clock size={15} />;
}

export default function MentorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async (quiet = false) => {
    if (quiet) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await mql5Api.mentorOrders();
      setOrders(normaliseOrders(data));
    } catch (err) {
      setError(
        err.message ||
        "Could not load your orders. Check your mentor login and backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setMessage("");
  }

  async function submitOrder(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const result = await mql5Api.createOrder({
        ea_name: form.ea_name,
        price: Number(form.price),
        currency: form.currency,
      });

      setMessage(
        result?.message ||
        "Your EA order request was submitted to the Admin workflow."
      );

      setForm(initialForm);
      await loadOrders(true);
    } catch (err) {
      setError(err.message || "Could not submit your EA order.");
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadOrder(order) {
    setDownloadingId(order.id);
    setError("");
    setMessage("");

    try {
      await mql5Api.download(order.id);
      setMessage("Your released EA download has started.");
    } catch (err) {
      setError(
        err.message ||
        "The EA cannot be downloaded until Admin releases it."
      );
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <section className="mentor-page mentor-orders-page">
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">MQL5 MANAGEMENT</div>
          <h1>My Orders</h1>
          <p>
            Request an EA from Ghost Nexus Admin and track its
            approval, delivery and availability here.
          </p>
        </div>

        <button
          type="button"
          className="mentor-orders-refresh"
          onClick={() => loadOrders(true)}
          disabled={refreshing || loading}
        >
          {refreshing ? (
            <LoaderCircle size={16} className="mentor-orders-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mentor-orders-notice mentor-orders-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          className="mentor-orders-notice mentor-orders-success"
          role="status"
        >
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      <form className="mentor-order-request" onSubmit={submitOrder}>
        <div className="mentor-order-request-heading">
          <div className="mentor-order-request-icon">
            <ShoppingCart size={21} />
          </div>

          <div>
            <h2>Request an EA</h2>
            <p>
              Submitted orders appear in the existing Admin MQL5
              order workflow for review and fulfilment.
            </p>
          </div>
        </div>

        <div className="mentor-order-form-grid">
          <label className="mentor-order-field">
            <span>EA name</span>
            <input
              value={form.ea_name}
              onChange={(event) =>
                updateForm("ea_name", event.target.value)
              }
              minLength={2}
              maxLength={150}
              required
            />
          </label>

          <label className="mentor-order-field">
            <span>Order price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateForm("price", event.target.value)
              }
              required
            />
          </label>

          <label className="mentor-order-field">
            <span>Currency</span>
            <select
              value={form.currency}
              onChange={(event) =>
                updateForm("currency", event.target.value)
              }
            >
              <option value="USD">USD — US Dollar</option>
              <option value="ZAR">ZAR — South African Rand</option>
            </select>
          </label>
        </div>

        <div className="mentor-order-submit-row">
          <p>
            An order request is not an approval or an EA download.
            Admin must upload and release the EA.
          </p>

          <button
            className="mentor-order-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <LoaderCircle size={17} className="mentor-orders-spin" />
            ) : (
              <ShoppingCart size={17} />
            )}
            {submitting ? "Submitting..." : "Submit EA Order"}
          </button>
        </div>
      </form>

      <div className="mentor-orders-list-heading">
        <div>
          <h2>Order History</h2>
          <p>{orders.length} order(s) associated with your account</p>
        </div>
      </div>

      {loading ? (
        <div className="mentor-orders-loading">
          <LoaderCircle size={22} className="mentor-orders-spin" />
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="mentor-empty">
          <Package size={35} />
          <h2>No MQL5 orders yet</h2>
          <p>
            Submit an EA request above. Your orders will appear here
            once the backend records them.
          </p>
        </div>
      ) : (
        <div className="mentor-orders-list">
          {orders.map((order) => {
            const status = getOrderStatus(order);
            const released = canDownload(order);
            const amount = Number(
              order.amount ?? order.price ?? 15
            );
            const currency = order.currency || "USD";

            return (
              <article
                className="mentor-order-card"
                key={order.id || order.order_number}
              >
                <div className="mentor-order-main">
                  <div className="mentor-order-icon">
                    <Package size={22} />
                  </div>

                  <div className="mentor-order-title">
                    <h2>
                      {order.ea_name ||
                        order.product_name ||
                        order.name ||
                        "Ghost Nexus EA"}
                    </h2>

                    <span>
                      Order #{order.order_number || order.id || "—"}
                    </span>
                    {order.created_at && (
                      <small>
                        Created:{" "}
                        {new Date(order.created_at).toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>

                <div className="mentor-order-details">
                  <div>
                    <span>Price</span>
                    <strong>
                      {currency} {Number.isFinite(amount) ? amount.toFixed(2) : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Order status</span>
                    <strong className={`order-status ${status}`}>
                      <StatusIcon status={status} />
                      {status}
                    </strong>
                  </div>

                  <div>
                    <span>EA delivery</span>
                    <strong className={released ? "released-label" : ""}>
                      {released ? "Released" : "Awaiting Admin"}
                    </strong>
                  </div>
                </div>

                {released && (
                  <button
                    type="button"
                    className="download-ea-button"
                    onClick={() => downloadOrder(order)}
                    disabled={downloadingId === order.id}
                  >
                    {downloadingId === order.id ? (
                      <LoaderCircle size={16} className="mentor-orders-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {downloadingId === order.id
                      ? "Preparing download..."
                      : "Download EA"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
