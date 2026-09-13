import { useEffect, useState } from 'react'
import './ControlNode.css'

type ControlAction = 'replay' | 'download' | 'top'

function ControlNode() {
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen((current) => !current)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAction = (action: ControlAction) => {
    if (action === 'replay') {
      setOpen(false)
      window.dispatchEvent(new Event('replay-intro'))
      return
    }

    if (action === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      setOpen(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className={`control-node ${
        open ? 'control-node--open' : ''
      }`}
    >
      {/* Invisible click-outside layer */}
      {open && (
        <button
          className="control-node__overlay"
          type="button"
          aria-label="Close controls"
          onClick={handleClose}
        />
      )}

      {/* =====================================================
          DEPLOY SYSTEM
          ===================================================== */}

      <div className="control-node__deploy">
        {/* Mechanical housing */}
        <div className="control-node__housing">
          <span />
          <span />
          <span />
        </div>

        {/* =================================================
            REPLAY
            ================================================= */}

        <div className="control-node__chamber control-node__chamber--replay">
          <span className="control-node__track" />

          <button
            className="control-node__action"
            type="button"
            onClick={() => handleAction('replay')}
            aria-label="Replay intro"
          >
            <span className="control-node__action-icon">
              ↻
            </span>

            <span className="control-node__action-label">
              REPLAY INTRO
            </span>
          </button>
        </div>

        {/* =================================================
            DOWNLOAD
            ================================================= */}

        <div className="control-node__chamber control-node__chamber--download">
          <span className="control-node__track" />

          <a
            className="control-node__action"
            href="/file/cv.pdf"
            download
            aria-label="Download CV"
            onClick={() => setOpen(false)}
          >
            <span className="control-node__action-icon">
              ↓
            </span>

            <span className="control-node__action-label">
              DOWNLOAD CV
            </span>
          </a>
        </div>

        {/* =================================================
            TOP
            ================================================= */}

        <div className="control-node__chamber control-node__chamber--top">
          <span className="control-node__track" />

          <button
            className="control-node__action"
            type="button"
            onClick={() => handleAction('top')}
            aria-label="Scroll to top"
          >
            <span className="control-node__action-icon">
              ↑
            </span>

            <span className="control-node__action-label">
              BACK TO TOP
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          ROOT
          ===================================================== */}

      <button
        className="control-node__root"
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={
          open
            ? 'Close controls'
            : 'Open controls'
        }
      >
        <span className="control-node__root-icon">
          <span />
          <span />
          <span />
        </span>

        <span className="control-node__root-label">
          {open ? 'CLOSE' : 'CONTROL'}
        </span>
      </button>
    </div>
  )
}

export default ControlNode