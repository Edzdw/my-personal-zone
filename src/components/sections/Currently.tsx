import { currently } from '../../data/currently'

function Currently() {
  return (
    <section className="currently">
      <div className="currently__header">
        <div>
          <span className="section-index">05</span>
          <span className="section-title">CURRENTLY</span>
        </div>

        <span className="currently__date">2026</span>
      </div>

      <div className="currently__hero">
        <p>
          CURRENTLY
          <br />
          BUILDING.
          <br />
          LEARNING.
          <br />
          FIGURING THINGS
          <br />
          OUT.
        </p>
      </div>

      <div className="currently__list">
        {currently.map((item) => (
          <div
            className="currently-item"
            key={item.id}
          >
            <div className="currently-item__top">
              <span className="currently-item__id">
                {item.id}
              </span>

              <span className="currently-item__status">
                <i />
                {item.status}
              </span>
            </div>

            <div className="currently-item__content">
              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Currently