import React, { useEffect, useState } from "react";
import {
  Package,
  Download,
  Clock,
  CheckCircle,
  CreditCard,
} from "lucide-react";

import mql5Api from "../../services/mql5Api";
import "./MentorOrders.css";

export default function MentorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await mql5Api.mentorOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : data.orders || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function statusIcon(status) {
    if (status === "released" || status === "ready") {
      return <CheckCircle size={15} />;
    }

    if (status === "paid") {
      return <CreditCard size={15} />;
    }

    return <Clock size={15} />;
  }

  return (
    <section className="mentor-page">
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">
            MQL5 MANAGEMENT
          </div>

          <h1>My Orders</h1>

          <p>
            View your Ghost Nexus MQL5 EA orders and
            downloads.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mentor-orders-loading">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="mentor-empty">
          <Package size={35} />

          <h2>No MQL5 orders yet</h2>

          <p>
            Your purchased EAs will appear here.
          </p>
        </div>
      ) : (
        <div className="mentor-orders-list">
          {orders.map((order) => (
            <div
              className="mentor-order-card"
              key={order.id}
            >
              <div className="mentor-order-main">
                <div className="mentor-order-icon">
                  <Package size={22} />
                </div>

                <div>
                  <h2>
                    {order.ea_name ||
                      order.name ||
                      "Ghost Nexus EA"}
                  </h2>

                  <span>
                    Order #
                    {order.order_number ||
                      order.id}
                  </span>
                </div>
              </div>

              <div className="mentor-order-details">
                <div>
                  <span>Price</span>
                  <strong>
                    ${Number(order.price || 15).toFixed(2)}
                  </strong>
                </div>

                <div>
                  <span>Payment</span>
                  <strong>
                    {order.payment_status || "pending"}
                  </strong>
                </div>

                <div>
                  <span>EA Status</span>

                  <strong
                    className={`order-status ${
                      order.status || "pending"
                    }`}
                  >
                    {statusIcon(order.status)}
                    {order.status || "pending"}
                  </strong>
                </div>
              </div>

              {(order.status === "ready" ||
                order.status === "released") && (
                <a
                  className="download-ea-button"
                  href={mql5Api.download(order.id)}
                >
                  <Download size={16} />
                  Download EA
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}