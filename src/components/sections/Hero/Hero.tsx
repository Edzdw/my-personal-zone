import './Hero.css'

interface HeroProps {
  reveal?: boolean
}

function Hero({ reveal = false }: HeroProps) {
  const handleExplore = () => {
    document
      .querySelector('.what-i-do')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  return (
    <section
      className={`hero ${
        reveal ? 'hero--revealed' : 'hero--static'
      }`}
    >
      <div className="hero__content">
        <div className="hero__index">
          01 — SOME THINGS ABOUT ME
        </div>

        <div className="hero__statement">
          <span>I BUILD</span>
          <span>THINGS</span>
          <span>THAT MOVE.</span>
        </div>

        <div className="hero__intro">
          <p>
            I'm Tâm, a software engineer who loves building meaningful
            automation and digital products that help people do better.
          </p>

          <p>
            More than just code, I love exploring design, storytelling,
            and creative writing. I believe the best software is built
            through a combination of technical skill and creative vision.
          </p>
        </div>

        <button
          className="hero__explore"
          type="button"
          onClick={handleExplore}
        >
          <span className="hero__explore-orbit orbit-1" />
          <span className="hero__explore-orbit orbit-2" />

          <span className="hero__explore-text">
            EXPLORE
          </span>

          <span className="hero__explore-arrow">
            ↓
          </span>
        </button>
      </div>

      <div className="hero__footer">
        <span>↓ SCROLL TO EXPLORE</span>
        <span>2026</span>
      </div>
    </section>
  )
}

export default Hero