import { lazy, Suspense } from 'react'
import Hero from '../components/Hero.jsx'

// Below-the-hero sections are code-split so the hero video starts fast.
const ProcessSteps = lazy(() => import('../components/ProcessSteps.jsx'))
const KioskShowcase = lazy(() => import('../components/KioskShowcase.jsx'))
const FeatureGrid = lazy(() => import('../components/FeatureGrid.jsx'))
const SwingBarrier = lazy(() => import('../components/SwingBarrier.jsx'))
const QSentry = lazy(() => import('../components/QSentry.jsx'))
const StatsBand = lazy(() => import('../components/StatsBand.jsx'))
const Benefits = lazy(() => import('../components/Benefits.jsx'))
const CallToAction = lazy(() => import('../components/CallToAction.jsx'))

export default function GymSite() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
        <ProcessSteps />
        <KioskShowcase />
        <FeatureGrid />
        <SwingBarrier />
        <QSentry />
        <StatsBand />
        <Benefits />
        <CallToAction />
      </Suspense>
    </>
  )
}
