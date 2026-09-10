import EcobinLayout from "../components/EcobinLayout";
import BinCard from "../components/BinCard";
import {
  demoBins,
  demoAlerts,
  demoSms,
} from "../lib/demoData";

export default function DashboardPage() {
  return (
    <EcobinLayout
      title="Bin Level Monitoring"
      subtitle="Real-time status of all waste bins"
    >

      {/* BIN CARDS */}
      <div className="bin-grid">

        {demoBins.map((bin) => (
          <BinCard
            key={bin.id}
            bin={bin}
          />
        ))}

      </div>


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