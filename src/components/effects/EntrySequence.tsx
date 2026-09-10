import { useEffect, useRef, useState } from 'react'
import './EntrySequence.css'


type EntrySequenceProps = {
  onComplete: () => void
}



type EntryPhase =
  | 'intro'
  | 'dissolve'
  | 'ready'
  | 'countdown'
  | 'launching'

type TextParticle = {
  originX: number
  originY: number

  targetX: number
  targetY: number

  x: number
  y: number

  size: number
  alpha: number
  delay: number

  angle: number
  distance: number
}

type SpaceStar = {
  x: number
  y: number
  z: number

  previousX: number
  previousY: number

  size: number
  alpha: number
  hueShift: number

  twinkle: number
  twinkleSpeed: number
}

function EntrySequence({
  onComplete,
}: EntrySequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animationRef =
    useRef<number | null>(null)

  const phaseRef =
    useRef<EntryPhase>('intro')

  const phaseStartedAtRef =
    useRef(performance.now())

  const [phase, setPhase] =
    useState<EntryPhase>('intro')

  const entryMessage = 'building things I want to exist.'
  const [typedMessage, setTypedMessage] =
    useState('')

  const changePhase = (
    nextPhase: EntryPhase
  ) => {
    phaseRef.current = nextPhase
    phaseStartedAtRef.current =
      performance.now()

    setPhase(nextPhase)
  }

  /*
   * ---------------------------------------------
   * INTRO MESSAGE TYPING
   * ---------------------------------------------
   */

  useEffect(() => {
    let index = 0
    let typingTimer: number | undefined
    let startTimer: number | undefined

    setTypedMessage('')

    startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        index += 1
        setTypedMessage(entryMessage.slice(0, index))

        if (index >= entryMessage.length && typingTimer) {
          window.clearInterval(typingTimer)
          typingTimer = undefined
        }
      }, 42)
    }, 280)

    return () => {
      if (startTimer) {
        window.clearTimeout(startTimer)
      }

      if (typingTimer) {
        window.clearInterval(typingTimer)
      }
    }
  }, [])

  /*
   * ---------------------------------------------
   * INTRO → DISSOLVE
   * ---------------------------------------------
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      changePhase('dissolve')
    }, 2200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  //coundown phase


  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (phase !== 'countdown') return

    setCountdown(3)

    const timers = [
      window.setTimeout(() => setCountdown(2), 1000),
      window.setTimeout(() => setCountdown(1), 2000),
      window.setTimeout(() => changePhase('launching'), 3000),
    ]

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer)
      })
    }
  }, [phase])
  /*
   * ---------------------------------------------
   * DISSOLVE → READY
   * ---------------------------------------------
   */

  useEffect(() => {
    if (phase !== 'dissolve') return

    const timer = window.setTimeout(() => {
      changePhase('ready')
    }, 2400)

    return () => {
      window.clearTimeout(timer)
    }
  }, [phase])

  /*
   * ---------------------------------------------
   * LAUNCH → WEBSITE
   * ---------------------------------------------
   */

  useEffect(() => {
    if (phase !== 'launching') return

    const timer = window.setTimeout(() => {
      onComplete()
    }, 3250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [phase, onComplete])

  /*
   * ---------------------------------------------
   * ENTER KEY
   * ---------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === 'Enter' &&
        phaseRef.current === 'ready'
      ) {
        changePhase('countdown')
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [])

  /*
   * ---------------------------------------------
   * PARTICLE ENGINE
   * ---------------------------------------------
   */

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    let width = 0
    let height = 0

    let centerX = 0
    let centerY = 0

    const textParticles: TextParticle[] = []
    const spaceStars: SpaceStar[] = []

    /*
     * -------------------------------------------
     * RANDOM HELPERS
     * -------------------------------------------
     */

    const random = (
      min: number,
      max: number
    ) => {
      return (
        Math.random() *
        (max - min) +
        min
      )
    }

    /*
     * -------------------------------------------
     * CREATE SPACE STARS
     * -------------------------------------------
     */

    const createStars = () => {
      spaceStars.length = 0

      const amount =
        width < 768
          ? 240
          : 420

      for (
        let i = 0;
        i < amount;
        i += 1
      ) {
        const nearField = Math.random() < 0.2
        const depth = nearField
          ? random(260, 900)
          : random(1200, 2600)

        spaceStars.push({
          x: random(-1.45, 1.45),
          y: random(-1.45, 1.45),
          z: depth,

          previousX: centerX,
          previousY: centerY,

          size: nearField
            ? random(0.7, 2.0)
            : random(0.35, 1.3),

          alpha: nearField
            ? random(0.35, 0.95)
            : random(0.16, 0.72),

          hueShift: random(0, 1),

          twinkle: random(0, Math.PI * 2),
          twinkleSpeed: random(0.45, 1.8),
        })
      }
    }

    /*
     * -------------------------------------------
     * CREATE TEXT PARTICLES
     * -------------------------------------------
     */

    const createTextParticles = () => {
      textParticles.length = 0

      const textCanvas =
        document.createElement(
          'canvas'
        )

      const textContext =
        textCanvas.getContext(
          '2d'
        )

      if (!textContext) return

      textCanvas.width = width
      textCanvas.height = height

      const fontSize = Math.min(
        Math.max(width * 0.065, 36),
        88
      )

      textContext.font =
        `600 ${fontSize}px "Space Grotesk", sans-serif`

      textContext.textAlign =
        'center'

      textContext.textBaseline =
        'middle'

      textContext.fillStyle =
        '#ffffff'

      textContext.fillText(
        'HELLO, WORLD.',
        centerX,
        centerY
      )

      const imageData =
        textContext.getImageData(
          0,
          0,
          width,
          height
        )

      /*
       * Bigger step = fewer particles.
       * Mobile gets slightly denser particles.
       */

      const step =
        width < 768
          ? 5
          : 6

      for (
        let y = 0;
        y < height;
        y += step
      ) {
        for (
          let x = 0;
          x < width;
          x += step
        ) {
          const index =
            (y * width + x) * 4

          const alpha =
            imageData.data[
            index + 3
            ]

          if (alpha <= 80) {
            continue
          }

          const dx =
            x - centerX

          const dy =
            y - centerY

          const angle =
            Math.atan2(
              dy,
              dx
            )

          /*
           * The farther from the center,
           * the stronger the dissolve motion.
           */

          const distance =
            random(140, 420) +
            Math.sqrt(
              dx * dx +
              dy * dy
            ) *
            0.35

          textParticles.push({
            originX: x,
            originY: y,

            targetX:
              centerX +
              Math.cos(angle) *
              distance,

            targetY:
              centerY +
              Math.sin(angle) *
              distance,

            x,
            y,

            size:
              Math.random() >
                0.84
                ? 1.8
                : 1,

            alpha:
              alpha / 255,

            delay:
              Math.random() *
              0.55,

            angle,

            distance,
          })
        }
      }
    }

    /*
     * -------------------------------------------
     * RESIZE
     * -------------------------------------------
     */

    const setup = () => {
      const pixelRatio =
        Math.min(
          window.devicePixelRatio ||
          1,
          2
        )

      width =
        window.innerWidth

      height =
        window.innerHeight

      centerX =
        width / 2

      centerY =
        height / 2

      canvas.width =
        width * pixelRatio

      canvas.height =
        height * pixelRatio

      canvas.style.width =
        `${width}px`

      canvas.style.height =
        `${height}px`

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      )

      createTextParticles()
      createStars()
    }

    setup()

    const handleResize = () => {
      setup()
    }

    window.addEventListener(
      'resize',
      handleResize
    )

    /*
     * -------------------------------------------
     * SPACE STAR RENDER
     * -------------------------------------------
     */

    const easeOutCubic = (value: number) =>
      1 - Math.pow(1 - Math.min(1, Math.max(0, value)), 3)

    const renderSpaceStars = (
      now: number,
      launchProgress: number
    ) => {
      const launchEase = easeOutCubic(launchProgress)
      const speed = 0.8 + Math.pow(launchProgress, 2.15) * 175

      spaceStars.forEach((star) => {
        const previousZ = star.z
        const currentPerspective = 900 / star.z

        const x =
          centerX +
          star.x * width * currentPerspective

        const y =
          centerY +
          star.y * height * currentPerspective

        if (phaseRef.current === 'launching') {
          star.z -= speed

          if (star.z <= 1) {
            star.x = random(-1.8, 1.8)
            star.y = random(-1.8, 1.8)
            star.z = random(1500, 2800)
            return
          }
        }

        const perspective = 900 / star.z
        const projectedX =
          centerX + star.x * width * perspective
        const projectedY =
          centerY + star.y * height * perspective

        const twinkle =
          0.78 +
          Math.sin(
            now * 0.001 * star.twinkleSpeed +
              star.twinkle
          ) *
            0.22

        const depthFactor = Math.min(1.45, 2800 / Math.max(star.z, 280))
        const size = Math.max(0.3, star.size * (0.72 + depthFactor * 0.38))
        const alpha = Math.min(1, star.alpha * twinkle * (0.72 + depthFactor * 0.18))

        if (
          phaseRef.current === 'launching' &&
          launchProgress > 0.015
        ) {
          const streakPerspective =
            900 / (star.z + speed * 28)

          const streakX =
            centerX + star.x * width * streakPerspective
          const streakY =
            centerY + star.y * height * streakPerspective

          const streakStrength =
            Math.min(1, Math.pow(launchProgress, 0.56) * 1.45)

          context.beginPath()
          context.moveTo(streakX, streakY)
          context.lineTo(projectedX, projectedY)
          context.strokeStyle =
            `rgba(255,255,255,${alpha * streakStrength * 0.8})`
          context.lineWidth = Math.min(4.5, size * (1 + launchEase * 10))
          context.stroke()
        }

        // Tiny near-camera flare: it helps sell depth without turning the scene into a sci-fi HUD.
        if (
          phaseRef.current === 'launching' &&
          previousZ < 620
        ) {
          const flare = Math.min(1, (620 - previousZ) / 460)
          context.beginPath()
          context.arc(projectedX, projectedY, size * (1.7 + flare * 1.6), 0, Math.PI * 2)
          context.fillStyle = `rgba(255,255,255,${alpha * flare * 0.16})`
          context.fill()
        }

        context.beginPath()
        context.arc(projectedX, projectedY, size, 0, Math.PI * 2)
        context.fillStyle = `rgba(255,255,255,${alpha})`
        context.fill()

        star.previousX = projectedX
        star.previousY = projectedY
      })
    }

    /*
     * -------------------------------------------
     * TEXT PARTICLE RENDER
     * -------------------------------------------
     */

    const renderTextParticles = (
      elapsed: number
    ) => {
      const dissolveDuration =
        2200

      const normalized =
        Math.min(
          1,
          elapsed /
          dissolveDuration
        )

      textParticles.forEach(
        (particle) => {
          /*
           * Individual particles
           * start dissolving at slightly
           * different moments.
           */

          const localProgress =
            Math.max(
              0,
              Math.min(
                1,
                (normalized -
                  particle.delay *
                  0.65) /
                0.72
              )
            )

          const eased =
            1 -
            Math.pow(
              1 -
              localProgress,
              3
            )

          particle.x =
            particle.originX +
            (particle.targetX -
              particle.originX) *
            eased

          particle.y =
            particle.originY +
            (particle.targetY -
              particle.originY) *
            eased

          /*
           * Slight secondary drift.
           */

          const drift =
            Math.sin(
              localProgress *
              Math.PI
            ) *
            10

          particle.x +=
            Math.cos(
              particle.angle +
              Math.PI / 2
            ) *
            drift

          particle.y +=
            Math.sin(
              particle.angle +
              Math.PI / 2
            ) *
            drift

          /*
           * Fade gradually,
           * but don't disappear immediately.
           */

          const alpha =
            particle.alpha *
            (1 -
              eased * 0.9)

          if (alpha <= 0.01) {
            return
          }

          context.beginPath()

          context.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
          )

          context.fillStyle =
            `rgba(255,255,255,${alpha})`

          context.fill()
        })
    }

    /*
     * -------------------------------------------
     * MAIN LOOP
     * -------------------------------------------
     */

    const render = (
      now: number
    ) => {
      context.clearRect(
        0,
        0,
        width,
        height
      )

      const currentPhase =
        phaseRef.current

      const phaseElapsed =
        now -
        phaseStartedAtRef.current

      /*
       * -----------------------------------------
       * INTRO
       * -----------------------------------------
       */

      if (
        currentPhase ===
        'intro'
      ) {
        /*
         * Text particles.
         */

        textParticles.forEach(
          (particle) => {
            context.beginPath()

            context.arc(
              particle.originX,
              particle.originY,
              particle.size,
              0,
              Math.PI * 2
            )

            context.fillStyle =
              `rgba(255,255,255,${particle.alpha})`

            context.fill()
          }
        )

        /*
         * Very faint distant stars.
         */

        renderSpaceStars(
          now,
          0
        )
      }

      /*
       * -----------------------------------------
       * DISSOLVE
       * -----------------------------------------
       */

      if (
        currentPhase ===
        'dissolve'
      ) {
        renderSpaceStars(
          now,
          0
        )

        renderTextParticles(
          phaseElapsed
        )
      }

      /*
       * -----------------------------------------
       * READY
       * -----------------------------------------
       */

      if (
        currentPhase ===
        'ready'
      ) {
        /*
         * Space is now visible.
         */

        renderSpaceStars(
          now,
          0
        )
      }

      /*
       * -----------------------------------------
       * LAUNCH
       * -----------------------------------------
       */

      if (
        currentPhase ===
        'launching'
      ) {
        const launchDuration =
          3250

        const launchProgress =
          Math.min(
            1,
            phaseElapsed /
            launchDuration
          )

        /*
         * Keep a very faint
         * background field while jumping.
         */

        renderSpaceStars(
          now,
          launchProgress
        )
      }

      animationRef.current =
        requestAnimationFrame(
          render
        )
    }

    render(performance.now())

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      )

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        )
      }
    }
  }, [])

  /*
   * ---------------------------------------------
   * START
   * ---------------------------------------------
   */

  const handleStart = () => {
    if (phaseRef.current !== 'ready') {
      return
    }

    changePhase('countdown')
  }

  return (
    <section
      className={`entry-sequence entry-sequence--${phase}`}
      aria-label="Portfolio introduction"
    >
      <div
        className="entry-sequence__stars"
        aria-hidden="true"
      />

      <div
        className="entry-sequence__grid"
        aria-hidden="true"
      />

      {/* REAL PARTICLE CANVAS */}

      <canvas
        ref={canvasRef}
        className="entry-sequence__canvas"
        aria-hidden="true"
      />

      <div
        className="entry-sequence__message"
        aria-hidden="true"
      >
        <span>{typedMessage}</span>
        <span className="entry-sequence__message-cursor" />
      </div>

      {/* ORBIT SYSTEM */}

      <div
        className="entry-sequence__system"
        aria-hidden="true"
      >
        <div className="entry-sequence__core">
          <span />
        </div>

        <span className="entry-sequence__orbit orbit--1" />
        <span className="entry-sequence__orbit orbit--2" />
        <span className="entry-sequence__orbit orbit--3" />
      </div>

      {/* START */}

      <div className="entry-sequence__hint">
        {phase === 'countdown'
          ? 'INITIALIZING'
          : 'PRESS ENTER TO START'}
      </div>

      <div
        className="entry-sequence__countdown"
        aria-hidden="true"
      >
        {phase === 'countdown' && (
          <span key={countdown}>{countdown}</span>
        )}
      </div>

      <div className="entry-sequence__control">
        <button
          type="button"
          className="entry-sequence__start"
          onClick={handleStart}
          disabled={
            phase !== 'ready'
          }
        >
          <span className="entry-sequence__start-ring" />

          <span className="entry-sequence__start-content">
            <span className="entry-sequence__start-label">
              START
            </span>

            <span className="entry-sequence__start-arrow">
              ↓
            </span>
          </span>
        </button>
      </div>

      {/* CINEMATIC FLASH */}

      <div
        className="entry-sequence__flash"
        aria-hidden="true"
      />

      {/* CORNERS */}

      <div className="entry-sequence__corner entry-sequence__corner--top">
        <span>TÂM / 001</span>
        <span>2026</span>
      </div>

      <div className="entry-sequence__corner entry-sequence__corner--bottom">
        <span>
          PERSONAL DIGITAL SPACE
        </span>

        <span>
          {phase ===
            'launching'
            ? 'ENTERING'
            : 'WELCOME'}
        </span>
      </div>
    </section>
  )
}

export default EntrySequence