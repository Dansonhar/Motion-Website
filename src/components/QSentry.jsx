import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Users,
  Siren,
  Camera,
  ShieldOff,
  ChevronDown,
} from 'lucide-react'

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

// Copy reflects how QSentry AI actually works: it counts people per single
// entry tap and only reacts to tailgating — it does not do facial ID and
// does not record members on normal entries.
const HIGHLIGHTS = [
  { icon: Users, title: '24/7 People Counting', text: 'AI counts every person crossing the gate — one tap, one person is normal, day or night.' },
  { icon: Siren, title: 'Instant Alarm', text: 'Two people on one tap trips red flashing lights and a buzzer the moment it happens.' },
  { icon: Camera, title: 'Photo & Video Proof', text: 'Every tailgater is captured — a photo and short clip sent straight to your phone.' },
  { icon: ShieldOff, title: 'Privacy-First', text: 'Members are never recorded. Only tailgaters are captured — PDPA-friendly, trust-safe.' },
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

export default function QSentry() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const simple = reduced || isMobile
  return (
    <>
      {simple ? <SimpleStage /> : <ScrubStage />}
      <SentryCaption />
      <DetectionClip />
      <Highlights />
    </>
  )
}

/* Real detection footage from the QSentry monitor, shown straight after the
   feature video. A 16:9 capture in a 16:9 frame, so the "QSENTRY AI" label,
   the red alarm bars down both edges and the TAILGATE DETECTED banner are all
   fully in shot. */
function DetectionClip() {
  return (
    <section className="relative bg-ink-950 px-5 pt-12 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-400">
            Caught on camera
          </p>
          <h3 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            This is what a tailgate looks like.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-white/70 sm:text-base">
            One member is cleared through the lane and a second walks in behind
            him on the same opening — no tap, no membership. QSentry tracks both
            people, throws TAILGATE DETECTED the moment the second one crosses,
            and lights the alarm in the same second.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <video
              className="aspect-video w-full object-contain"
              src={`${import.meta.env.BASE_URL}video/gym/qsentry-detect.mp4`}
              poster={`${import.meta.env.BASE_URL}video/gym/qsentry-detect-poster.jpg`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="QSentry AI monitor detecting a tailgater at a swing barrier lane"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* Section caption — sits directly below the video stage. */
function SentryCaption() {
  return (
    <section className="relative bg-ink-950 px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-400">
          AI Security
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          QSentry AI
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Members sneaking friends in is quietly costing your gym every month.
          QSentry AI catches every tailgater — automatically.
        </p>
      </div>
    </section>
  )
}

/* Mobile / reduced-motion: full-width 16:9 block — fills edge to edge with no
   crop and no black space, since the box matches the video's shape. */
function SimpleStage() {
  return (
    <section id="qsentry" className="relative w-full bg-ink-950">
      <video
        className="aspect-video w-full object-contain"
        src={`${import.meta.env.BASE_URL}video/gym/qsentry.mp4`}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="QSentry AI anti-tailgater camera promotional video"
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

    // Ships as preload="none" so it costs nothing on first paint. The download
    // only starts once the stage is within a screen of the viewport — by the
    // time the visitor scrolls into it, it is buffered and ready to scrub.
    let prime
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        if (video.preload !== 'auto') {
          video.preload = 'auto'
          video.load()
        }
        prime = video.play().then(() => video.pause()).catch(() => {})
        io.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(video)

    return () => {
      video.removeEventListener('loadeddata', onReady)
      io.disconnect()
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
    <section ref={containerRef} id="qsentry" className="relative h-[400vh] bg-black">
      {/* The video carries its own on-screen annotations, so it sits inside a
          safe area: padded clear of the fixed navbar and the scroll hint, with
          object-contain so no edge of the frame is ever cropped or covered. */}
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden pb-14 pt-16 sm:pt-20">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src={`${import.meta.env.BASE_URL}video/gym/qsentry.mp4`}
          poster={POSTER}
          muted
          playsInline
          preload="none"
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
