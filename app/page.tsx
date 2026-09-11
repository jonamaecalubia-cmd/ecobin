"use client";

import { useEffect, useState } from "react";
import EcobinLayout from "../components/EcobinLayout";
import BinCard from "../components/BinCard";
import {
  demoAlerts,
  demoSms,
  type Bin,
} from "../lib/demoData";

type DeviceStatus = {
  biodegradable: number;
  recyclable: number;
  residual: number;
  status1: "NORMAL" | "WARNING" | "FULL";
  status2: "NORMAL" | "WARNING" | "FULL";
  status3: "NORMAL" | "WARNING" | "FULL";
  updatedAt: string;
};

const defaultBins: Bin[] = [
  {
    id: "biodegradable",
    name: "Biodegradable Bin",
    description: "Organic waste (food, leaves, etc.)",
    icon: "🌱",
    level: 0,
  },
  {
    id: "recyclable",
    name: "Recyclable Bin",
    description: "Paper, plastic, glass, metal",
    icon: "♻️",
    level: 0,
  },
  {
    id: "residual",
    name: "Residual Bin",
    description: "Other non-recyclable waste",
    icon: "🗑️",
    level: 0,
  },
];

export default function DashboardPage() {
  const [bins, setBins] = useState<Bin[]>(defaultBins);
  const [loading, setLoading] = useState(true);

  async function fetchDeviceStatus() {
    try {
      const response = await fetch(
        "/api/device-status",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        return;
      }

      const data: DeviceStatus =
        result.data;

      setBins([
        {
          ...defaultBins[0],
          level: data.biodegradable,
        },
        {
          ...defaultBins[1],
          level: data.recyclable,
        },
        {
          ...defaultBins[2],
          level: data.residual,
        },
      ]);
    } catch (error) {
      console.error(
        "Failed to fetch EcoBin device status:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeviceStatus();

    // Refresh every 15 seconds
    const interval = setInterval(
      fetchDeviceStatus,
      15000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <EcobinLayout
      title="Bin Level Monitoring"
      subtitle="Real-time status of all waste bins"
    >

      {/* BIN CARDS */}
      <div className="bin-grid">

        {bins.map((bin) => (
          <BinCard
            key={bin.id}
            bin={bin}
          />
        ))}

      </div>

      {loading && (
        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Connecting to ECOBIN device...
        </p>
      )}

      {/* ALERTS + SMS */}
      <div className="bottom-grid">

        {/* ALERTS */}
        <section className="panel">

          <div className="panel-header">

            <div className="panel-title">
              <span>🔔</span>
              <h3>Recent Alerts</h3>
            </div>

            <a
              href="/alerts"
              className="panel-link"
            >
              View All
            </a>

          </div>

          <div className="panel-content">

            {demoAlerts.map((alert) => (

              <div
                className="alert-row"
                key={alert.id}
              >

                <div
                  className={`alert-circle ${
                    alert.status === "FULL"
                      ? "circle-full"
                      : "circle-warning"
                  }`}
                >
                  {alert.status === "FULL"
                    ? "!"
                    : "⚠"}
                </div>

                <div className="alert-text">

                  <strong>
                    {alert.bin} is{" "}
                    {alert.status}
                  </strong>

                  <span>
                    Bin level reached{" "}
                    {alert.level}%
                  </span>

                </div>

                <time>
                  {alert.time}
                </time>

              </div>

            ))}

          </div>

        </section>

        {/* SMS */}
        <section className="panel">

          <div className="panel-header">

            <div className="panel-title">
              <span>💬</span>
              <h3>SMS Notifications</h3>
            </div>

            <a
              href="/sms-alerts"
              className="panel-link"
            >
              View All
            </a>

          </div>

          <div className="panel-content">

            {demoSms.map((sms) => (

              <div
                className="alert-row"
                key={sms.id}
              >

                <div
                  className={`alert-circle ${
                    sms.status === "FULL"
                      ? "circle-full"
                      : "circle-warning"
                  }`}
                >
                  {sms.status === "FULL"
                    ? "!"
                    : "⚠"}
                </div>

                <div className="alert-text">

                  <strong>
                    SMS sent: {sms.bin}{" "}
                    {sms.status}
                  </strong>

                  <span>
                    Sent to:{" "}
                    {sms.recipient}
                  </span>

                </div>

                <time>
                  {sms.time}
                </time>

              </div>

            ))}

          </div>

        </section>

      </div>

    </EcobinLayout>
  );
}