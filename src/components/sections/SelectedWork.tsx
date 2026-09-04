import { projects } from '../../data/projects'

function SelectedWork() {
  // Nhân đôi project để tạo cảm giác chạy vô hạn
  const carouselProjects = [...projects, ...projects]

  return (
    <section className="selected-work">
      <div className="selected-work__header">
        <span className="section-index">02</span>
        <span className="section-title">SELECTED WORK</span>

        <span className="selected-work__count">
          {projects.length.toString().padStart(2, '0')} PROJECTS
        </span>
      </div>

      <div className="project-carousel">
        <div className="project-track">
          {carouselProjects.map((project, index) => (
            <a
              key={`${project.id}-${index}`}
              href={project.url}
              className="project-card"
            >
              <div className="project-card__top">
                <span>
                  {project.id}
                </span>

                <span className="project-card__view">
                  VIEW <span>↗</span>
                </span>
              </div>

              <div className="project-card__content">
                <h2>{project.title}</h2>

                <p>{project.description}</p>
              </div>

              <div className="project-card__meta">
                <span>{project.type}</span>
                <span>{project.stack}</span>
                <span>{project.year}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SelectedWork