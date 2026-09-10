import { useEffect, useState } from 'react'

function Hero() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRevealed(true)
    }, 180)

    return () => window.clearTimeout(timer)
  }, [])

  const handleExplore = () => {
    document
      .querySelector('.what-i-do')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  return (
    <section className={`hero ${revealed ? 'hero--revealed' : ''}`}>
      <div className="hero__content">
        <div className="hero__content-inner">
          <h1 className="hero__index">
            01 — SOME THINGS ABOUT ME
          </h1>

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
      </div>

      <div className="hero__footer">
        <span>↓ SCROLL TO EXPLORE</span>
        <span>2026</span>
      </div>
    </section>
  )
}

export default Hero