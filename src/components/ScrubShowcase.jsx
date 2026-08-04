import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Film } from 'lucide-react'

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

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

/* Reusable video showcase: desktop = fullscreen scroll-scrub, mobile = full-width
   16:9 block, no crop. Pass `videoSrc` to plug in footage; omit it to render a
   labelled placeholder that's ready to receive a clip. */
export default function ScrubShowcase({
  id,
  eyebrow,
  title,
  description,
  videoSrc,
  highlights = [],
}) {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  let stage
  if (!videoSrc) stage = <PlaceholderStage id={id} />
  else if (reduced || isMobile) stage = <SimpleStage id={id} src={videoSrc} />
  else stage = <ScrubStage id={id} src={videoSrc} />

  return (
    <>
      {stage}
      <Caption eyebrow={eyebrow} title={title} description={description} />
      {highlights.length > 0 && <Highlights items={highlights} />}
    </>
  )
}

function Caption({ eyebrow, title, description }) {
  return (
    <section className="relative bg-ink-950 px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-7xl text-center">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

/* Placeholder for an attraction that has no footage yet. */
function PlaceholderStage({ id }) {
  return (
    <section id={id} className="relative w-full bg-ink-950">
      <div className="flex aspect-video w-full items-center justify-center border-y border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_70%)]">
        <div className="flex flex-col items-center gap-3 text-white/45">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
            <Film size={26} strokeWidth={1.6} />
          </span>
          <span className="text-sm font-medium uppercase tracking-widest">
            Video coming soon
          </span>
        </div>
      </div>
    </section>
  )
}

/* Mobile / reduced-motion: full-width 16:9 block. */
function SimpleStage({ id, src }) {
  return (
    <section id={id} className="relative w-full bg-ink-950">
      <video
        className="aspect-video w-full object-contain"
        src={src}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </section>
  )
}

/* Desktop: fullscreen scroll-scrubbed video. */
function ScrubStage({ id, src }) {
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
    <section ref={containerRef} id={id} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          src={src}
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

function Highlights({ items }) {
  return (
    <section className="lazy-section relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
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
