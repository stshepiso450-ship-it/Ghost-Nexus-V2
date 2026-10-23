import React, { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import mentorApi from "../../services/mentorApi";
import "./MentorPayments.css";

export default function MentorPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await mentorApi.getPayments();

        setPayments(
          Array.isArray(data)
            ? data
            : data.payments || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function icon(status) {
    if (status === "paid") {
      return <CheckCircle size={15} />;
    }

    if (status === "failed") {
      return <XCircle size={15} />;
    }

    return <Clock size={15} />;
  }

  return (
    <section className="mentor-page">
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">
            BILLING
          </div>

          <h1>Payments</h1>

          <p>
            View payments made for your Ghost Nexus
            products.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mentor-loading">
          Loading payments...
        </div>
      ) : payments.length === 0 ? (
        <div className="mentor-empty">
          <CreditCard size={35} />
          <h2>No payments yet</h2>
        </div>
      ) : (
        <div className="payments-table-card">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    {payment.reference ||
                      payment.id}
                  </td>

                  <td>
                    $
                    {Number(
                      payment.amount || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`payment-status ${
                        payment.status || "pending"
                      }`}
                    >
                      {icon(payment.status)}
                      {payment.status || "pending"}
                    </span>
                  </td>

                  <td>
                    {payment.created_at
                      ? new Date(
                          payment.created_at
                        ).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}