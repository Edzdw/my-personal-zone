import { useEffect, useRef, useState } from 'react'
import './EntrySequence.css'

type EntrySequenceProps = {
  onComplete: () => void
}

type EntryPhase =
  | 'intro'
  | 'dissolve'
  | 'ready'
  | 'ignition'
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
  behavior: 'core' | 'burst'
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

/*
 * ---------------------------------------------
 * TIMING
 * ---------------------------------------------
 */

const INTRO_TO_READY_MS = 2200
const DISSOLVE_DURATION_MS = 2400

/*
 * The system charges for a short moment
 * before the actual acceleration begins.
 */
const IGNITION_DURATION_MS = 1100

/*
 * Entire acceleration / hyperspace sequence.
 */
const LAUNCH_DURATION_MS = 3600

function EntrySequence({
  onComplete,
}: EntrySequenceProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null)

  const animationRef =
    useRef<number | null>(null)

  const flashRef =
    useRef<HTMLDivElement | null>(null)

  const phaseRef =
    useRef<EntryPhase>('intro')

  const phaseStartedAtRef =
    useRef(performance.now())

  const launchStartedAtRef =
    useRef<number | null>(null)

  const lastFrameTimeRef =
    useRef<number | null>(null)

  const launchMotionRef =
    useRef({
      velocity: 0,
      energy: 0,
      flashTriggered: false,
    })

  const [phase, setPhase] =
    useState<EntryPhase>('intro')

  const entryMessage =
    'welcome to my personal digital space.'

  const [typedMessage, setTypedMessage] =
    useState('')

  /*
   * ---------------------------------------------
   * REDUCED MOTION
   * ---------------------------------------------
   */

  const prefersReducedMotionRef =
    useRef(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    prefersReducedMotionRef.current =
      query.matches

    const handleChange = (
      event: MediaQueryListEvent
    ) => {
      prefersReducedMotionRef.current =
        event.matches
    }

    query.addEventListener(
      'change',
      handleChange
    )

    return () => {
      query.removeEventListener(
        'change',
        handleChange
      )
    }
  }, [])

  /*
   * ---------------------------------------------
   * TOUCH / KEYBOARD DETECTION
   * ---------------------------------------------
   */

  const [hasKeyboard, setHasKeyboard] =
    useState(true)

  useEffect(() => {
    const query =
      window.matchMedia('(pointer: coarse)')

    setHasKeyboard(!query.matches)

    const handleChange = (
      event: MediaQueryListEvent
    ) => {
      setHasKeyboard(!event.matches)
    }

    query.addEventListener(
      'change',
      handleChange
    )

    return () => {
      query.removeEventListener(
        'change',
        handleChange
      )
    }
  }, [])

  /*
   * ---------------------------------------------
   * PHASE CONTROL
   * ---------------------------------------------
   */

  const changePhase = (
    nextPhase: EntryPhase
  ) => {
    phaseRef.current = nextPhase

    const now = performance.now()

    phaseStartedAtRef.current = now

    if (
      nextPhase === 'launching' &&
      launchStartedAtRef.current === null
    ) {
      launchStartedAtRef.current = now
    }

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

    if (
      prefersReducedMotionRef.current
    ) {
      setTypedMessage(entryMessage)
      return
    }

    startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        index += 1

        setTypedMessage(
          entryMessage.slice(
            0,
            index
          )
        )

        if (
          index >=
            entryMessage.length &&
          typingTimer
        ) {
          window.clearInterval(
            typingTimer
          )

          typingTimer = undefined
        }
      }, 42)
    }, 280)

    return () => {
      if (startTimer) {
        window.clearTimeout(
          startTimer
        )
      }

      if (typingTimer) {
        window.clearInterval(
          typingTimer
        )
      }
    }
  }, [])

  /*
   * ---------------------------------------------
   * INTRO → READY
   * ---------------------------------------------
   */

  useEffect(() => {
    const duration =
      prefersReducedMotionRef.current
        ? 0
        : INTRO_TO_READY_MS

    const timer =
      window.setTimeout(() => {
        changePhase('ready')
      }, duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  /*
   * ---------------------------------------------
   * DISSOLVE → IGNITION
   * ---------------------------------------------
   *
   * The text disperses first.
   * The orbital system remains as the thing
   * that powers up next.
   */

  useEffect(() => {
    if (phase !== 'dissolve') {
      return
    }

    const duration =
      prefersReducedMotionRef.current
        ? 0
        : DISSOLVE_DURATION_MS

    const timer =
      window.setTimeout(() => {
        changePhase('ignition')
      }, duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [phase])

  /*
   * ---------------------------------------------
   * IGNITION → LAUNCHING
   * ---------------------------------------------
   *
   * No countdown.
   *
   * The system charges first.
   * Then the star field starts moving.
   */

  useEffect(() => {
    if (phase !== 'ignition') {
      return
    }

    const duration =
      prefersReducedMotionRef.current
        ? 0
        : IGNITION_DURATION_MS

    const timer =
      window.setTimeout(() => {
        changePhase('launching')
      }, duration)

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
    if (phase !== 'launching') {
      return
    }

    const duration =
      prefersReducedMotionRef.current
        ? 0
        : LAUNCH_DURATION_MS

    const timer =
      window.setTimeout(() => {
        onComplete()
      }, duration)

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
        changePhase('dissolve')
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
    const canvas =
      canvasRef.current

    if (!canvas) {
      return
    }

    const context =
      canvas.getContext('2d')

    if (!context) {
      return
    }

    let width = 0
    let height = 0

    let centerX = 0
    let centerY = 0

    const textParticles:
      TextParticle[] = []

    const spaceStars:
      SpaceStar[] = []

    /*
     * -------------------------------------------
     * RANDOM
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
        const nearField =
          Math.random() < 0.2

        const depth =
          nearField
            ? random(260, 900)
            : random(1200, 2600)

        spaceStars.push({
          x: random(-1.45, 1.45),
          y: random(-1.45, 1.45),

          z: depth,

          previousX: centerX,
          previousY: centerY,

          size:
            nearField
              ? random(0.7, 2.0)
              : random(0.35, 1.3),

          alpha:
            nearField
              ? random(0.35, 0.95)
              : random(0.16, 0.72),

          hueShift: random(0, 1),

          twinkle:
            random(0, Math.PI * 2),

          twinkleSpeed:
            random(0.45, 1.8),
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
        textCanvas.getContext('2d')

      if (!textContext) {
        return
      }

      textCanvas.width = width
      textCanvas.height = height

      const fontSize =
        Math.min(
          Math.max(
            width * 0.065,
            36
          ),
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
              Math.random() > 0.84
                ? 1.8
                : 1,

            alpha:
              alpha / 255,

            delay:
              Math.random() *
              0.55,

            angle,
            distance,

            behavior:
              Math.random() < 0.28
                ? 'core'
                : 'burst',
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

    let cancelled = false

    const runInitialSetup =
      () => {
        if (cancelled) {
          return
        }

        setup()
      }

    if (
      document.fonts &&
      document.fonts.status !==
        'loaded'
    ) {
      document.fonts.ready.then(
        runInitialSetup
      )

      window.setTimeout(
        runInitialSetup,
        500
      )
    } else {
      runInitialSetup()
    }

    let resizeDebounce:
      number | undefined

    const handleResize = () => {
      if (resizeDebounce) {
        window.clearTimeout(
          resizeDebounce
        )
      }

      resizeDebounce =
        window.setTimeout(() => {
          const currentPhase =
            phaseRef.current

          if (
            currentPhase === 'intro' ||
            currentPhase === 'ready'
          ) {
            setup()
            return
          }

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
        }, 150)
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

    const easeOutCubic = (
      value: number
    ) => {
      return (
        1 -
        Math.pow(
          1 -
            Math.min(
              1,
              Math.max(
                0,
                value
              )
            ),
          3
        )
      )
    }

    const renderSpaceStars = (
      now: number,
      launchProgress: number,
      deltaSeconds: number,
      velocity: number
    ) => {
      const launchEase =
        easeOutCubic(
          launchProgress
        )

      const activeVelocity =
        Math.max(0, velocity)

      spaceStars.forEach(
        (star) => {
          const previousZ =
            star.z

          if (
            phaseRef.current ===
            'launching' ||
            phaseRef.current ===
              'ignition' ||
            phaseRef.current ===
              'dissolve'
          ) {
            const driftScale =
              phaseRef.current ===
              'launching'
                ? 1 +
                  launchProgress *
                    6.5
                : phaseRef.current ===
                    'ignition'
                  ? 0.2 +
                    launchProgress *
                      1.4
                  : 0.08 +
                    launchProgress *
                      0.55

            star.z -=
              activeVelocity *
              deltaSeconds *
              driftScale

            if (star.z <= 1) {
              star.x =
                random(
                  -1.8,
                  1.8
                )

              star.y =
                random(
                  -1.8,
                  1.8
                )

              star.z =
                random(
                  1500,
                  2800
                )

              return
            }
          }

          const perspective =
            900 / star.z

          const projectedX =
            centerX +
            star.x *
              width *
              perspective

          const projectedY =
            centerY +
            star.y *
              height *
              perspective

          const twinkle =
            0.78 +
            Math.sin(
              now *
                0.001 *
                star.twinkleSpeed +
                star.twinkle
            ) *
              0.22

          const depthFactor =
            Math.min(
              1.45,
              2800 /
                Math.max(
                  star.z,
                  280
                )
            )

          const size =
            Math.max(
              0.3,
              star.size *
                (0.72 +
                  depthFactor *
                    0.38)
            )

          const alpha =
            Math.min(
              1,
              star.alpha *
                twinkle *
                (0.72 +
                  depthFactor *
                    0.18) *
                (0.7 +
                  launchEase *
                    0.8)
            )

          const streakStrength =
            Math.min(
              1,
              Math.max(
                0,
                (launchProgress -
                  0.08) /
                  0.92
              )
            )

          if (
            phaseRef.current ===
              'launching' &&
            launchProgress >
              0.08
          ) {
            const streakPerspective =
              900 /
              (star.z +
                activeVelocity *
                  0.25 +
                24)

            const streakX =
              centerX +
              star.x *
                width *
                streakPerspective

            const streakY =
              centerY +
              star.y *
                height *
                streakPerspective

            context.beginPath()

            context.moveTo(
              streakX,
              streakY
            )

            context.lineTo(
              projectedX,
              projectedY
            )

            context.strokeStyle =
              `rgba(255,255,255,${
                alpha *
                streakStrength *
                0.82
              })`

            context.lineWidth =
              Math.min(
                5,
                size *
                  (1 +
                    launchEase *
                      11)
              )

            context.stroke()
          }

          if (
            phaseRef.current ===
              'launching' &&
            previousZ < 620
          ) {
            const flare =
              Math.min(
                1,
                (620 -
                  previousZ) /
                  460
              )

            context.beginPath()

            context.arc(
              projectedX,
              projectedY,
              size *
                (1.7 +
                  flare * 1.6),
              0,
              Math.PI * 2
            )

            context.fillStyle =
              `rgba(255,255,255,${
                alpha *
                flare *
                0.16
              })`

            context.fill()
          }

          context.beginPath()

          context.arc(
            projectedX,
            projectedY,
            size,
            0,
            Math.PI * 2
          )

          context.fillStyle =
            `rgba(255,255,255,${alpha})`

          context.fill()

          star.previousX =
            projectedX

          star.previousY =
            projectedY
        }
      )
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

          if (
            particle.behavior ===
            'core'
          ) {
            const pull =
              Math.min(
                1,
                eased * 1.08
              )

            particle.x =
              particle.originX +
              (centerX -
                particle.originX) *
                pull

            particle.y =
              particle.originY +
              (centerY -
                particle.originY) *
                pull
          } else {
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

            const drift =
              Math.sin(
                localProgress *
                  Math.PI
              ) * 10

            particle.x +=
              Math.cos(
                particle.angle +
                  Math.PI / 2
              ) * drift

            particle.y +=
              Math.sin(
                particle.angle +
                  Math.PI / 2
              ) * drift
          }

          const alpha =
            particle.alpha *
            (particle.behavior ===
            'core'
              ? Math.max(
                  0,
                  1 -
                    eased * 1.35
                )
              : 1 -
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
        }
      )
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

      const previousFrameTime =
        lastFrameTimeRef.current ??
        now

      const deltaSeconds =
        Math.min(
          0.05,
          Math.max(
            0.016,
            (now -
              previousFrameTime) /
              1000
          )
        )

      lastFrameTimeRef.current = now

      const clamp = (
        value: number
      ) =>
        Math.min(
          1,
          Math.max(0, value)
        )

      let launchProgress = 0
      let launchVelocityTarget = 0

      if (
        currentPhase ===
        'dissolve'
      ) {
        const dissolveProgress =
          clamp(
            phaseElapsed /
              DISSOLVE_DURATION_MS
          )

        launchProgress =
          dissolveProgress * 0.18

        launchVelocityTarget =
          30 +
          Math.pow(
            dissolveProgress,
            1.9
          ) *
            120
      }

      if (
        currentPhase ===
        'ignition'
      ) {
        const ignitionProgress =
          clamp(
            phaseElapsed /
              IGNITION_DURATION_MS
          )

        launchProgress =
          0.18 +
          ignitionProgress *
            0.22

        launchVelocityTarget =
          80 +
          Math.pow(
            ignitionProgress,
            1.7
          ) *
            420
      }

      if (
        currentPhase ===
        'launching'
      ) {
        const launchStartedAt =
          launchStartedAtRef.current ??
          now

        launchProgress =
          clamp(
            (now -
              launchStartedAt) /
              LAUNCH_DURATION_MS
          )

        const easedLaunch =
          easeOutCubic(
            launchProgress
          )

        launchVelocityTarget =
          120 +
          Math.pow(
            easedLaunch,
            1.5
          ) *
            1500 +
          Math.pow(
            launchProgress,
            9
          ) *
            5200
      }

      const motionBias =
        currentPhase ===
        'launching'
          ? 0.12
          : currentPhase ===
              'ignition'
            ? 0.18
            : currentPhase ===
                'dissolve'
              ? 0.08
              : 0.02

      launchMotionRef.current.velocity +=
        (launchVelocityTarget -
          launchMotionRef.current.velocity) *
          (0.06 + motionBias)

      launchMotionRef.current.energy =
        clamp(launchProgress)

      if (
        flashRef.current
      ) {
        if (
          currentPhase ===
          'launching'
        ) {
          const flashStrength =
            clamp(
              (launchProgress -
                0.82) /
                0.18
            )

          const flashOpacity =
            Math.sin(
              flashStrength *
                Math.PI
            )

          flashRef.current.style.opacity =
            String(
              flashOpacity
            )
        } else {
          flashRef.current.style.opacity =
            '0'
        }
      }

      if (
        currentPhase ===
        'launching' &&
        launchProgress > 0.82 &&
        !launchMotionRef.current.flashTriggered
      ) {
        launchMotionRef.current.flashTriggered =
          true
      }

      /*
       * -----------------------------------------
       * INTRO
       * -----------------------------------------
       */

      if (
        currentPhase ===
        'intro'
      ) {
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

        renderSpaceStars(
          now,
          0,
          deltaSeconds,
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
          launchProgress,
          deltaSeconds,
          launchMotionRef.current.velocity
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

        renderSpaceStars(
          now,
          0,
          deltaSeconds,
          0
        )
      }

      /*
       * -----------------------------------------
       * IGNITION
       * -----------------------------------------
       */

      if (
        currentPhase ===
        'ignition'
      ) {
        renderSpaceStars(
          now,
          launchProgress,
          deltaSeconds,
          launchMotionRef.current.velocity
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
        renderSpaceStars(
          now,
          launchProgress,
          deltaSeconds,
          launchMotionRef.current.velocity
        )
      }

      animationRef.current =
        requestAnimationFrame(
          render
        )
    }

    render(
      performance.now()
    )

    return () => {
      cancelled = true

      window.removeEventListener(
        'resize',
        handleResize
      )

      if (resizeDebounce) {
        window.clearTimeout(
          resizeDebounce
        )
      }

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
    if (
      phaseRef.current !==
      'ready'
    ) {
      return
    }

    changePhase('dissolve')
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

      <canvas
        ref={canvasRef}
        className="entry-sequence__canvas"
        aria-hidden="true"
      />

      <div
        className="entry-sequence__message"
        aria-hidden="true"
      >
        <span>
          {typedMessage}
        </span>

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

      {/* LAUNCH */}

      <div className="entry-sequence__hint">
        {phase === 'ignition'
          ? 'ENGINE IGNITION'
          : phase === 'launching'
            ? 'FULL THRUST'
            : hasKeyboard
              ? 'ENTER / CLICK TO LAUNCH'
              : 'TAP TO LAUNCH'}
      </div>

      <div className="entry-sequence__control">
        <button
          type="button"
          className="entry-sequence__start"
          onClick={handleStart}
          disabled={phase !== 'ready'}
          aria-label="Launch portfolio"
        >
          <span className="entry-sequence__start-fill" />

          <span className="entry-sequence__start-content">
            <span className="entry-sequence__start-loading">
              INITIALIZING
            </span>

            <span className="entry-sequence__start-ready">
              LAUNCH
            </span>

            <span className="entry-sequence__start-arrow">
              →
            </span>
          </span>

          <span className="entry-sequence__start-status">
            <span className="entry-sequence__status-loading">
              SYSTEM BOOT
            </span>

            <span className="entry-sequence__status-ready">
              CORE READY
            </span>
          </span>

          <span className="entry-sequence__start-loader" />
        </button>
      </div>

      {/* CINEMATIC FLASH */}

      <div
        ref={flashRef}
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
          {phase === 'launching'
            ? 'ENTERING'
            : 'WELCOME'}
        </span>
      </div>
    </section>
  )
}

export default EntrySequence