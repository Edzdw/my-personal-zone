import './DowloadCV.css'

function DownloadCV() {
  return (
    <a
      className="download-cv"
      href="/file/cv.pdf"
      download
      aria-label="Download CV"
    >
      <span className="download-cv__icon">
        ↓
      </span>

      <span className="download-cv__label">
        DOWNLOAD CV
      </span>
    </a>
  )
}

export default DownloadCV