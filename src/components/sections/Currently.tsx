import { currently } from '../../data/currently'

function Currently() {
  return (
    <section className="currently">

      {/* =========================
          HEADER
      ========================= */}

      <div className="currently__header">
        <div>
          <span className="section-index">05</span>

          <span className="section-title">
            CURRENTLY
          </span>
        </div>

        <div className="currently__signal">
          <span className="currently__signal-dot" />

          <span>LIVE / 2026</span>
        </div>
      </div>


      {/* =========================
          HERO
      ========================= */}

      <div className="currently__hero">

        <div className="currently__hero-signal">
          <span>TRANSMISSION FROM HCMC / VN</span>

          <span>STATUS: ACTIVE</span>
        </div>

        <p>
          CURRENTLY
          <br />

          <span>BUILDING.</span>
          <br />

          <span>LEARNING.</span>
          <br />

        </p>

      </div>


      {/* =========================
          LIVE FEED
      ========================= */}

      <div className="currently__feed">

        <div className="currently__feed-line" />

        {currently.map((item, index) => (
          <article
            className={`currently-item ${
              index % 2 === 0
                ? 'currently-item--left'
                : 'currently-item--right'
            }`}
            key={item.id}
          >

            {/* SIGNAL NODE */}

            <div className="currently-item__node">
              <span />
            </div>


            {/* CONTENT */}

            <div className="currently-item__content">

              <div className="currently-item__top">

                <span className="currently-item__id">
                  {item.id}
                </span>

                <span className="currently-item__status">
                  <i />

                  {item.status}
                </span>

              </div>


              <h3>
                {item.title}
              </h3>


              <p>
                {item.description}
              </p>


              <div className="currently-item__meta">

                <span>
                  ACTIVITY / {String(index + 1).padStart(2, '0')}
                </span>

                <span>
                  ACTIVE NOW
                </span>

              </div>

            </div>

          </article>
        ))}

      </div>


      {/* =========================
          FOOTER
      ========================= */}

      <div className="currently__footer">

        <span>
          SIGNAL STILL ACTIVE
        </span>

        <span className="currently__footer-line" />

        <span>
          ↓ KEEP EXPLORING
        </span>

      </div>

    </section>
  )
}

export default Currently