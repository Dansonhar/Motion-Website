import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Accessibility,
  ShieldCheck,
  Lightbulb,
  ArrowLeftRight,
  ChevronDown,
} from 'lucide-react'

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

const HIGHLIGHTS = [
  { icon: Accessibility, title: 'Accessible Wide Lane', text: 'A wider swing lane welcomes wheelchairs, prams and gym bags with ease.' },
  { icon: ArrowLeftRight, title: 'Bidirectional Control', text: 'Manages entry and exit in a single lane with anti-tailgating logic.' },
  { icon: Lightbulb, title: 'LED Direction Cues', text: 'Green and red indicators guide members and signal access status.' },
  { icon: ShieldCheck, title: 'Anti-Pinch Panel', text: 'Silent servo swing panel auto-closes safely after each passage.' },
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

export default function SwingBarrier() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const simple = reduced || isMobile
  return (
    <>
      {simple ? <SimpleStage /> : <ScrubStage />}
      <BarrierCaption />
      <Highlights />
    </>
  )
}

/* Section caption — sits directly below the video stage. */
function BarrierCaption() {
  return (
    <section className="relative bg-ink-950 px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-400">
          Entrance Hardware
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Tripod Swing Barrier
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          A wider, accessible swing lane for smooth, silent entry.
        </p>
      </div>
    </section>
  )
}

/* Mobile / reduced-motion: full-width 16:9 block — fills edge to edge with no
   crop and no black space, since the box matches the video's shape. */
function SimpleStage() {
  return (
    <section id="hardware" className="relative w-full bg-ink-950">
      <video
        className="aspect-video w-full object-cover"
        src={`${import.meta.env.BASE_URL}video/swing-barrier.mp4`}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Tripod swing barrier"
      />
    </section>
  )
}

/* Desktop: full-bleed, fullscreen scroll-scrubbed video. On landscape screens a
   16:9 clip fills cleanly with object-cover (no bars, negligible edge crop). */
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
    <section ref={containerRef} id="hardware" className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          src={`${import.meta.env.BASE_URL}video/swing-barrier.mp4`}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

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
