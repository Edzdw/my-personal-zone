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

      <div className="toolset__list">
        {stack.map((group, index) => (
          <div
            className="stack-group"
            key={group.category}
          >
            <div className="stack-group__header">
              <span>
                {String(index + 1).padStart(2, '0')} —{' '}
                {group.category}
              </span>

              <span
                className={`stack-group__status ${
                  group.status === 'LEARNING'
                    ? 'stack-group__status--learning'
                    : ''
                }`}
              >
                <i />
                {group.status}
              </span>
            </div>

            <div className="stack-group__items">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Toolset