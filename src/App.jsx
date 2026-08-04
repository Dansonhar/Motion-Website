import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'

// Everything below the hero is code-split and lazy-loaded so the initial
// payload stays small and the video starts fast.
const ProcessSteps = lazy(() => import('./components/ProcessSteps.jsx'))
const KioskShowcase = lazy(() => import('./components/KioskShowcase.jsx'))
const FeatureGrid = lazy(() => import('./components/FeatureGrid.jsx'))
const SwingBarrier = lazy(() => import('./components/SwingBarrier.jsx'))
const StatsBand = lazy(() => import('./components/StatsBand.jsx'))
const Benefits = lazy(() => import('./components/Benefits.jsx'))
const CallToAction = lazy(() => import('./components/CallToAction.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink-950 text-white">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
            <ProcessSteps />
            <KioskShowcase />
            <FeatureGrid />
            <SwingBarrier />
            <StatsBand />
            <Benefits />
            <CallToAction />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  )
}
