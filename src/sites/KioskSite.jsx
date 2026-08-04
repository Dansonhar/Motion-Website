import { lazy, Suspense } from 'react'
import KioskHero from '../components/KioskHero.jsx'

const KioskFeatures = lazy(() => import('../components/KioskFeatures.jsx'))
const KioskCallToAction = lazy(() => import('../components/KioskCallToAction.jsx'))

export default function KioskSite() {
  return (
    <>
      <KioskHero />
      <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
        <KioskFeatures />
        <KioskCallToAction />
      </Suspense>
    </>
  )
}
