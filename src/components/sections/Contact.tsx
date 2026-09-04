function Contact() {
  return (
    <section className="contact">
      <div className="contact__header">
        <div>
          <span className="section-index">06</span>
          <span className="section-title">CONTACT</span>
        </div>

        <span className="contact__status">
          <i />
          OPEN TO NEW IDEAS
        </span>
      </div>

      <div className="contact__content">
        <p className="contact__eyebrow">
          GOT SOMETHING IN MIND?
        </p>

        <h2>
          LET'S SEE
          <br />
          WHAT WE CAN
          <br />
          BUILD.
        </h2>
      </div>

      <div className="contact__actions">
        <a
          href="mailto:your@email.com"
          className="contact__email"
        >
          <span>YOUR@EMAIL.COM</span>
          <span>↗</span>
        </a>

        <div className="contact__socials">
          <a href="#">GITHUB ↗</a>
          <a href="#">LINKEDIN ↗</a>
        </div>
      </div>
    </section>
  )
}

export default Contact