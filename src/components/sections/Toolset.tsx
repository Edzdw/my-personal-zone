import { stack } from '../../data/stack'

function Toolset() {
  return (
    <section className="toolset">
      <div className="toolset__header">
        <div>
          <span className="section-index">04</span>
          <span className="section-title">
            CURRENT TOOLSET
          </span>
        </div>

        <span className="toolset__year">2026</span>
      </div>

      <div className="toolset__intro">
        <p>
          THE TOOLS I'M CURRENTLY
          <br />
          BUILDING WITH.
        </p>
      </div>

      <div className="toolset__radar">
        <div className="toolset__radar-grid" />

        {stack.map((group, index) => (
          <div
            className={`tech-system tech-system--${index + 1}`}
            key={group.category}
          >
            <div className="tech-system__core">
              <span className="tech-system__number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="tech-system__category">
                {group.category}
              </span>

              <span
                className={`tech-system__status ${
                  group.status === 'LEARNING'
                    ? 'tech-system__status--learning'
                    : ''
                }`}
              >
                <i />
                {group.status}
              </span>
            </div>

            <div className="tech-system__orbit tech-system__orbit--1" />
            <div className="tech-system__orbit tech-system__orbit--2" />

            <div className="tech-system__items">
              {group.items.map((item, itemIndex) => (
                <span
                  className={`tech-item tech-item--${itemIndex + 1}`}
                  key={item}
                >
                  <i />
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="toolset__signal toolset__signal--1" />
        <div className="toolset__signal toolset__signal--2" />
        <div className="toolset__signal toolset__signal--3" />

        <div className="toolset__system-info">
          <span>SYSTEM CAPABILITIES</span>
          <span>ACTIVE CONNECTIONS</span>
        </div>
      </div>
    </section>
  )
}

export default Toolset