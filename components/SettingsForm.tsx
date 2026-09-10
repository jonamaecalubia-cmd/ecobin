"use client";

import { useEffect, useState } from "react";

export default function SettingsForm() {
  const [warning, setWarning] = useState(70);
  const [full, setFull] = useState(90);

  const [dashboardAlerts, setDashboardAlerts] =
    useState(true);

  const [smsAlerts, setSmsAlerts] =
    useState(true);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings =
      localStorage.getItem("ecobin-settings");

    if (!savedSettings) {
      return;
    }

    try {
      const settings = JSON.parse(savedSettings);

      if (typeof settings.warning === "number") {
        setWarning(settings.warning);
      }

      if (typeof settings.full === "number") {
        setFull(settings.full);
      }

      if (
        typeof settings.dashboardAlerts ===
        "boolean"
      ) {
        setDashboardAlerts(
          settings.dashboardAlerts
        );
      }

      if (
        typeof settings.smsAlerts === "boolean"
      ) {
        setSmsAlerts(settings.smsAlerts);
      }

    } catch {
      console.log(
        "Could not load saved ECOBIN settings."
      );
    }
  }, []);


  function saveSettings() {

    if (full <= warning) {

      alert(
        "Full threshold must be higher than Warning threshold."
      );

      return;
    }

    const settings = {
      warning,
      full,
      dashboardAlerts,
      smsAlerts,
    };

    localStorage.setItem(
      "ecobin-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }


  return (
    <>

      {/* ================= SETTINGS GRID ================= */}

      <div className="settings-grid">

        {/* ALERT THRESHOLDS */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h3>
                Alert Thresholds
              </h3>

              <p>
                Set the bin levels that trigger
                notifications.
              </p>

            </div>

            <span className="settings-icon">
              ⚠️
            </span>

          </div>


          {/* WARNING */}

          <div className="field">

            <label htmlFor="warning">

              <span>
                Warning Threshold
              </span>

              <strong>
                {warning}%
              </strong>

            </label>


            <input
              id="warning"
              type="range"
              min="1"
              max="89"
              value={warning}
              onChange={(event) =>
                setWarning(
                  Number(event.target.value)
                )
              }
            />


            <small>
              Dashboard and SMS warning alerts
              begin at {warning}%.
            </small>

          </div>


          {/* FULL */}

          <div className="field">

            <label htmlFor="full">

              <span>
                Full Threshold
              </span>

              <strong>
                {full}%
              </strong>

            </label>


            <input
              id="full"
              type="range"
              min="2"
              max="100"
              value={full}
              onChange={(event) =>
                setFull(
                  Number(event.target.value)
                )
              }
            />


            <small>
              Dashboard and SMS full alerts
              begin at {full}%.
            </small>

          </div>

        </section>


        {/* NOTIFICATIONS */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h3>
                Notification Settings
              </h3>

              <p>
                Control ECOBIN notification services.
              </p>

            </div>

            <span className="settings-icon">
              🔔
            </span>

          </div>


          <Toggle
            label="Dashboard Notifications"
            description="Display WARNING and FULL alerts on the dashboard."
            checked={dashboardAlerts}
            onChange={setDashboardAlerts}
          />


          <Toggle
            label="SMS Notifications"
            description="Send SMS when a bin reaches WARNING or FULL."
            checked={smsAlerts}
            onChange={setSmsAlerts}
          />

        </section>


        {/* SYSTEM STATUS */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h3>
                System Status
              </h3>

              <p>
                Current ECOBIN service status.
              </p>

            </div>

            <span className="settings-icon">
              ⚙️
            </span>

          </div>


          <div className="system-setting-row">

            <span>
              Server Connection
            </span>

            <strong className="online-text">
              ● ONLINE
            </strong>

          </div>


          <div className="system-setting-row">

            <span>
              Bin Monitoring
            </span>

            <strong className="online-text">
              ● ACTIVE
            </strong>

          </div>


          <div className="system-setting-row">

            <span>
              Dashboard Alerts
            </span>

            <strong
              className={
                dashboardAlerts
                  ? "online-text"
                  : "muted-text"
              }
            >
              ●{" "}
              {dashboardAlerts
                ? "ENABLED"
                : "DISABLED"}
            </strong>

          </div>


          <div className="system-setting-row">

            <span>
              SMS Service
            </span>

            <strong
              className={
                smsAlerts
                  ? "online-text"
                  : "muted-text"
              }
            >
              ●{" "}
              {smsAlerts
                ? "ENABLED"
                : "DISABLED"}
            </strong>

          </div>

        </section>


        {/* CURRENT CONFIGURATION */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h3>
                Current Configuration
              </h3>

              <p>
                Current ECOBIN notification configuration.
              </p>

            </div>

            <span className="settings-icon">
              ✓
            </span>

          </div>


          <div className="config-summary">

            <div>

              <span>
                Warning
              </span>

              <strong>
                {warning}%
              </strong>

            </div>


            <div>

              <span>
                Full
              </span>

              <strong>
                {full}%
              </strong>

            </div>


            <div>

              <span>
                Dashboard Alerts
              </span>

              <strong>
                {dashboardAlerts
                  ? "ON"
                  : "OFF"}
              </strong>

            </div>


            <div>

              <span>
                SMS Alerts
              </span>

              <strong>
                {smsAlerts
                  ? "ON"
                  : "OFF"}
              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* ================= SAVE BUTTON ================= */}

      <div className="settings-actions">

        {saved && (
          <span className="saved-message">
            ✓ Settings saved successfully
          </span>
        )}


        <button
          type="button"
          className="save-button"
          onClick={saveSettings}
        >
          Save Settings
        </button>

      </div>

    </>
  );
}


/* ================= TOGGLE COMPONENT ================= */

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {

  return (
    <div className="toggle-row">

      <div>

        <strong>
          {label}
        </strong>

        <p>
          {description}
        </p>

      </div>


      <button
        type="button"
        className={`toggle ${
          checked
            ? "toggle-on"
            : ""
        }`}
        onClick={() =>
          onChange(!checked)
        }
        aria-label={label}
        aria-pressed={checked}
      >

        <span />

      </button>

    </div>
  );
}