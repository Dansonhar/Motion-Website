import { useEffect, useState } from 'react'

/* ---------------------------------------------------------------------------
   Motion environment — one source of truth for the two questions every
   scroll rig on the QStudio page has to ask before it runs.

   These two hooks were previously redeclared in five separate files (Hero,
   ThemeParkHero, KioskShowcase, SwingBarrier, SolutionMedia), each with its own
   copy of the same matchMedia listener. The older attractions still carry their
   own copies — this module is deliberately additive so nothing working was
   touched. Anything new should import from here.
   --------------------------------------------------------------------------- */

/* A visitor who has asked their OS for less motion gets the static branch of
   every rig — never a degraded version of the animated one. Framer's
   MotionConfig reducedMotion="user" (set in App) already strips transforms from
   `motion` components, but a scroll rig that drives video currentTime or pins a
   stage has to opt out structurally, which is what this is for. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/* Phones. Resolved on the FIRST render, not in an effect, so a rig can pick its
   branch before paint instead of mounting the desktop tree and swapping — which
   on a sticky stage means a visible jump. */
export function useIsMobile(query = '(max-width: 767px)') {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return mobile
}

/* The two together: `simple` is the single flag a rig branches on. A pinned,
   scroll-driven stage is a desktop-with-motion experience; everything else gets
   the readable stacked fallback. */
export function useSimpleMotion() {
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()
  return { reduced, mobile, simple: reduced || mobile }
}
