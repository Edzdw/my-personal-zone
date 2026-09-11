import { useEffect, useRef, useState } from 'react'
import './WhatIDo.css'

const buildText = 'I BUILD SOFTWARE.'

function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null)

  const [displayedText, setDisplayedText] = useState('')
  const [status, setStatus] = useState('INITIALIZING...')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    let typingInterval: number | null = null
    let completeTimeout: number | null = null
    let hasStarted = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) {
          return
        }

        hasStarted = true

        setStatus('BUILDING SYSTEM...')

        let currentIndex = 0

        typingInterval = window.setInterval(() => {
          currentIndex += 1

          setDisplayedText(
            buildText.slice(
              0,
              currentIndex
            )
          )

          if (
            currentIndex >=
            buildText.length
          ) {
            if (typingInterval) {
              clearInterval(
                typingInterval
              )
            }

            completeTimeout =
              window.setTimeout(() => {
                setStatus(
                  'BUILD COMPLETE'
                )

                setIsComplete(true)
              }, 800)
          }
        }, 130)

        observer.disconnect()
      },
      {
        threshold: 0.35,
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()

      if (typingInterval) {
        clearInterval(
          typingInterval
        )
      }

      if (completeTimeout) {
        clearTimeout(
          completeTimeout
        )
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="what-i-do"
    >
      <div className="what-i-do__header">
        <span className="section-index">
          01
        </span>

        <span className="section-title">
          WHAT I DO
        </span>
      </div>

      <div className="what-i-do__content">

        <div className="what-i-do__statement">

          <div className="what-i-do__terminal">

            <div className="what-i-do__terminal-header">
              <span className="terminal-dot" />

              <span>
                &gt; {status}
              </span>
            </div>

            <p
              className={
                isComplete
                  ? 'build-text build-text--complete'
                  : 'build-text'
              }
            >
              {displayedText}

              {!isComplete && (
                <span className="build-cursor">
                  _
                </span>
              )}
            </p>

            <div className="what-i-do__terminal-footer">
              <span>
                PROCESS: CREATIVE_SYSTEM
              </span>

              <span>
                STATUS:{' '}
                {isComplete
                  ? 'ONLINE'
                  : 'RUNNING'}
              </span>
            </div>

          </div>

        </div>

        <div className="what-i-do__thought">
          <p>
            AND SOMETIMES
            <br />
            I BUILD THINGS
            <br />
            JUST TO SEE
            <br />
            IF I CAN.
          </p>
        </div>

      </div>

      <div className="what-i-do__footer">
        <div>
          <span>CODE</span>
          <span>SYSTEMS</span>
        </div>

        <div>
          <span>MARKETS</span>
          <span>IDEAS</span>
        </div>

        <div>
          <span>STORIES</span>
          <span>RANDOM PROJECTS</span>
        </div>
      </div>
    </section>
  )
}

export default WhatIDo