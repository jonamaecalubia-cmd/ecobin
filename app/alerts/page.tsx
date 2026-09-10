import EcobinLayout from "../../components/EcobinLayout";
import { demoAlerts } from "../../lib/demoData";

export default function AlertsPage() {
  return (
    <EcobinLayout
      title="Alerts"
      subtitle="Dashboard notifications for warning and full bin levels"
    >

      <section className="page-panel">

        <div className="page-panel-header">

          <div>
            <h3>Recent Alerts</h3>

            <p>
              Warning starts at 70% and Full starts
              at 90%.
            </p>
          </div>

          <span className="count-badge">
            {demoAlerts.length} Alerts
          </span>

        </div>


        <div className="alert-list">

          {demoAlerts.map((alert) => (

            <div
              className="large-alert-row"
              key={alert.id}
            >

              <div
                className={`alert-circle large ${
                  alert.status === "FULL"
                    ? "circle-full"
                    : "circle-warning"
                }`}
              >
                {alert.status === "FULL"
                  ? "!"
                  : "⚠"}
              </div>


              <div className="large-alert-text">

                <h4>
                  {alert.bin} is{" "}
                  {alert.status}
                </h4>

                <p>
                  Bin level reached{" "}
                  <strong>
                    {alert.level}%
                  </strong>
                </p>

                <span>
                  {alert.date}
                </span>

              </div>


              <div className="alert-time">
                {alert.time}
              </div>

            </div>

          ))}

        </div>

      </section>

    </EcobinLayout>
  );
}