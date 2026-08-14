import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { EASE } from './StickyStage.jsx'
import { usePrefersReducedMotion } from './env.js'

/* ---------------------------------------------------------------------------
   ScrollVideo — cinematic, scroll-driven film for the QBot and QStudio pages.

   Replaces the click-to-play rule these pages used to hold. Footage now starts
   because the visitor scrolled to it, and the frame is staged so that arriving
   at it feels like a reveal rather than a thumbnail loading.

   FOUR MOVES, ALL COMPOSITOR-ONLY (transform / opacity / clip-path — no layout
   thrash, so this holds 60fps with several on screen):

     1. CURTAIN   the frame opens from the centre on entry, via clip-path inset.
                  Radius lives on the element, not in the clip, because `round`
                  in an animated inset() interpolates badly across browsers.
     2. SETTLE    the picture eases from slightly overscaled to rest, so the
                  image arrives as if a camera stopped moving.
     3. PARALLAX  the picture drifts against the page for the whole time the
                  frame is on screen. This is why the video is permanently
                  overscaled — at 1.0 the drift would expose the frame edge.
     4. RISE      label and caption lift in behind the curtain.

   PLAYBACK RULES

   - `muted` is NOT a style choice. No browser will autoplay a video with sound,
     so an unmuted autoplay silently never starts. Sound is offered instead: the
     speaker toggle unmutes on a real click, which browsers do allow. Files here
     keep their audio track precisely so that toggle has something to play.
   - Nothing downloads until the frame is near the viewport — `preload="none"`
     with no `autoplay` ATTRIBUTE (adding the attribute would override preload
     and pull every file on first paint; playback is started from script).
   - Playback pauses when the frame leaves the viewport. Off-screen video costs
     battery and decode for something nobody is looking at.
   - Reduced motion gets no autoplay and no parallax — it gets the poster and a
     play button. A visitor who asked their OS for less motion should not be
     handed moving footage they did not request.

   With no `src` the frame renders as a quiet placeholder, so a row can be laid
   out and reviewed before its footage exists.
   --------------------------------------------------------------------------- */

const RATIOS = {
  wide: 'aspect-[16/9]',
  cinema: 'aspect-[21/9]',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[9/16]',
  square: 'aspect-square',
}

export default function ScrollVideo({
  src,
  poster,
  label,
  caption,
  ratio = 'wide',
  className = '',
}) {
  const reduced = usePrefersReducedMotion()
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  /* Progress of this frame across the viewport, 0 as it enters from below to 1
     as it leaves past the top. Drives the parallax only. */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-7%', '7%'])

  /* Start near the viewport, pause once clear of it. `rootMargin` gives the
     file a screen of runway to buffer so it is running by the time it is
     actually looked at. */
  useEffect(() => {
    const v = videoRef.current
    if (!v || !src || reduced) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* Raise the hint and let play() do the fetching. Calling load() here
             as well costs a wasted round trip: raising `preload` already starts
             a request, and load() then RESETS the element and aborts it — the
             network trace shows 206 → ERR_ABORTED → 304 for a single clip. */
          v.preload = 'auto'
          v.play().then(() => setPlaying(true)).catch(() => {})
        } else {
          v.pause()
        }
      },
      /* A full screen of runway either side. At 50% a stacked pair of 16:9
         frames left the lower one outside the root until it was almost in
         view, so it started buffering as it arrived rather than before. */
      { rootMargin: '100% 0px', threshold: 0 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src, reduced])

  // Reduced-motion visitors press play themselves.
  const startManually = () => {
    const v = videoRef.current
    if (!v) return
    v.preload = 'auto'
    v.load()
    v.play().then(() => setPlaying(true)).catch(() => {})
  }

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    const next = !muted
    v.muted = next
    setMuted(next)
    // Unmuting is a user gesture, so this is the moment an unmuted play is
    // permitted — worth retrying in case autoplay never got going.
    if (!next) v.play().then(() => setPlaying(true)).catch(() => {})
  }

  const frame = `relative w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900 ${RATIOS[ratio]} ${className}`

  if (!src) {
    return (
      <div className={frame} role="img" aria-label={caption || label || 'Video'}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_30%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        {label && (
          <span className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
            {label}
          </span>
        )}
      </div>
    )
  }

  return (
    <motion.div
      ref={wrapRef}
      /* The curtain. `once` because a frame that re-opens every time it is
         scrolled past reads as a glitch, not as craft. */
      initial={reduced ? false : { clipPath: 'inset(14% 10% 14% 10%)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.25, ease: EASE }}
      className={`${frame} group`}
    >
      <motion.video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={caption || label}
        /* Overscaled on purpose — the parallax drifts the picture inside the
           frame, and at scale 1 that drift would show the edge. */
        style={{ y }}
        initial={reduced ? false : { scale: 1.16 }}
        whileInView={{ scale: 1.08 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* Reads the caption cleanly without dimming the whole picture. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />

      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:left-7 sm:top-7"
        >
          {label}
        </motion.span>
      )}

      {caption && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          className="absolute inset-x-5 bottom-5 max-w-xl text-[0.9rem] leading-snug text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)] sm:inset-x-7 sm:bottom-7 sm:text-[1rem]"
        >
          {caption}
        </motion.p>
      )}

      {/* Sound. Quiet until pointed at, because it is an offer, not a control
          the page needs the visitor to notice. */}
      {playing && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/20 bg-ink-950/50 text-white/80 opacity-0 backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:text-white focus-visible:opacity-100 group-hover:opacity-100 sm:right-7 sm:top-7"
        >
          {muted ? <VolumeX className="size-4" strokeWidth={1.8} /> : <Volume2 className="size-4" strokeWidth={1.8} />}
        </button>
      )}

      {/* Reduced motion only: nothing has started, so offer the choice. */}
      {reduced && !playing && (
        <button
          type="button"
          onClick={startManually}
          aria-label={`Play${label ? ` ${label}` : ' video'}`}
          className="absolute inset-0 grid place-items-center bg-ink-950/30"
        >
          <span className="grid size-16 place-items-center rounded-full border border-white/25 bg-ink-950/55 text-white backdrop-blur-md sm:size-20">
            <Play className="ml-0.5 size-6 sm:size-7" strokeWidth={1.6} fill="currentColor" />
          </span>
        </button>
      )}
    </motion.div>
  )
}
