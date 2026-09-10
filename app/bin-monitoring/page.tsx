"use client";

import EcobinLayout from "@/components/EcobinLayout";
import BinCard from "@/components/BinCard";
import { demoBins } from "@/lib/demoData";

export default function BinMonitoringPage() {
  return (
    <EcobinLayout
      title="Bin Level Monitoring"
      subtitle="Real-time status and fill levels of all ECOBIN waste bins"
    >

      {/* ================= OVERVIEW ================= */}

      <div className="overview-grid">

        <div className="overview-card">
          <span className="overview-icon">🗑️</span>

          <div>
            <p>Total Bins</p>
            <strong>{demoBins.length}</strong>
          </div>
        </div>


        <div className="overview-card">
          <span className="overview-icon">🟢</span>

          <div>
            <p>Normal</p>
            <strong>
              {
                demoBins.filter(
                  (bin) => bin.level < 70
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="overview-card">
          <span className="overview-icon">⚠️</span>

          <div>
            <p>Warning</p>
            <strong>
              {
                demoBins.filter(
                  (bin) =>
                    bin.level >= 70 &&
                    bin.level < 90
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="overview-card">
          <span className="overview-icon">🔴</span>

          <div>
            <p>Full</p>
            <strong>
              {
                demoBins.filter(
                  (bin) => bin.level >= 90
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* ================= BIN MONITORING ================= */}

      <section className="monitoring-section">

        <div className="section-heading">

          <div>
            <h3>
              Waste Bin Levels
            </h3>

            <p>
              Monitoring three ECOBIN waste categories
            </p>
          </div>

          <div className="monitoring-live">
            <span />
            LIVE MONITORING
          </div>

        </div>


        <div className="bin-grid">

          {demoBins.map((bin) => (
            <BinCard
              key={bin.id}
              bin={bin}
            />
          ))}

        </div>

      </section>


      {/* ================= THRESHOLD INFORMATION ================= */}

      <section className="threshold-card">

        <div>

          <h3>
            Alert Thresholds
          </h3>

          <p>
            ECOBIN automatically determines the status
            of each bin based on its fill level.
          </p>

        </div>


        <div className="threshold-list">

          <div className="threshold-item">

            <span className="threshold-normal">
              ●
            </span>

            <div>
              <strong>Normal</strong>
              <small>Below 70%</small>
            </div>

          </div>


          <div className="threshold-item">

            <span className="threshold-warning">
              ●
            </span>

            <div>
              <strong>Warning</strong>
              <small>70% – 89%</small>
            </div>

          </div>


          <div className="threshold-item">

            <span className="threshold-full">
              ●
            </span>

            <div>
              <strong>Full</strong>
              <small>90% – 100%</small>
            </div>

          </div>

        </div>

      </section>

    </EcobinLayout>
  );
}
