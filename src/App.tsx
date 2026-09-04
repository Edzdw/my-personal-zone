import './App.css'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Hero from './components/sections/Hero'
import WhatIDo from './components/sections/WhatIDo'
import SelectedWork from './components/sections/SelectedWork'
import BeyondCode from './components/sections/BeyondCode'
import Toolset from './components/sections/Toolset'
import Currently from './components/sections/Currently'
import Contact from './components/sections/Contact'

function App() {
  return (
    <main id="top" className="app">
      <Navbar />

      <Hero />

      <WhatIDo />

      <SelectedWork />

      <BeyondCode />

      <Toolset />

      <Currently />

      <Contact />

      <Footer />
    </main>
  )
}

export default App