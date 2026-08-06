import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  UserPlus,
  ScanLine,
  CreditCard,
  CalendarCheck,
  ChevronDown,
} from 'lucide-react'

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

const HIGHLIGHTS = [
  { icon: UserPlus, title: 'Register & Renew', text: 'Members sign up and renew memberships on-screen — no queue, no staff.' },
  { icon: ScanLine, title: 'Enrol a Face', text: 'One capture at the kiosk turns a member’s face into their access key.' },
  { icon: CreditCard, title: 'Pay & Print', text: 'Integrated card payments with printed receipts and confirmations.' },
  { icon: CalendarCheck, title: 'Book Classes', text: 'Browse the timetable and reserve classes right at the kiosk.' },
]

function usePrefersReducedMotion() {
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

// True on phones (portrait). We swap the fullscreen scrub for a full-width 16:9
// block there so a landscape video never crops or leaves black bars.
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return mobile
}

export default function KioskShowcase() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const simple = reduced || isMobile
  return (
    <>
      {simple ? <SimpleStage /> : <ScrubStage />}
      <KioskCaption />
      <Highlights />
    </>
  )
}

/* Section caption — sits directly below the video stage. */
function KioskCaption() {
  return (
    <section className="relative bg-ink-950 px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-400">
          Self-Service Kiosk
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          One Screen, the Whole Front Desk
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Sign-up, face enrolment, payments and class booking — the full
          self-service flow.
        </p>
      </div>
    </section>
  )
}

/* Mobile / reduced-motion: full-width 16:9 block — fills edge to edge with no
   crop and no black space, since the box matches the video's shape. */
function SimpleStage() {
  return (
    <section id="solutions-kiosk" className="relative w-full bg-ink-950">
      <video
        className="aspect-video w-full object-contain"
        src={`${import.meta.env.BASE_URL}video/kiosk.mp4`}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Self-service membership kiosk in use"
      />
    </section>
  )
}

/* Desktop: fullscreen scroll-scrubbed video, letterboxed inside a safe area
   so every on-screen annotation stays visible. */
function ScrubStage() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onReady = () => setReady(true)
    video.addEventListener('loadeddata', onReady)
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => {
      video.removeEventListener('loadeddata', onReady)
      void prime
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let raf = 0
    let current = 0
    const tick = () => {
      const duration = video.duration || 0
      if (duration) {
        const target = scrollYProgress.get() * duration
        current += (target - current) * 0.1
        if (Math.abs(target - current) < 0.004) current = target
        if (Math.abs(video.currentTime - current) > 0.01) {
          try {
            video.currentTime = current
          } catch {
            /* seek not ready */
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollYProgress])

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  return (
    <section ref={containerRef} id="solutions-kiosk" className="relative h-[400vh] bg-black">
      {/* The video carries its own on-screen annotations, so it sits inside a
          safe area: padded clear of the fixed navbar and the scroll hint, with
          object-contain so no edge of the frame is ever cropped or covered. */}
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden pb-14 pt-16 sm:pt-20">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src={`${import.meta.env.BASE_URL}video/kiosk.mp4`}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent-400" />
          </div>
        )}

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/55"
        >
          <span className="text-[11px] font-medium uppercase tracking-widest">
            Scroll to play
          </span>
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <section className="lazy-section relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass group rounded-2xl p-6 transition-colors duration-300 hover:border-accent-500/30"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/20 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-ink-950">
                <item.icon size={22} strokeWidth={1.8} />
              </span>
              <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
