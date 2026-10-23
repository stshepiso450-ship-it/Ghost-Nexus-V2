
import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  RefreshCw,
  Send,
  Upload,
} from "lucide-react";

import mql5Api from "../../services/mql5Api";
import "./AdminMQL5Orders.css";

const normalizedStatus = (value) =>
  String(value || "").trim().toUpperCase();

const isPaid = (order) =>
  normalizedStatus(order.payment_status || order.status) === "PAID";

const isReleased = (order) =>
  normalizedStatus(order.asset_status) === "RELEASED" ||
  order.ea?.released === true;

const isUploaded = (order) =>
  normalizedStatus(order.asset_status) === "READY" ||
  order.ea?.uploaded === true;

const isTestOrder = (order) =>
  String(order.product_name || order.ea_name || "")
    .toUpperCase()
    .includes("TEST");

export default function AdminMQL5Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [releasing, setReleasing] = useState(null);
  const [testingPayment, setTestingPayment] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOrders = useCallback(async (quiet = false) => {
    if (quiet) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const result = await mql5Api.adminList();
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result.orders)
          ? result.orders
          : Array.isArray(result.items)
            ? result.items
            : [];

      setOrders(list);
    } catch (err) {
      setError(err.message || "Unable to load MQL5 orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function upload(orderId, event) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".ex5")) {
      setError("Select a compiled .ex5 file. An .mq5 source file cannot be uploaded here.");
      input.value = "";
      return;
    }

    setUploading(orderId);
    setError("");
    setNotice("");

    try {
      const result = await mql5Api.uploadEA(orderId, file);

      await loadOrders(true);

      setNotice(
        result.message ||
        `Upload request succeeded for ${file.name}. Checking the saved asset status below.`
      );

      // Verify persistence using a fresh order request.
      const savedOrder = await mql5Api.adminGet(orderId);
      const assetStatus = normalizedStatus(savedOrder.asset_status);

      if (assetStatus !== "READY" && savedOrder.ea?.uploaded !== true) {
        setError(
          `The server accepted the upload request but still reports ` +
          `${savedOrder.asset_status || "unknown"} for the asset. ` +
          `Check the backend response and storage before releasing.`
        );
      } else {
        setNotice(
          `EA file "${file.name}" was saved successfully. ` +
          `The order is ready for release.`
        );
      }

      await loadOrders(true);
    } catch (err) {
      setError(err.message || "EA upload failed.");
    } finally {
      setUploading(null);
      input.value = "";
    }
  }

  async function release(orderId) {
    const order = orders.find((item) => item.id === orderId);

    if (!order || (!isPaid(order) && normalizedStatus(order.provider) !== "MENTOR_SUBMISSION") || !isUploaded(order) || isReleased(order)) {
      setError(
        "Release blocked: confirm payment and a successful EA upload first."
      );
      return;
    }

    const confirmed = window.confirm(
      "Release this uploaded EA to the assigned mentor?"
    );

    if (!confirmed) return;

    setReleasing(orderId);
    setError("");
    setNotice("");

    try {
      const result = await mql5Api.release(orderId);
      await loadOrders(true);

      setNotice(
        result.message ||
        `Release request completed for order ${order.order_number || orderId}.`
      );
    } catch (err) {
      setError(err.message || "Unable to release the EA.");
    } finally {
      setReleasing(null);
    }
  }

  async function markTestPaid(orderId) {
    const order = orders.find((item) => item.id === orderId);

    if (!order || !isTestOrder(order)) {
      setError("Payment simulation is permitted only for TEST orders.");
      return;
    }

    if (!window.confirm(
      "SIMULATION ONLY: Mark this TEST order paid? No money will be received."
    )) {
      return;
    }

    setTestingPayment(orderId);
    setError("");
    setNotice("");

    try {
      const result = await mql5Api.simulateTestPayment(orderId);
      await loadOrders(true);

      setNotice(
        result.message ||
        "Test simulation completed. No actual payment was received."
      );
    } catch (err) {
      setError(err.message || "Test payment simulation failed.");
    } finally {
      setTestingPayment(null);
    }
  }

  return (
    <main className="mql5-management">
      <header className="mql5-page-header">
        <div>
          <div className="mql5-eyebrow">MQL5 MANAGEMENT</div>
          <h1>MQL5 Orders</h1>
          <p>Review orders, upload compiled EAs, and release approved files to mentors.</p>
        </div>

        <button
          type="button"
          className="mql5-refresh-button"
          disabled={loading || refreshing}
          onClick={() => loadOrders(true)}
        >
          <RefreshCw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="mql5-message mql5-message-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="mql5-message mql5-message-success" role="status">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading MQL5 orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <Package size={35} />
          <p>No MQL5 orders found.</p>
        </div>
      ) : (
        <div className="mql5-order-list">
          {orders.map((order) => {
            const paid = isPaid(order);
            const uploaded = isUploaded(order);
            const released = isReleased(order);
            const testOrder = isTestOrder(order);
            const mentorSubmission = normalizedStatus(order.provider) === "MENTOR_SUBMISSION";
            const amount = Number(order.amount ?? order.price ?? 0);
            const assetStatus = normalizedStatus(order.asset_status);

            return (
              <article className="mql5-order-card" key={order.id}>
                <div className="mql5-order-header">
                  <div>
                    <span className="order-number">
                      #{order.order_number || order.id}
                    </span>
                    <h2>
                      {order.product_name || order.ea_name || "Ghost Nexus EA"}
                    </h2>
                  </div>

                  <div className={`mql5-status ${paid ? "paid" : "pending"}`}>
                    {released ? (
                      <CheckCircle size={15} />
                    ) : paid ? (
                      <CreditCard size={15} />
                    ) : (
                      <Clock size={15} />
                    )}
                    {released ? "RELEASED" : mentorSubmission ? "AWAITING ADMIN RELEASE" : normalizedStatus(order.payment_status || order.status) || "PENDING"}
                  </div>
                </div>

                <div className="mql5-order-info">
                  <div>
                    <span>Mentor</span>
                    <strong>{order.mentor_name || "—"}</strong>
                  </div>

                  <div>
                    <span>Mentor ID</span>
                    <strong>{order.mentor_id || "—"}</strong>
                  </div>

                  <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
                    <span>Mentor Email</span>
                    <strong style={{ overflowWrap: "anywhere" }}>
                      {order.mentor_email || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Price</span>
                    <strong>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: order.currency || "USD",
                      }).format(Number.isFinite(amount) ? amount : 0)}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong className="paid-text">
                      {mentorSubmission ? "NOT APPLICABLE — MENTOR SUBMISSION" : normalizedStatus(order.payment_status || order.status) || "PENDING"}
                    </strong>
                  </div>

                  <div>
                    <span>EA upload</span>
                    <strong>{assetStatus || "NOT_UPLOADED"}</strong>
                  </div>

                  {order.ea?.filename && (
                    <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
                      <span>Uploaded file</span>
                      <strong style={{ overflowWrap: "anywhere" }}>
                        {order.ea.filename}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="mql5-order-actions">
                  {testOrder && !paid && !released && (
                    <button
                      type="button"
                      className="release-ea-button"
                      disabled={testingPayment === order.id}
                      onClick={() => markTestPaid(order.id)}
                    >
                      {testingPayment === order.id
                        ? "Simulating..."
                        : "Mark TEST Paid (Simulation)"}
                    </button>
                  )}

                  {paid && !uploaded && !released && (
                    <label className="upload-ea-button">
                      <Upload size={16} />
                      {uploading === order.id ? "Uploading..." : "Upload .EX5"}
                      <input
                        type="file"
                        accept=".ex5,application/octet-stream"
                        hidden
                        disabled={uploading === order.id}
                        onChange={(event) => upload(order.id, event)}
                      />
                    </label>
                  )}

                  {(paid || mentorSubmission) && uploaded && !released && (
                    <button
                      type="button"
                      className="release-ea-button"
                      disabled={releasing === order.id}
                      onClick={() => release(order.id)}
                    >
                      <Send size={16} />
                      {releasing === order.id ? "Releasing..." : "Release to Mentor"}
                    </button>
                  )}

                  {released && (
                    <div className="mql5-message mql5-message-success">
                      EA released to the mentor.
                    </div>
                  )}

                  {!paid && !testOrder && (
                    <p className="mql5-help-text">
                      Upload and release are enabled only after payment is confirmed.
                    </p>
                  )}

                  {paid && !uploaded && !released && (
                    <p className="mql5-help-text">
                      Upload the compiled .ex5 file. The Release button appears after the backend confirms the saved upload.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
