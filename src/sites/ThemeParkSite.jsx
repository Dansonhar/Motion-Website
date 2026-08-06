import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import ThemeParkAtmosphere from '../components/ThemeParkAtmosphere.jsx'

// The single Theme Park clip is the whole page — fullscreen, edge to edge.
const VIDEO_SRC = `${import.meta.env.BASE_URL}video/themepark.mp4`

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

// A fixed timeline, no scrolling required — every beat fires on its own
// timer and the video starts playing for real once revealed. The cycle
// repeats forever: title → opening → video → (video ends) → stay tuned →
// back to title.
const T = {
  titleHold: 2900, // how long "Coming Soon" holds before the letterbox opens
  openingDuration: 1100, // letterbox-open / video-crossfade duration
  stayTunedHold: 2600, // how long "Stay Tuned" holds before looping back
}

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
  return reduced ? <FullAutoplay src={VIDEO_SRC} /> : <AutoplayReveal src={VIDEO_SRC} />
}

/* Reduced-motion: fullscreen autoplay loop, no teaser sequence at all. */
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

/* "Coming Soon" title slam → hold → letterbox opens → the video plays for
   real → on end, "Stay Tuned" → back to "Coming Soon", forever. Entirely
   timer- and event-driven — press in and it just runs. */
function AutoplayReveal({ src }) {
  const videoRef = useRef(null)
  const [stage, setStage] = useState('title')
  const progress = useMotionValue(0)

  // Each stage schedules its own exit — title and stayTuned are timers,
  // "opening" hands off to "video" after the crossfade, and "video" itself
  // is ended by the clip's real `ended` event (see below), not a timer.
  useEffect(() => {
    let timer
    let controls
    if (stage === 'title') {
      progress.set(0)
      controls = animate(progress, 1, {
        duration: (T.titleHold + T.openingDuration) / 1000,
        ease: 'easeInOut',
      })
      timer = setTimeout(() => setStage('opening'), T.titleHold)
    } else if (stage === 'opening') {
      const video = videoRef.current
      if (video) {
        video.currentTime = 0
        video.play().catch(() => {})
      }
      timer = setTimeout(() => setStage('video'), T.openingDuration)
    } else if (stage === 'stayTuned') {
      timer = setTimeout(() => setStage('title'), T.stayTunedHold)
    }
    return () => {
      clearTimeout(timer)
      controls?.stop()
    }
  }, [stage, progress])

  // Prime the clip so the first real frame is decoded before we need it.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => void prime
  }, [])

  // The clip plays through once per cycle — when it really ends, loop back
  // via the "Stay Tuned" interstitial instead of restarting silently.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onEnded = () => setStage('stayTuned')
    video.addEventListener('ended', onEnded)
    return () => video.removeEventListener('ended', onEnded)
  }, [])

  const revealed = stage === 'opening' || stage === 'video'
  const showAtmosphere = stage !== 'video'

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-black">
      {showAtmosphere && <ThemeParkAtmosphere progress={progress} />}

      <motion.video
        ref={videoRef}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="absolute inset-0 z-[1] h-full w-full object-cover"
        src={src}
        poster={POSTER}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Cinema vignette + film grain, above the video, below the type */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(120%_100%_at_50%_50%,transparent_38%,rgba(0,0,0,0.75)_100%)]" />
      <div className="film-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay" />

      {/* Flash burst + title card, fire once on mount */}
      {stage === 'title' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.16, 1] }}
            className="pointer-events-none absolute inset-0 z-10 bg-white"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/50">
              Stay Tuned
            </p>
            <h1 className="glitch-title text-6xl font-bold tracking-tight text-white sm:text-8xl">
              COMING SOON
            </h1>
            <p className="mt-4 max-w-sm text-sm text-white/50 sm:text-base">
              The next attraction is almost here.
            </p>
          </motion.div>
        </>
      )}

      {/* Interstitial between loops — the preview just ended */}
      {stage === 'stayTuned' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/50">
            That's the preview
          </p>
          <h1 className="text-6xl font-bold tracking-tight text-white sm:text-8xl">
            STAY TUNED
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/50 sm:text-base">
            More is on the way.
          </p>
        </motion.div>
      )}

      {/* Letterbox bars — thick during the teaser, open into the reveal */}
      <motion.div
        animate={{ height: revealed ? '0vh' : '20vh' }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-black"
      />
      <motion.div
        animate={{ height: revealed ? '0vh' : '20vh' }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black"
      />
    </section>
  )
}
