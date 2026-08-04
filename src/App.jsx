import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import { AttractionProvider, useAttraction } from './attractions.jsx'
import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'

const GymSite = lazy(() => import('./sites/GymSite.jsx'))
const KioskSite = lazy(() => import('./sites/KioskSite.jsx'))
const BossSite = lazy(() => import('./sites/BossSite.jsx'))
const ThemeParkSite = lazy(() => import('./sites/ThemeParkSite.jsx'))
const MostarSite = lazy(() => import('./sites/MostarSite.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

function Shell() {
  const { current } = useAttraction()
  const standalone = Boolean(current.standalone)

  const site =
    current.id === 'boss' ? (
      <BossSite key="boss" />
    ) : current.id === 'kiosk' ? (
      <KioskSite key="kiosk" />
    ) : current.id === 'themepark' ? (
      <ThemeParkSite key="themepark" />
    ) : current.id === 'mostar' ? (
      <MostarSite key="mostar" />
    ) : (
      <GymSite key="gym" />
    )

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* Standalone attractions (their own header/footer) hide the shared chrome */}
      {!standalone && <ScrollProgress />}
      {!standalone && <Navbar />}
      <main>
        <Suspense fallback={<div className="h-[92svh]" aria-hidden="true" />}>
          {site}
        </Suspense>
      </main>
      {!standalone && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AttractionProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </AttractionProvider>
  )
}
