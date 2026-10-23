import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  DollarSign,
  Receipt,
} from "lucide-react";

import "./AdminPayments.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

function extractPayments(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.payments)) {
    return response.payments;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function getPaymentId(payment) {
  return (
    payment?.id ??
    payment?.payment_id ??
    payment?.transaction_id ??
    payment?.reference ??
    "—"
  );
}

function getCustomerName(payment) {
  return (
    payment?.user_name ||
    payment?.customer_name ||
    payment?.mentor_name ||
    payment?.name ||
    payment?.email ||
    "Unknown customer"
  );
}

function getEmail(payment) {
  return (
    payment?.email ||
    payment?.user_email ||
    payment?.customer_email ||
    "—"
  );
}

function getAmount(payment) {
  const amount =
    payment?.amount ??
    payment?.total ??
    payment?.price ??
    payment?.value ??
    0;

  const numericAmount = Number(amount);

  return Number.isFinite(numericAmount)
    ? numericAmount
    : 0;
}

function getCurrency(payment) {
  return (
    payment?.currency ||
    payment?.currency_code ||
    "USD"
  );
}

function getStatus(payment) {
  return String(
    payment?.status ||
      payment?.payment_status ||
      "pending"
  ).toLowerCase();
}

function getProduct(payment) {
  return (
    payment?.product_name ||
    payment?.product ||
    payment?.description ||
    payment?.item ||
    "Ghost Nexus MQL5 EA"
  );
}

function getDate(payment) {
  const value =
    payment?.created_at ||
    payment?.created ||
    payment?.date ||
    payment?.paid_at ||
    payment?.updated_at;

  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

function StatusBadge({ status }) {
  const normalized = String(status).toLowerCase();

  if (
    normalized === "paid" ||
    normalized === "completed" ||
    normalized === "success" ||
    normalized === "successful"
  ) {
    return (
      <span className="payment-status paid">
        <CheckCircle2 size={13} />
        Paid
      </span>
    );
  }

  if (
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "rejected"
  ) {
    return (
      <span className="payment-status failed">
        <XCircle size={13} />
        Failed
      </span>
    );
  }

  if (
    normalized === "refunded" ||
    normalized === "refund"
  ) {
    return (
      <span className="payment-status refunded">
        <AlertCircle size={13} />
        Refunded
      </span>
    );
  }

  return (
    <span className="payment-status pending">
      <Clock3 size={13} />
      Pending
    </span>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const loadPayments = useCallback(async () => {
    setError("");

    try {
      const response =
        await apiRequest("/admin/payments");

      const paymentList =
        extractPayments(response);

      setPayments(paymentList);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  function handleRefresh() {
    setRefreshing(true);
    loadPayments();
  }

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const status = getStatus(payment);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        getPaymentId(payment),
        getCustomerName(payment),
        getEmail(payment),
        getProduct(payment),
        status,
        getCurrency(payment),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [payments, search, statusFilter]);

  const statistics = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let failed = 0;
    let revenue = 0;

    for (const payment of payments) {
      const status = getStatus(payment);
      const amount = getAmount(payment);

      if (
        status === "paid" ||
        status === "completed" ||
        status === "success" ||
        status === "successful"
      ) {
        paid += 1;
        revenue += amount;
      } else if (
        status === "failed" ||
        status === "cancelled" ||
        status === "canceled" ||
        status === "rejected"
      ) {
        failed += 1;
      } else {
        pending += 1;
      }
    }

    return {
      total: payments.length,
      paid,
      pending,
      failed,
      revenue,
    };
  }, [payments]);

  return (
    <div className="admin-payments-page">

      <div className="admin-payments-heading">

        <div>
          <div className="admin-payments-eyebrow">
            FINANCIAL MANAGEMENT
          </div>

          <h2>Payments</h2>

          <p>
            Monitor verified payment
            transactions and MQL5 EA orders.
          </p>
        </div>

        <button
          type="button"
          className="admin-payments-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "payment-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing"
            : "Refresh"}
        </button>

      </div>

      {error && (
        <div className="admin-payments-error">
          <AlertCircle size={18} />

          <div>
            <strong>
              Payment API error
            </strong>

            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="admin-payment-stats">

        <div className="payment-stat-card">
          <div className="payment-stat-icon">
            <Receipt size={18} />
          </div>

          <span>Total Transactions</span>

          <strong>
            {statistics.total.toLocaleString()}
          </strong>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon">
            <CheckCircle2 size={18} />
          </div>

          <span>Paid</span>

          <strong>
            {statistics.paid.toLocaleString()}
          </strong>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon">
            <Clock3 size={18} />
          </div>

          <span>Pending</span>

          <strong>
            {statistics.pending.toLocaleString()}
          </strong>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon">
            <XCircle size={18} />
          </div>

          <span>Failed</span>

          <strong>
            {statistics.failed.toLocaleString()}
          </strong>
        </div>

        <div className="payment-stat-card revenue">
          <div className="payment-stat-icon">
            <DollarSign size={18} />
          </div>

          <span>Verified Revenue</span>

          <strong>
            ${statistics.revenue.toFixed(2)}
          </strong>
        </div>

      </div>

      <div className="admin-payments-panel">

        <div className="admin-payments-toolbar">

          <div className="payment-search">

            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search payment, customer or product..."
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="payment-status-filter"
          >
            <option value="all">
              All statuses
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="failed">
              Failed
            </option>

            <option value="refunded">
              Refunded
            </option>
          </select>

        </div>

        <div className="admin-payments-table-wrapper">

          {loading ? (
            <div className="payments-empty">
              <RefreshCw
                size={20}
                className="payment-spin"
              />

              <span>
                Loading payments...
              </span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="payments-empty">
              <CreditCard size={22} />

              <strong>
                No payments found
              </strong>

              <span>
                Payments returned by the backend
                will appear here.
              </span>
            </div>
          ) : (
            <table className="admin-payments-table">

              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {filteredPayments.map(
                  (payment, index) => {
                    const id =
                      getPaymentId(payment);

                    const amount =
                      getAmount(payment);

                    const currency =
                      getCurrency(payment);

                    const status =
                      getStatus(payment);

                    return (
                      <tr
                        key={`${id}-${index}`}
                      >

                        <td>
                          <div className="payment-id">
                            #{id}
                          </div>
                        </td>

                        <td>
                          <div className="payment-customer">

                            <strong>
                              {getCustomerName(
                                payment
                              )}
                            </strong>

                            <span>
                              {getEmail(payment)}
                            </span>

                          </div>
                        </td>

                        <td>
                          <span className="payment-product">
                            {getProduct(payment)}
                          </span>
                        </td>

                        <td>
                          <strong className="payment-amount">
                            {currency}{" "}
                            {amount.toFixed(2)}
                          </strong>
                        </td>

                        <td>
                          <StatusBadge
                            status={status}
                          />
                        </td>

                        <td>
                          <span className="payment-date">
                            {getDate(payment)}
                          </span>
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}