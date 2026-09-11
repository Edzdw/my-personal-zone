import { projects } from '../../../data/projects'
import './SelectedWork.css'

function SelectedWork() {
  return (
    <section className="selected-work">
      <div className="selected-work__header">
        <span className="section-index">02</span>
        <span className="section-title">SELECTED WORK</span>
        <span className="selected-work__count">
          {projects.length.toString().padStart(2, '0')} PROJECTS
        </span>
      </div>

      <div className="project-constellation">
        {/* Connection lines */}
        <div className="project-constellation__connections" aria-hidden="true">
          <span className="constellation-line constellation-line--12">
            <i />
          </span>

          <span className="constellation-line constellation-line--23">
            <i />
          </span>

          <span className="constellation-line constellation-line--31">
            <i />
          </span>
        </div>

        {/* Projects */}
        <div className="project-constellation__projects">
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={project.url}
              className={`constellation-project constellation-project--${index + 1}`}
            >
              <span className="constellation-project__node">
                <span className="constellation-project__core" />
              </span>

              <span className="constellation-project__info">
                <span className="constellation-project__id">
                  {project.id}
                </span>

                <span className="constellation-project__title">
                  {project.title}
                </span>

                <span className="constellation-project__meta">
                  {project.type}
                </span>

                <span className="constellation-project__meta">
                  {project.stack}
                </span>

                <span className="constellation-project__year">
                  {project.year}
                </span>

                <span className="constellation-project__view">
                  VIEW ↗
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="project-constellation__coordinates" aria-hidden="true">
          <span>FIELD / 02</span>
          <span>03 SIGNALS DETECTED</span>
        </div>
      </div>

      <div className="project-constellation__footer">
        <span>SELECT A PROJECT</span>
        <span>FOLLOW THE SIGNAL</span>
        <span>SCROLL / EXPLORE</span>
      </div>
    </section>
  )
}

export default SelectedWork