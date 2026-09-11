import './BeyondCode.css'

function BeyondCode() {
  return (
    <section className="beyond-code">
      <div className="beyond-code__header">
        <span className="section-index">03</span>
        <span className="section-title">
          BEYOND THE CODE
        </span>
      </div>

      <div className="beyond-code__space">

        <p className="beyond-code__fragment fragment-1">
          SOME THINGS EXIST
          <br />
          BECAUSE I WAS CURIOUS.
        </p>

        <p className="beyond-code__fragment fragment-2">
          SOME BECAUSE
          <br />
          I HAD AN IDEA.
        </p>

        <p className="beyond-code__fragment fragment-3">
          SOME JUST BECAUSE
          <br />
          I WANTED TO SEE
          <br />
          WHAT WOULD HAPPEN.
        </p>


        <div className="beyond-code__statement">
          <p className="beyond-code__main">
            <span className="typing-line typing-line--1">
              I SPEND A LOT
            </span>

            <span className="typing-line typing-line--2">
              OF TIME BUILDING.
            </span>
          </p>

          <p className="beyond-code__contrast">
            <span>BUT NOT EVERYTHING</span>
            <span>I BUILD HAS TO BE</span>
            <span>USEFUL.</span>
          </p>
        </div>

      </div>

      <div className="beyond-code__footer">
        <span>CODE</span>
        <span>MARKETS</span>
        <span>STORIES</span>
        <span>IDEAS</span>
      </div>
    </section>
  )
}

export default BeyondCode