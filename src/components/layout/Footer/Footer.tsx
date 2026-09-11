import './Footer.css'

function Footer() {
  const handleReplayIntro = () => {
    window.dispatchEvent(new Event('replay-intro'))
  }

  return (
    <footer className="footer">
      <span>© 2026 TÂM</span>

      <span>BUILT WITH REACT</span>

      <button
        type="button"
        className="footer__replay"
        onClick={handleReplayIntro}
      >
        REPLAY INTRO ↻
      </button>

      <a href="#top">BACK TO TOP ↑</a>
    </footer>
  )
}

export default Footer