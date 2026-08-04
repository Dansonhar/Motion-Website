import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// The single Theme Park clip is the whole page — fullscreen, edge to edge.
const VIDEO_SRC = `${import.meta.env.BASE_URL}video/themepark.mp4`

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

export default function ThemeParkSite() {
  const reduced = usePrefersReducedMotion()
  return reduced ? <FullAutoplay src={VIDEO_SRC} /> : <ScrubFull src={VIDEO_SRC} />
}

/* Reduced-motion: fullscreen autoplay loop, no scroll-jacking. */
function FullAutoplay({ src }) {
  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
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

/* The entire page is the clip, filling the screen (object-cover) and scrubbed by
   scroll on both desktop and mobile. */
function ScrubFull({ src }) {
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

  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])

  return (
    <section ref={containerRef} id="top" className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
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
