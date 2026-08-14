import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { EASE } from './StickyStage.jsx'

/* ---------------------------------------------------------------------------
   ClickToPlayVideo — the ONLY video primitive these two pages use.

   Standing rule for QBot and QStudio: a video never starts because the visitor
   scrolled past it. It starts because they asked. So this ships with:

     preload="none"   nothing downloads until the poster is clicked
     no autoPlay      the attribute is absent, not just false
     no IntersectionObserver start

   That is the deliberate opposite of `CinematicVideo` in components/solution,
   whose `useLazyAutoplay` starts every clip on viewport entry (12 of them on
   the Solution page). That component is untouched — the older attractions rely
   on its behaviour — but nothing here should reach for it.

   Sound is ON once playing, because a video the visitor deliberately started is
   one they want to hear. `controls` appear at the same moment, so they can
   scrub, pause and mute it like any other player.

   With no `src` the frame renders as a quiet placeholder rather than a broken
   embed, so a section can be built and reviewed before its footage exists —
   drop a file in later and nothing about the layout moves.
   --------------------------------------------------------------------------- */

const RATIOS = {
  wide: 'aspect-[16/9]',
  cinema: 'aspect-[21/9]',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[9/16]',
  square: 'aspect-square',
}

export default function ClickToPlayVideo({
  src,
  poster,
  label,
  caption,
  ratio = 'wide',
  className = '',
}) {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)

  const start = () => {
    setStarted(true)
    /* The <video> only mounts on this state change, so the play() call waits a
       frame for the ref to exist. A rejected promise is fine and expected —
       some browsers refuse an unmuted start even from a gesture, in which case
       the visitor still has the controls. */
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {})
    })
  }

  /* `w-full` is REQUIRED, not cosmetic. The unstarted state is a <button>, and
     a button sizes to its content rather than filling its grid/flex cell — and
     every child here is absolutely positioned, so the content width is zero.
     Without this the poster frame collapses to a few pixels and the aspect
     ratio faithfully renders it as a 4x2 sliver. The started state is a <div>
     and fills on its own, which is what makes the bug so easy to miss: it
     appears only before the first click, and fixes itself once you press play. */
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

  if (!started) {
    return (
      <button
        type="button"
        onClick={start}
        className={`${frame} group cursor-pointer text-left`}
        aria-label={`Play${label ? ` ${label}` : ' video'}`}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute inset-0 bg-ink-950/35 transition-colors duration-500 group-hover:bg-ink-950/20" />

        <motion.span
          initial={false}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink-950/55 text-white backdrop-blur-md sm:size-20"
        >
          <Play className="ml-0.5 size-6 sm:size-7" strokeWidth={1.6} fill="currentColor" />
        </motion.span>

        {caption && (
          <span className="absolute inset-x-5 bottom-5 text-[0.85rem] leading-snug text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            {caption}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={frame}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={caption || label}
      />
    </div>
  )
}
