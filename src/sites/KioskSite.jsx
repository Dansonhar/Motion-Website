import { lazy, Suspense } from 'react'
import KioskExplode from '../components/KioskExplode.jsx'

const KioskLegend = lazy(() => import('../components/KioskLegend.jsx'))
const KioskCallToAction = lazy(() => import('../components/KioskCallToAction.jsx'))

export default function KioskSite() {
  return (
    <>
      <KioskExplode />
      <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
        <KioskLegend />
        <KioskCallToAction />
      </Suspense>
    </>
  )
}
