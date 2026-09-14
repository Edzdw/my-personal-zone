import { useEffect, useRef, useState } from 'react'
import './WhatIDo.css'
import { journey } from '../../../data/journey'

const ITEM_STEP = 18
const SCROLL_SENSITIVITY = 0.1
const CORE_TRIGGER_TOLERANCE = 34

function WhatIDo() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const coreRef = useRef<HTMLDivElement | null>(null)

  const activeIndexRef = useRef(0)
  const journeyScrollRef = useRef(0)
  const isLockedRef = useRef(false)

  const [activeIndex, setActiveIndex] = useState(0)
  const [journeyOffset, setJourneyOffset] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

  const getCoreCenterDelta = () => {
    const core = coreRef.current
    const section = sectionRef.current

    if (!core || !section) {
      return Number.POSITIVE_INFINITY
    }

    const coreRect = core.getBoundingClientRect()
    const coreCenter =
      coreRect.top + coreRect.height / 2

    const viewportCenter =
      window.innerHeight / 2

    return Math.abs(coreCenter - viewportCenter)
  }

  const updateCoreActivation = () => {
    const section = sectionRef.current
    const core = coreRef.current

    if (!section || !core) {
      return
    }

    const sectionRect = section.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const inViewport =
      sectionRect.top <= viewportHeight &&
      sectionRect.bottom >= 0

    const coreCenterDelta = getCoreCenterDelta()
    const shouldActivate =
      inViewport &&
      coreCenterDelta <= CORE_TRIGGER_TOLERANCE

    if (shouldActivate) {
      isLockedRef.current = true
      setIsActive(true)
      return
    }

    if (!isLockedRef.current) {
      setIsActive(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      updateCoreActivation()
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true
    })

    window.addEventListener('resize', handleScroll)

    updateCoreActivation()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current
      if (!section) {
        return
      }

      const sectionRect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const inViewport =
        sectionRect.top <= viewportHeight &&
        sectionRect.bottom >= 0

      if (!inViewport && !isLockedRef.current) {
        return
      }

      if (isLockedRef.current) {
        const direction = event.deltaY > 0 ? 1 : -1

        const atStart =
          activeIndexRef.current === 0 &&
          journeyScrollRef.current <= 0

        const atEnd =
          activeIndexRef.current === journey.length - 1 &&
          journeyScrollRef.current >=
          (journey.length - 1) * ITEM_STEP

        if (
          (direction < 0 && atStart) ||
          (direction > 0 && atEnd)
        ) {
          isLockedRef.current = false
          setIsActive(false)
          return
        }

        event.preventDefault()

        const normalizedDelta =
          event.deltaY * SCROLL_SENSITIVITY

        journeyScrollRef.current = clamp(
          journeyScrollRef.current + normalizedDelta,
          0,
          (journey.length - 1) * ITEM_STEP
        )

        const nextIndex = clamp(
          Math.round(
            journeyScrollRef.current / ITEM_STEP
          ),
          0,
          journey.length - 1
        )

        setJourneyOffset(journeyScrollRef.current)

        if (nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex
          setActiveIndex(nextIndex)
        }

        return
      }

      if (getCoreCenterDelta() <= CORE_TRIGGER_TOLERANCE) {
        isLockedRef.current = true
        setIsActive(true)
      }
    }

    window.addEventListener('wheel', handleWheel, {
      passive: false,
      capture: true
    })

    return () => {
      window.removeEventListener('wheel', handleWheel, {
        capture: true
      })
    }
  }, [])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    if (isActive) {
      journeyScrollRef.current =
        activeIndexRef.current * ITEM_STEP

      setJourneyOffset(journeyScrollRef.current)
    }
  }, [isActive])

  const getItemClassName = (index: number) => {
    const distance = Math.abs(index - activeIndex)

    return [
      'journey__item',
      index === activeIndex
        ? 'journey__item--active'
        : '',
      distance > 2
        ? 'journey__item--far'
        : ''
    ]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <section
      ref={sectionRef}
      className={[
        'what-i-do',
        isActive ? 'what-i-do--active' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ========================================= */}
      {/* CORE */}
      {/* ========================================= */}

      <div className="what-i-do__core-side">
        <div className="what-i-do__core-wrap">
          <div
            ref={coreRef}
            className="what-i-do__core"
          >
            <span
              className="
                what-i-do__core-ring
                what-i-do__core-ring--outer
              "
            />

            <span
              className="
                what-i-do__core-ring
                what-i-do__core-ring--inner
              "
            />

            <span className="what-i-do__core-caption">
              CORE
            </span>

            <div className="what-i-do__core-current">
              <span
                key={`year-${activeIndex}`}
                className="what-i-do__core-year"
              >
                {journey[activeIndex].year}
              </span>

              <span
                key={`status-${activeIndex}`}
                className="what-i-do__core-status"
              >
                {journey[activeIndex].title}
              </span>
            </div>
          </div>
        </div>

        <div className="what-i-do__core-meta">
          <span>
            02 — JOURNEY
          </span>

          <span>
            {String(activeIndex + 1).padStart(2, '0')}
            {' / '}
            {String(journey.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ========================================= */}
      {/* JOURNEY */}
      {/* ========================================= */}

      <div className="what-i-do__journey">
        <div className="journey__header">
          <span>
            JOURNEY
          </span>

          <span>
            {String(activeIndex + 1).padStart(2, '0')}
            {' / '}
            {String(journey.length).padStart(2, '0')}
          </span>
        </div>

        <div className="journey__viewport">
          <div className="journey__axis" />

          <div
            className="journey__track"
            style={{
              transform: `
                translateY(
                  -${journeyOffset}vh
                )
              `
            }}
          >
            {journey.map((item, index) => (
              <div
                key={item.year}
                className={getItemClassName(index)}
              >
                <span className="journey__node">
                  <span />
                </span>

                <div className="journey__item-content">
                  <span className="journey__year">
                    {item.year}
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===================================== */}
          {/* PROGRESS */}
          {/* ===================================== */}

          <div className="journey__progress">
            <span>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>

            <div className="journey__progress-line">
              <span
                style={{
                  transform: `
                    scaleY(
                      ${journey.length <= 1
                      ? 1
                      :
                      journeyOffset /
                      ((journey.length - 1) * ITEM_STEP)
                    }
                    )
                  `
                }}
              />
            </div>

            <span>
              {String(journey.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatIDo