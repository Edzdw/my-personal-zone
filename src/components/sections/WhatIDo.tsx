import { useEffect, useState } from 'react'

const buildText = 'I BUILD SOFTWARE.'

function WhatIDo() {
  const [displayedText, setDisplayedText] = useState('')
  const [status, setStatus] = useState('INITIALIZING...')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
  let currentIndex = 0

  const startDelay = setTimeout(() => {
    setStatus('BUILDING SYSTEM...')

    const typingInterval = setInterval(() => {
      currentIndex += 1

      setDisplayedText(
        buildText.slice(0, currentIndex)
      )

      if (currentIndex >= buildText.length) {
        clearInterval(typingInterval)

        setTimeout(() => {
          setStatus('BUILD COMPLETE')
          setIsComplete(true)
        }, 800)
      }
    }, 130)

    return () => clearInterval(typingInterval)
  }, 1200)

  return () => clearTimeout(startDelay)
}, [])

  return (
    <section className="what-i-do">
      <div className="what-i-do__header">
        <span className="section-index">01</span>
        <span className="section-title">WHAT I DO</span>
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
              <span>PROCESS: CREATIVE_SYSTEM</span>
              <span>STATUS: {isComplete ? 'ONLINE' : 'RUNNING'}</span>
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