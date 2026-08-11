import { useEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
   Media primitives for the Solution attraction.

   Every one of these renders a tasteful placeholder until a `src` is supplied,
   so the page is complete and reviewable before any footage exists. Dropping in
   real video later is a one-line change per instance — pass `src` (and
   optionally `srcMobile` / `poster`); nothing else about the layout moves.
   --------------------------------------------------------------------------- */

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

/* Videos ship with preload="none" and no autoplay attribute, then start loading
   only once they are within a screen of the viewport. `autoplay` in the markup
   would override preload="none" and pull every clip on first paint, so playback
   is started here instead. */
function useLazyAutoplay(active) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || !active) return
    const start = () => {
      if (v.preload !== 'auto') {
        v.preload = 'auto'
        v.load()
      }
      v.play().catch(() => {})
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && start()),
      { rootMargin: '100% 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [active])
  return ref
}

const RATIOS = {
  wide: 'aspect-[16/9]',
  cinema: 'aspect-[21/9]',
  portrait: 'aspect-[4/5]',
  // 9:16 — matches vertically-shot footage exactly, so nothing is cropped.
  tall: 'aspect-[9/16]',
  square: 'aspect-square',
  fill: 'h-full w-full',
}

/* ---------------------------------------------------------------------------
   VideoPlaceholder — the holding state. Deliberately quiet: a stone surface,
   a hairline frame and a corner label. No icons, no play button, nothing that
   would read as a broken embed.
   --------------------------------------------------------------------------- */
export function VideoPlaceholder({
  label = 'Video',
  caption,
  ratio = 'wide',
  className = '',
  // `quiet` is for placeholders sitting behind copy at full-bleed: the label
  // would otherwise collide with the fixed nav and the story progress rail.
  quiet = false,
}) {
  return (
    <div
      className={`relative overflow-hidden glass rounded-2xl ${RATIOS[ratio]} ${className}`}
      role="img"
      aria-label={`${label}${caption ? ` — ${caption}` : ''} (video placeholder)`}
    >
      {/* barely-there tonal wash so the block reads as a frame, not a hole */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_30%_0%,rgba(176,141,87,0.10),transparent_60%)]" />
      {quiet ? (
        <div className="absolute bottom-16 right-5 flex max-w-[min(22rem,60vw)] flex-col items-end gap-1.5 text-right sm:bottom-20 sm:right-8">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-400">
            {label}
          </span>
          {caption && (
            <span className="text-xs leading-relaxed text-white/55">
              {caption}
            </span>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-400">
            {label}
          </span>
          {caption && (
            <span className="max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   CinematicVideo — the workhorse. Falls back to VideoPlaceholder with no src.
   --------------------------------------------------------------------------- */
export function CinematicVideo({
  src,
  srcMobile,
  poster,
  label = 'Video',
  caption,
  ratio = 'wide',
  overlay = 0,
  className = '',
  children,
  priority = false,
  quiet,
}) {
  // Full-bleed frames always sit behind copy, so they default to quiet chrome.
  const quietChrome = quiet ?? ratio === 'fill'
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const videoRef = useLazyAutoplay(!reduced)

  const resolved = isMobile && srcMobile ? srcMobile : src

  if (!resolved) {
    return (
      <div className={`relative ${RATIOS[ratio]} ${className}`}>
        <VideoPlaceholder
          label={label}
          caption={caption}
          ratio={ratio}
          quiet={quietChrome}
          className="h-full w-full"
        />
        {children && <div className="absolute inset-0">{children}</div>}
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-ink-900 ${RATIOS[ratio]} ${className}`}
    >
      <video
        ref={videoRef}
        // `key` forces a reload when the breakpoint swaps the desktop/mobile file
        key={resolved}
        className="absolute inset-0 h-full w-full object-cover"
        src={resolved}
        poster={poster}
        muted
        loop
        playsInline
        preload={priority ? 'auto' : 'none'}
        autoPlay={priority && !reduced}
        aria-label={caption || label}
      />
      {overlay > 0 && (
        <div
          className="pointer-events-none absolute inset-0 bg-ink-950"
          style={{ opacity: overlay }}
        />
      )}
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   FullscreenStoryVideo — a viewport-filling frame for the scrolling story.
   --------------------------------------------------------------------------- */
export function FullscreenStoryVideo({
  src,
  srcMobile,
  poster,
  label,
  caption,
  overlay = 0.45,
  children,
}) {
  return (
    <div className="absolute inset-0">
      <CinematicVideo
        src={src}
        srcMobile={srcMobile}
        poster={poster}
        label={label}
        caption={caption}
        ratio="fill"
        overlay={overlay}
        className="h-full w-full"
      />
      {children && (
        <div className="pointer-events-none absolute inset-0 flex items-center">{children}</div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   CaseStudyVideo — portrait frame used in the Industries / Work section.
   --------------------------------------------------------------------------- */
export function CaseStudyVideo({ src, srcMobile, poster, label, caption, className = '' }) {
  return (
    <CinematicVideo
      src={src}
      srcMobile={srcMobile}
      poster={poster}
      label={label}
      caption={caption}
      ratio="portrait"
      overlay={src ? 0.25 : 0}
      className={`border border-white/10 ${className}`}
    />
  )
}
