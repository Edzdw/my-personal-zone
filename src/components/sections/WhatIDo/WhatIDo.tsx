import { useEffect, useRef, useState } from 'react'
import './WhatIDo.css'
import { journey } from '../../../data/journey'

const SCROLL_PER_ITEM = 14

function WhatIDo() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const [journeyIndex, setJourneyIndex] = useState(0)
  const [coreGlow, setCoreGlow] = useState(0)

  const endingIndex = journey.length

  const clamp = (
    value: number,
    min: number,
    max: number
  ) => Math.min(Math.max(value, min), max)

  useEffect(() => {
    let ticking = false

    const updateScrollState = () => {
      const section = sectionRef.current

      if (!section) {
        ticking = false
        return
      }

      /*
       * Mobile:
       * Native document flow.
       * No sticky / scroll-driven animation.
       */
      if (window.innerWidth < 769) {
        setJourneyIndex(0)
        setCoreGlow(0)
        ticking = false
        return
      }

      const rect = section.getBoundingClientRect()

      /*
       * Total scroll distance available
       * while the sticky stage remains visible.
       */
      const scrollRange = Math.max(
        section.offsetHeight - window.innerHeight,
        1
      )

      /*
       * 0 → section starts
       * 1 → section ends
       */
      const progress = clamp(
        -rect.top / scrollRange,
        0,
        1
      )

      /*
       * Journey position.
       *
       * Continuous value:
       *
       * 0
       * 0.35
       * 1.2
       * 2.8
       * ...
       * 8
       */
      const rawIndex = progress * endingIndex

      setJourneyIndex(rawIndex)

      /*
       * ------------------------------------------------
       * CORE GLOW
       * ------------------------------------------------
       *
       * The Core does NOT control scrolling.
       *
       * We simply calculate how close the What I Do
       * section is to the center of the viewport.
       *
       * When the section enters:
       *   glow increases.
       *
       * When the section is around the viewport:
       *   glow reaches maximum.
       *
       * When leaving:
       *   glow fades.
       */

      const viewportCenter =
        window.innerHeight / 2

      const sectionCenter =
        rect.top + rect.height / 2

      const distance =
        Math.abs(
          sectionCenter - viewportCenter
        )

      /*
       * Glow radius.
       *
       * The Core remains subtly visible even when
       * the section isn't perfectly centered.
       */
      const glowRadius =
        window.innerHeight * 0.9

      const glow =
        clamp(
          1 - distance / glowRadius,
          0,
          1
        )

      /*
       * Slightly soften the response so the glow
       * doesn't snap aggressively.
       */
      const softenedGlow =
        glow * glow * (3 - 2 * glow)

      setCoreGlow(
        softenedGlow
      )

      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return

      ticking = true

      requestAnimationFrame(
        updateScrollState
      )
    }

    const handleResize = () => {
      updateScrollState()
    }

    updateScrollState()

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    )

    window.addEventListener(
      'resize',
      handleResize
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )

      window.removeEventListener(
        'resize',
        handleResize
      )
    }
  }, [endingIndex])

  const activeIndex = clamp(
    Math.round(journeyIndex),
    0,
    Math.max(
      journey.length - 1,
      0
    )
  )

  /*
   * We only reach the ending state at the
   * absolute bottom of this section.
   */
  const isEndingActive =
    journeyIndex >=
    endingIndex - 0.05

  /*
   * Journey movement.
   *
   * One milestone = 14vh.
   */
  const journeyOffset =
    journeyIndex *
    SCROLL_PER_ITEM

  /*
   * 100vh sticky viewport
   * +
   * 14vh for every Journey milestone.
   */
  const scrollHeightVh =
    100 +
    endingIndex *
      SCROLL_PER_ITEM

  const currentJourney =
    journey[
      activeIndex
    ]

  const currentLearned =
    currentJourney?.learned ?? ''

  const handleNextMilestoneClick = () => {
    if (
      isEndingActive ||
      !sectionRef.current ||
      typeof window === 'undefined'
    ) {
      return
    }

    const section =
      sectionRef.current

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY

    const scrollRange = Math.max(
      section.offsetHeight -
        window.innerHeight,
      1
    )

    const nextTargetIndex =
      activeIndex >= journey.length - 1
        ? journey.length
        : activeIndex + 1

    const targetScrollY =
      sectionTop +
      (nextTargetIndex / endingIndex) *
        scrollRange

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    })
  }

  return (
    <section
      ref={sectionRef}
      className={[
        'what-i-do',

        isEndingActive
          ? 'what-i-do--ending'
          : ''
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--journey-scroll-height':
            `${scrollHeightVh}vh`,
          '--core-glow':
            coreGlow,
        } as React.CSSProperties
      }
    >

      {/* =========================================
          STICKY STAGE
          ========================================= */}

      <div className="what-i-do__stage">

        {/* =======================================
            CORE
            ======================================= */}

        <div className="what-i-do__core-side">

          <div
            className="what-i-do__core-wrap"
            style={{
              '--core-glow':
                coreGlow,
            } as React.CSSProperties}
          >

            <button
              type="button"
              className="what-i-do__core-button"
              onClick={handleNextMilestoneClick}
              aria-label="Go to the next journey milestone"
            >
              <div className="what-i-do__core">

                {/* Atmospheric glow */}

                <span className="what-i-do__core-aura" />

                {/* Outer rotating ring */}

                <span
                  className="
                    what-i-do__core-ring
                    what-i-do__core-ring--outer
                  "
                />

                {/* Secondary ring */}

                <span
                  className="
                    what-i-do__core-ring
                    what-i-do__core-ring--middle
                  "
                />

                {/* Inner ring */}

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
                    className="what-i-do__core-year"
                    key={
                      isEndingActive
                        ? 'ending'
                        : `year-${activeIndex}`
                    }
                  >
                    {isEndingActive
                      ? '∞'
                      : currentJourney?.year}
                  </span>

                  <span
                    className="what-i-do__core-status"
                    key={
                      isEndingActive
                        ? 'ending-status'
                        : `status-${activeIndex}`
                    }
                  >
                    {isEndingActive
                      ? 'THE JOURNEY CONTINUES.'
                      : currentJourney?.title}
                  </span>

                </div>

              </div>
            </button>

          </div>


          <div className="what-i-do__core-meta">

            <span>
              02 — JOURNEY
            </span>

            <span>
              {isEndingActive
                ? 'END'
                : String(
                    activeIndex + 1
                  ).padStart(2, '0')}

              {' / '}

              {String(
                journey.length
              ).padStart(2, '0')}
            </span>

          </div>

          <div
            key={
              isEndingActive
                ? 'ending-learned'
                : `learned-${activeIndex}`
            }
            className="what-i-do__learned"
          >
            <span className="what-i-do__learned-label">
              WHAT I LEARNED
            </span>

            <p className="what-i-do__learned-text">
              {currentLearned}
            </p>
          </div>

        </div>


        {/* =======================================
            JOURNEY
            ======================================= */}

        <div className="what-i-do__journey">

          <div className="journey__header">

            <span>
              JOURNEY
            </span>

            <span>
              {isEndingActive
                ? 'END'
                : String(
                    activeIndex + 1
                  ).padStart(2, '0')}

              {' / '}

              {String(
                journey.length
              ).padStart(2, '0')}
            </span>

          </div>


          <div className="journey__viewport">

            <div className="journey__axis" />


            <div
              className="journey__track"
              style={{
                transform:
                  `translateY(-${journeyOffset}vh)`
              }}
            >

              {journey.map(
                (
                  item,
                  index
                ) => {

                  const distance =
                    Math.abs(
                      index -
                        activeIndex
                    )

                  const isActive =
                    index === activeIndex

                  return (
                    <div
                      key={item.year}
                      className={[
                        'journey__item',

                        isActive
                          ? 'journey__item--active'
                          : '',

                        distance > 2
                          ? 'journey__item--far'
                          : ''
                      ]
                        .filter(Boolean)
                        .join(' ')}
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
                  )
                }
              )}


              {/* =================================
                  END
                  ================================= */}

              <div
                className={[
                  'journey__ending',

                  isEndingActive
                    ? 'journey__ending--active'
                    : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
              >

                <span className="journey__ending-symbol">
                  ∞
                </span>

                <span className="journey__ending-label">
                  THE JOURNEY CONTINUES.
                </span>

              </div>

            </div>


            {/* ===================================
                PROGRESS
                =================================== */}

            <div className="journey__progress">

              <span>
                {isEndingActive
                  ? 'END'
                  : String(
                      activeIndex + 1
                    ).padStart(2, '0')}
              </span>


              <div className="journey__progress-line">

                <span
                  style={{
                    transform:
                      `scaleY(${clamp(
                        journeyIndex /
                          endingIndex,
                        0,
                        1
                      )})`
                  }}
                />

              </div>


              <span>
                {String(
                  journey.length
                ).padStart(2, '0')}
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default WhatIDo