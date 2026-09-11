import { useEffect, useState } from 'react'
import './App.css'

import SpaceBackground from './components/effects/SpaceBackground/SpaceBackground'
import EntrySequence from './components/effects/EntrySequence/EntrySequence'

import Footer from './components/layout/Footer/Footer'

import Hero from './components/sections/Hero/Hero'
import WhatIDo from './components/sections/WhatIDo/WhatIDo'
import SelectedWork from './components/sections/SelectedWork/SelectedWork'
import BeyondCode from './components/sections/BeyondCode/BeyondCode'
import Toolset from './components/sections/Toolset/Toolset'
import Currently from './components/sections/Currently/Currently'
import Contact from './components/sections/Contact/Contact'

import DownloadCV from './components/ui/DowloadCV'

function App() {
  const [entered, setEntered] = useState(() => {
    return sessionStorage.getItem('portfolio-intro-seen') === 'true'
  })

  useEffect(() => {
    const handleReplayIntro = () => {
      sessionStorage.removeItem('portfolio-intro-seen')
      setEntered(false)

      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }

    window.addEventListener('replay-intro', handleReplayIntro)

    return () => {
      window.removeEventListener('replay-intro', handleReplayIntro)
    }
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('portfolio-intro-seen', 'true')
    setEntered(true)
  }

  return (
    <main
      id="top"
      className={`app ${entered ? 'app--entered' : ''}`}
    >
      {!entered ? (
        <EntrySequence onComplete={handleIntroComplete} />
      ) : (
        <>
          <SpaceBackground />
          {/* <Navbar /> */}
          <DownloadCV />

          <Hero />
          <WhatIDo />
          <SelectedWork />
          <BeyondCode />
          <Toolset />
          <Currently />
          <Contact />
          <Footer />
        </>
      )}
    </main>
  )
}

export default App