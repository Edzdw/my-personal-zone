import { useEffect, useRef, useState } from 'react'
import './WhatIDo.css'

type SystemNode = {
  id: string
  label: string
  description: string
  details: string[]
}

const nodes: SystemNode[] = [
  {
    id: 'software',
    label: 'SOFTWARE',
    description:
      'I build digital products that solve real problems.',
    details: [
      'WEB APPLICATIONS',
      'INTERFACES',
      'DIGITAL PRODUCTS',
    ],
  },
  {
    id: 'automation',
    label: 'AUTOMATION',
    description:
      'I turn repetitive work into systems that run themselves.',
    details: [
      'WORKFLOWS',
      'APIs',
      'PROCESS AUTOMATION',
    ],
  },
  {
    id: 'systems',
    label: 'SYSTEMS',
    description:
      'I connect logic, data, and technology into something coherent.',
    details: [
      'ARCHITECTURE',
      'DATA',
      'SYSTEM DESIGN',
    ],
  },
  {
    id: 'products',
    label: 'PRODUCTS',
    description:
      'I like turning ideas into things people can actually use.',
    details: [
      'IDEAS',
      'EXPERIMENTS',
      'REAL THINGS',
    ],
  },
]

function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)

  const [activeNode, setActiveNode] =
    useState<string | null>(null)

  const [isVisible, setIsVisible] =
    useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const core = coreRef.current

    if (!core) return

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const rect = core.getBoundingClientRect()

      const x =
        event.clientX -
        (rect.left + rect.width / 2)

      const y =
        event.clientY -
        (rect.top + rect.height / 2)

      const distance = Math.sqrt(
        x * x + y * y
      )

      const maxDistance = 260

      const intensity = Math.max(
        0,
        1 - distance / maxDistance
      )

      core.style.setProperty(
        '--core-x',
        `${x * 0.025}px`
      )

      core.style.setProperty(
        '--core-y',
        `${y * 0.025}px`
      )

      core.style.setProperty(
        '--core-intensity',
        String(intensity)
      )
    }

    window.addEventListener(
      'pointermove',
      handlePointerMove
    )

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      )
    }
  }, [])

  const activeData =
    nodes.find(
      (node) => node.id === activeNode
    ) ?? null

  return (
    <section
      ref={sectionRef}
      className={`what-i-do ${
        isVisible
          ? 'what-i-do--visible'
          : ''
      }`}
    >
      {/* =================================================
          HEADER
          ================================================= */}

      <div className="what-i-do__header">
        <span className="section-index">
          01
        </span>

        <span className="section-title">
          WHAT I DO
        </span>
      </div>

      {/* =================================================
          SYSTEM
          ================================================= */}

      <div className="what-i-do__system">

        <div
          ref={coreRef}
          className={`system-core ${
            activeNode
              ? 'system-core--active'
              : ''
          }`}
        >
          {/* Orbit */}
          <div className="system-core__orbit system-core__orbit--one" />
          <div className="system-core__orbit system-core__orbit--two" />
          <div className="system-core__orbit system-core__orbit--three" />

          {/* Energy particles */}
          <span className="system-core__particle system-core__particle--one" />
          <span className="system-core__particle system-core__particle--two" />
          <span className="system-core__particle system-core__particle--three" />

          {/* Core */}
          <div className="system-core__center">
            <span className="system-core__center-ring" />

            <span className="system-core__center-label">
              CORE
            </span>

            <span className="system-core__center-status">
              {activeNode
                ? 'CONNECTED'
                : 'ONLINE'}
            </span>
          </div>

          {/* Connection lines */}

          <span
            className={`system-core__connection system-core__connection--software ${
              activeNode === 'software'
                ? 'is-active'
                : ''
            }`}
          />

          <span
            className={`system-core__connection system-core__connection--automation ${
              activeNode === 'automation'
                ? 'is-active'
                : ''
            }`}
          />

          <span
            className={`system-core__connection system-core__connection--systems ${
              activeNode === 'systems'
                ? 'is-active'
                : ''
            }`}
          />

          <span
            className={`system-core__connection system-core__connection--products ${
              activeNode === 'products'
                ? 'is-active'
                : ''
            }`}
          />

          {/* Nodes */}

          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`system-node system-node--${node.id} ${
                activeNode === node.id
                  ? 'system-node--active'
                  : ''
              } ${
                activeNode &&
                activeNode !== node.id
                  ? 'system-node--dimmed'
                  : ''
              }`}
              onMouseEnter={() =>
                setActiveNode(node.id)
              }
              onMouseLeave={() =>
                setActiveNode(null)
              }
              onFocus={() =>
                setActiveNode(node.id)
              }
              onBlur={() =>
                setActiveNode(null)
              }
            >
              <span className="system-node__index">
                {node.id === 'software'
                  ? '01'
                  : node.id === 'automation'
                    ? '02'
                    : node.id === 'systems'
                      ? '03'
                      : '04'}
              </span>

              <span className="system-node__label">
                {node.label}
              </span>

              <span className="system-node__indicator" />
            </button>
          ))}
        </div>

        {/* =================================================
            DESCRIPTION
            ================================================= */}

        <div
          className={`what-i-do__description ${
            activeData
              ? 'what-i-do__description--active'
              : ''
          }`}
        >
          <div className="what-i-do__description-index">
            {activeData
              ? `// ${activeData.id.toUpperCase()}`
              : '// SYSTEM'}
          </div>

          <p className="what-i-do__description-main">
            {activeData
              ? activeData.description
              : 'I turn ideas into systems, software, and things that can exist in the real world.'}
          </p>

          <div className="what-i-do__description-details">
            {activeData
              ? activeData.details.map(
                  (detail) => (
                    <span key={detail}>
                      {detail}
                    </span>
                  )
                )
              : (
                <>
                  <span>THINK</span>
                  <span>BUILD</span>
                  <span>EXPLORE</span>
                </>
              )}
          </div>
        </div>
      </div>

      {/* =================================================
          FOOTER
          ================================================= */}

      <div className="what-i-do__footer">
        <span>
          SYSTEM STATUS: ONLINE
        </span>

        <span>
          04 MODULES CONNECTED
        </span>

        <span>
          INTERACTION: ENABLED
        </span>
      </div>
    </section>
  )
}

export default WhatIDo