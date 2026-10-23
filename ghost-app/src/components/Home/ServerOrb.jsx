
import React, { useCallback, useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";

import "./ServerOrb.css";

const API = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.68.209:8000"
).replace(/\/+$/, "");

const POSITION_KEY = "ghost_server_position";
const MENTOR_PROFILE_KEY = "ghost_nexus_mentor";
const MENTOR_AVATAR_KEY = "ghost_nexus_mentor_avatar";
const MENTOR_NAME_KEY = "ghost_mentor_name";

const DEFAULT_POSITION = { x: null, y: null };

function safeReadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function firstValue(...values) {
  return values.find(
    (value) => typeof value === "string" && value.trim()
  )?.trim() || "";
}

function resolveImageURL(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const url = value.trim();

  if (/^(data:image\/|blob:|https?:\/\/)/i.test(url)) {
    return url;
  }

  if (url.startsWith("//")) {
    return `${window.location.protocol}${url}`;
  }

  // Profile picture paths are served by the Ghost Nexus API.
  if (url.startsWith("/api/") || url.startsWith("/uploads/")) {
    return `${API}${url}`;
  }

  if (url.startsWith("api/") || url.startsWith("uploads/")) {
    return `${API}/${url}`;
  }

  return "";
}

function readMentorProfile() {
  try {
    const profile =
      safeReadJSON(MENTOR_PROFILE_KEY) || {};

    const licenseProfile =
      safeReadJSON("ghost_nexus_license") ||
      safeReadJSON("ghost_nexus_license_data") ||
      safeReadJSON("ghost_license_data") ||
      {};

    const storedAvatar = localStorage.getItem(MENTOR_AVATAR_KEY);
    let avatarData = storedAvatar || "";

    // Some older builds may have saved the avatar as a JSON object.
    try {
      const parsedAvatar = JSON.parse(storedAvatar || "null");

      if (parsedAvatar && typeof parsedAvatar === "object") {
        avatarData =
          parsedAvatar.profile_image_url ||
          parsedAvatar.mentor_profile_image_url ||
          parsedAvatar.avatar_url ||
          parsedAvatar.url ||
          "";
      }
    } catch {
      // A plain URL or data URL is also supported.
    }

    const name = firstValue(
      profile.mentor_name,
      profile.name,
      profile.full_name,
      profile.mentor?.mentor_name,
      licenseProfile.mentor_name,
      localStorage.getItem(MENTOR_NAME_KEY),
      localStorage.getItem("ghost_nexus_mentor_name")
    );

    const image = firstValue(
      profile.mentor_profile_image_url,
      profile.profile_image_url,
      profile.profile_picture,
      profile.avatar_url,
      profile.mentor?.profile_image_url,
      licenseProfile.mentor_profile_image_url,
      licenseProfile.profile_image_url,
      licenseProfile.avatar_url,
      avatarData
    );

    return {
      name,
      avatarURL: resolveImageURL(image),
      mentorId: firstValue(
        profile.mentor_id,
        profile.mentor?.mentor_id,
        licenseProfile.mentor_id
      ),
    };
  } catch {
    return { name: "", avatarURL: "", mentorId: "" };
  }
}

function getSavedPosition() {
  try {
    const saved = safeReadJSON(POSITION_KEY);

    if (!saved) return DEFAULT_POSITION;

    return {
      x: Number.isFinite(saved.x) ? saved.x : null,
      y: Number.isFinite(saved.y) ? saved.y : null,
    };
  } catch {
    return DEFAULT_POSITION;
  }
}

function clampPosition(x, y, size = 64) {
  const maxX = Math.max(8, window.innerWidth - size - 8);
  const maxY = Math.max(8, window.innerHeight - size - 8);

  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  };
}

function getDefaultPosition() {
  return {
    x: Math.max(12, window.innerWidth - 84),
    y: Math.max(90, window.innerHeight - 180),
  };
}

async function requestJSON(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text };
    }

    if (!response.ok) {
      throw new Error(
        data?.detail ||
          data?.message ||
          `Server returned ${response.status}`
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export default function ServerOrb() {
  const orbRef = useRef(null);

  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
  });

  const [mentorProfile, setMentorProfile] = useState(
    readMentorProfile
  );

  const [online, setOnline] = useState(false);
  const [checking, setChecking] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [position, setPosition] = useState(getSavedPosition());

  const [serverInfo, setServerInfo] = useState({
    backend: false,
    ai: false,
    metaapi: false,
    mt5: false,
    ea: false,
    license: false,
    latency: null,
  });

  const refreshMentorProfile = useCallback(() => {
    setMentorProfile(readMentorProfile());
  }, []);

  // Refresh when the activated license or mentor profile changes.
  useEffect(() => {
    const refresh = () => refreshMentorProfile();

    window.addEventListener("storage", refresh);
    window.addEventListener("ghost:mentor-profile-updated", refresh);
    window.addEventListener("ghost:license-activated", refresh);

    // Also catches same-tab localStorage updates from older components.
    const interval = setInterval(refresh, 1500);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ghost:mentor-profile-updated", refresh);
      window.removeEventListener("ghost:license-activated", refresh);
      clearInterval(interval);
    };
  }, [refreshMentorProfile]);

  const checkServer = useCallback(async () => {
    const started = performance.now();

    try {
      const response = await requestJSON("/status");
      const latency = Math.round(performance.now() - started);

      setOnline(true);

      setServerInfo({
        backend: true,
        ai:
          response?.ai_online === true ||
          response?.ai === true ||
          response?.modules?.ai === true,
        metaapi:
          response?.metaapi_connected === true ||
          response?.metaapi === true ||
          response?.modules?.metaapi === true,
        mt5:
          response?.mt5_connected === true ||
          response?.mt5 === true ||
          response?.modules?.mt5 === true,
        ea:
          response?.ea_running === true ||
          response?.ea === true ||
          response?.modules?.ea === true,
        license:
          response?.license_active === true ||
          response?.license === true,
        latency,
      });
    } catch {
      setOnline(false);

      setServerInfo({
        backend: false,
        ai: false,
        metaapi: false,
        mt5: false,
        ea: false,
        license: false,
        latency: null,
      });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkServer();

    const interval = setInterval(checkServer, 3000);

    return () => clearInterval(interval);
  }, [checkServer]);

  useEffect(() => {
    const saved = getSavedPosition();

    const initial =
      saved.x !== null && saved.y !== null
        ? clampPosition(saved.x, saved.y)
        : getDefaultPosition();

    setPosition(initial);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => {
        const fallback = getDefaultPosition();

        const next = clampPosition(
          current.x ?? fallback.x,
          current.y ?? fallback.y
        );

        try {
          localStorage.setItem(POSITION_KEY, JSON.stringify(next));
        } catch {
          // Keep the position for this session if storage is unavailable.
        }

        return next;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const savePosition = (next) => {
    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(next));
    } catch {
      // Dragging still works for the current session.
    }
  };

  const handlePointerDown = (event) => {
    if (!orbRef.current) return;

    const rect = orbRef.current.getBoundingClientRect();

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };

    try {
      orbRef.current.setPointerCapture(event.pointerId);
    } catch {
      // Ignore pointer capture failures.
    }
  };

  const handlePointerMove = (event) => {
    if (
      !dragRef.current.active ||
      dragRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    const next = clampPosition(
      event.clientX - dragRef.current.offsetX,
      event.clientY - dragRef.current.offsetY
    );

    if (
      Math.abs(next.x - (position.x ?? next.x)) > 3 ||
      Math.abs(next.y - (position.y ?? next.y)) > 3
    ) {
      dragRef.current.moved = true;
    }

    setPosition(next);
    savePosition(next);
  };

  const handlePointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    const moved = dragRef.current.moved;

    dragRef.current = {
      active: false,
      moved: false,
      pointerId: null,
      offsetX: 0,
      offsetY: 0,
    };

    if (!moved) {
      setPanelOpen((current) => !current);
    }
  };

  const statusClass = checking
    ? "checking"
    : online
      ? "online"
      : "offline";

  const statusText = checking
    ? "CHECKING"
    : online
      ? "ONLINE"
      : "OFFLINE";

  return (
    <>
      <div
        ref={orbRef}
        className={`server-orb ${statusClass}`}
        style={{
          left: position.x !== null ? `${position.x}px` : undefined,
          top: position.y !== null ? `${position.y}px` : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label={
          mentorProfile.name
            ? `Ghost Nexus Server for ${mentorProfile.name}: ${statusText}`
            : `Ghost Nexus Server ${statusText}`
        }
      >
        <div className="server-orb-ring" />

        <div className="server-orb-core">
          {mentorProfile.avatarURL ? (
            <img
              className="server-orb-mentor-image"
              src={mentorProfile.avatarURL}
              alt={
                mentorProfile.name
                  ? `${mentorProfile.name} profile`
                  : "Mentor profile"
              }
              draggable="false"
              onError={() => {
                setMentorProfile((current) => ({
                  ...current,
                  avatarURL: "",
                }));
              }}
            />
          ) : (
            <>
              <span className="server-orb-dot" />
              <span className="server-orb-label">
                {mentorProfile.name ? (
                  <UserRound size={16} />
                ) : (
                  "SERVER"
                )}
              </span>
            </>
          )}
        </div>

        <div className="server-orb-status">{statusText}</div>
      </div>

      {panelOpen && (
        <div className="server-orb-panel">
          <div className="server-panel-header">
            <div>
              <strong>GHOST SERVER</strong>
              <span>{API}</span>
            </div>

            <button
              type="button"
              className="server-panel-close"
              onClick={() => setPanelOpen(false)}
              aria-label="Close server panel"
            >
              ×
            </button>
          </div>

          {mentorProfile.name && (
            <div className="server-mentor-profile">
              <div className="server-mentor-avatar">
                {mentorProfile.avatarURL ? (
                  <img
                    src={mentorProfile.avatarURL}
                    alt=""
                    draggable="false"
                    onError={() => {
                      setMentorProfile((current) => ({
                        ...current,
                        avatarURL: "",
                      }));
                    }}
                  />
                ) : (
                  <span>
                    {mentorProfile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="server-mentor-details">
                <small>LICENSE MENTOR</small>
                <strong>{mentorProfile.name}</strong>
                {mentorProfile.mentorId && (
                  <span>{mentorProfile.mentorId}</span>
                )}
              </div>
            </div>
          )}

          <div className="server-panel-main-status">
            <span
              className={`status-light ${
                online ? "online" : "offline"
              }`}
            />

            <div>
              <strong>
                {online ? "SERVER ONLINE" : "SERVER OFFLINE"}
              </strong>

              <small>
                {online
                  ? `${serverInfo.latency ?? "--"} ms response`
                  : "Cannot reach FastAPI"}
              </small>
            </div>
          </div>

          <div className="server-services">
            <ServiceRow name="Backend" online={serverInfo.backend} />
            <ServiceRow name="Ghost AI" online={serverInfo.ai} />
            <ServiceRow name="MetaAPI" online={serverInfo.metaapi} />
            <ServiceRow name="MetaTrader" online={serverInfo.mt5} />
            <ServiceRow name="EA" online={serverInfo.ea} />
            <ServiceRow name="License" online={serverInfo.license} />
          </div>

          <button
            type="button"
            className="server-refresh"
            onClick={checkServer}
          >
            CHECK SERVER
          </button>
        </div>
      )}
    </>
  );
}

function ServiceRow({ name, online }) {
  return (
    <div className="server-service-row">
      <span>{name}</span>

      <span className={online ? "service-online" : "service-offline"}>
        <i />
        {online ? "ONLINE" : "OFFLINE"}
      </span>
    </div>
  );
}
