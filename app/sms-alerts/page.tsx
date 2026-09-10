import EcobinLayout from "../../components/EcobinLayout";
import { demoSms } from "../../lib/demoData";

export default function SmsAlertsPage() {
  return (
    <EcobinLayout
      title="SMS Alerts"
      subtitle="History and delivery status of SMS notifications"
    >

      <section className="page-panel">

        <div className="page-panel-header">

          <div>
            <h3>SMS Notification Log</h3>

            <p>
              SMS alerts are generated when a bin
              reaches WARNING or FULL status.
            </p>
          </div>

          <span className="count-badge">
            SMS Enabled
          </span>

        </div>


        <div className="table-wrap">

          <table className="data-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Bin</th>
                <th>Level</th>
                <th>Status</th>
                <th>Recipient</th>
                <th>Result</th>
                <th>Time</th>
              </tr>

            </thead>


            <tbody>

              {demoSms.map((sms) => (

                <tr key={sms.id}>

                  <td>{sms.date}</td>

                  <td>{sms.bin}</td>

                  <td>{sms.level}%</td>

                  <td>

                    <span
                      className={`table-status ${
                        sms.status === "FULL"
                          ? "table-full"
                          : "table-warning"
                      }`}
                    >
                      {sms.status}
                    </span>

                  </td>

                  <td>
                    {sms.recipient}
                  </td>

                  <td>
                    <span className="sms-sent">
                      ● {sms.result}
                    </span>
                  </td>

                  <td>{sms.time}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </EcobinLayout>
  );
}