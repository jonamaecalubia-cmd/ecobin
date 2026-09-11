"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function EcobinLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const [now, setNow] = useState(new Date());
  const [notificationCount, setNotificationCount] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ecobin-app">

      {/* =========================
          HEADER
      ========================= */}
      <header className="top-header">

        <div className="brand-area">

          <div className="brand-logo">
            🌱
          </div>

          <div>
            <h1>ECOBIN</h1>

            <p>
              Smart Waste Bin Monitoring System
            </p>
          </div>

        </div>

        <div className="header-right">

          <div className="online-badge">
            <span className="online-dot" />
            SYSTEM ONLINE
          </div>

          <button
            className="notification-button"
            onClick={() => setNotificationCount(0)}
            aria-label="Notifications"
          >
            🔔

            {notificationCount > 0 && (
              <span className="notification-count">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="profile-icon">
            👤
          </div>

        </div>

      </header>

      {/* =========================
          SIDEBAR
      ========================= */}
      <Sidebar />

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="main-content">

        {/* PAGE HEADER */}
        <div className="content-header">

          <div>
            <h2>{title}</h2>

            <p>{subtitle}</p>
          </div>

          {/* DATE AND TIME */}
          <div className="date-time">

            <div>
              📅{" "}
              {now.toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <strong>
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </strong>

          </div>

        </div>

        {/* =========================
            PAGE CONTENT
        ========================= */}
        {children}

        {/* =========================
            SERVER STATUS
        ========================= */}
        <section className="system-panel">

          <div>
            <span className="system-green-dot" />
            Connected to Server
          </div>

          <div>
            Last Update:{" "}
            <strong>
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </div>

          <div>
            Warning: <strong>70%</strong>
          </div>

          <div>
            Full: <strong>90%</strong>
          </div>

        </section>

        {/* =========================
            FOOTER
        ========================= */}
        <footer>

          <span>
            © 2026 ECOBIN. All rights reserved.
          </span>

          <span>
            System Status:{" "}
            <strong>ONLINE</strong>
          </span>

        </footer>

      </main>

    </div>
  );
}