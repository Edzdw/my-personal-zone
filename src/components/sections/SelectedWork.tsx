import { projects } from '../../data/projects'

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

      <div className="project-list">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.url}
            className="project-item"
          >
            <div className="project-item__top">
              <span className="project-item__id">
                {project.id}
              </span>

              <span className="project-item__view">
                VIEW
                <span>↗</span>
              </span>
            </div>

            <div className="project-item__main">
              <h2>{project.title}</h2>

              <p>{project.description}</p>
            </div>

            <div className="project-item__meta">
              <span>{project.type}</span>
              <span>{project.stack}</span>
              <span>{project.year}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default SelectedWork