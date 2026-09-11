import { Bin, getStatus } from "../lib/demoData";

export default function BinCard({
  bin,
}: {
  bin: Bin;
}) {
  const status = getStatus(bin.level);

  return (
    <article
      className={`bin-card status-${status.toLowerCase()}`}
    >

      {/* HEADER */}
      <div className="bin-card-header">

        <div
          className={`large-bin-icon icon-${status.toLowerCase()}`}
        >
          {bin.icon}
        </div>

        <div>

          <h3>{bin.name}</h3>

          <p>{bin.description}</p>

        </div>

      </div>


      {/* BODY */}
      <div className="bin-card-body">

        <div className="bin-visual">

          <div className="bin-container">

            <div
              className={`bin-fill bar-${status.toLowerCase()}`}
              style={{
                height: `${bin.level}%`,
              }}
            />

            <div className="bin-percentage">
              {bin.level}%
            </div>

          </div>

        </div>


        <div className="bin-info">

          <div
            className={`status-label status-${status.toLowerCase()}`}
          >

            <span className="status-dot" />

            {status}

          </div>


          <p>
            Level:{" "}
            <strong>{bin.level}%</strong>
          </p>

          <p>
            Status:{" "}
            <strong>{status}</strong>
          </p>

          <p>
            Last Update:{" "}
            <strong>10:24 AM</strong>
          </p>

        </div>

      </div>


      {/* PROGRESS */}
      <div className="progress-row">

        <div className="progress-background">

          <div
            className={`progress-fill bar-${status.toLowerCase()}`}
            style={{
              width: `${bin.level}%`,
            }}
          />

        </div>

        <strong>
          {bin.level}%
        </strong>

      </div>

    </article>
  );
}