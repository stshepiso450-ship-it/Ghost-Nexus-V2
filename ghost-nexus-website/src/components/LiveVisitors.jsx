import React, { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const VISITOR_ID_KEY = "ghost_nexus_visitor_id";

function getVisitorId() {
  let visitorId = sessionStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId =
      crypto.randomUUID?.() ||
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

    sessionStorage.setItem(
      VISITOR_ID_KEY,
      visitorId
    );
  }

  return visitorId;
}

export default function LiveVisitors() {
  const [viewerCount, setViewerCount] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();

    let mounted = true;
    let websocket = null;
    let heartbeatTimer = null;
    let reconnectTimer = null;

    const sendHeartbeat = async () => {
      try {
        const response = await fetch(
          `${API_URL}/visitors/heartbeat`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              page: window.location.pathname,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Visitor heartbeat failed"
          );
        }

        const data =
          await response.json();

        if (!mounted) return;

        if (
          typeof data.viewers === "number"
        ) {
          setViewerCount(data.viewers);
        } else if (
          typeof data.count === "number"
        ) {
          setViewerCount(data.count);
        }

        setConnected(true);
      } catch {
        if (mounted) {
          setConnected(false);
        }
      }
    };

    const connectWebSocket = () => {
      if (!mounted) return;

      try {
        const wsBase =
          API_URL.replace(
            /^http/,
            "ws"
          );

        websocket = new WebSocket(
          `${wsBase}/ws/visitors?visitor_id=${encodeURIComponent(
            visitorId
          )}`
        );

        websocket.onopen = () => {
          if (!mounted) return;

          setConnected(true);

          sendHeartbeat();
        };

        websocket.onmessage = (event) => {
          try {
            const data =
              JSON.parse(event.data);

            const count =
              data.viewers ??
              data.count ??
              data.active_viewers;

            if (
              typeof count === "number" &&
              mounted
            ) {
              setViewerCount(count);
            }
          } catch {
            // Ignore malformed websocket messages.
          }
        };

        websocket.onclose = () => {
          if (!mounted) return;

          setConnected(false);

          reconnectTimer =
            setTimeout(
              connectWebSocket,
              5000
            );
        };

        websocket.onerror = () => {
          if (
            websocket &&
            websocket.readyState ===
              WebSocket.OPEN
          ) {
            websocket.close();
          }
        };
      } catch {
        setConnected(false);
      }
    };

    sendHeartbeat();
    connectWebSocket();

    heartbeatTimer = setInterval(
      sendHeartbeat,
      15000
    );

    return () => {
      mounted = false;

      if (heartbeatTimer) {
        clearInterval(
          heartbeatTimer
        );
      }

      if (reconnectTimer) {
        clearTimeout(
          reconnectTimer
        );
      }

      if (
        websocket &&
        websocket.readyState ===
          WebSocket.OPEN
      ) {
        websocket.close();
      }
    };
  }, []);

  const displayCount =
    typeof viewerCount === "number"
      ? viewerCount.toLocaleString()
      : "--";

  return (
    <div
      className={`ghost-live-visitors ${
        connected ? "online" : "offline"
      }`}
      title="People currently viewing Ghost Nexus"
      aria-label={`${displayCount} people currently viewing Ghost Nexus`}
    >
      <span
        className="ghost-live-eye"
        aria-hidden="true"
      >
        👁
      </span>

      <span className="ghost-live-number">
        {displayCount}
      </span>

      <span className="ghost-live-label">
        LIVE
      </span>

      <span
        className="ghost-live-dot"
        aria-hidden="true"
      />
    </div>
  );
}