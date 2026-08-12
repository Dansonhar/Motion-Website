import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CinematicVideo } from './SolutionMedia.jsx'
import { EASE } from './SolutionPrimitives.jsx'

const BASE = import.meta.env.BASE_URL

/* ---------------------------------------------------------------------------
   Section 1 — full-screen cinematic hero.

   No product screenshots, no floating UI. A held film, minimal copy and two
   restrained calls to action. The film is a five-scene montage that spans the
   sectors the practice works in — private dining, fitness, an atelier, a family
   leisure venue, a manager over the floor — which is the section's argument
   made visually rather than in a list. It opens and closes on black, so the
   loop has no visible seam.

   The film is NOT darkened by an overlay. Standing feedback across this site is
   that dimmed footage reads "too dark"; legibility comes from text-shadow on
   the copy instead, which only darkens the pixels right behind each glyph.
   --------------------------------------------------------------------------- */
export default function SolutionHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Gentle parallax: the frame drifts slightly slower than the page.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <CinematicVideo
          priority
          ratio="fill"
          src={`${BASE}video/solution/hero.mp4`}
          poster={`${BASE}video/solution/hero-poster.jpg`}
          /* Separate portrait cut below 768px. The landscape master centre-
             cropped into a 9:19 phone frame loses most of every shot; this is
             the same montage reframed vertically. Only one of the two is ever
             requested — see the note in CinematicVideo. */
          srcMobile={`${BASE}video/solution/hero-mobile.mp4`}
          posterMobile={`${BASE}video/solution/hero-mobile-poster.jpg`}
          label="Hero Film"
          caption="Service across five sectors — dining, fitness, retail, leisure, management"
          className="h-full w-full"
        />
      </motion.div>

      {/* Seam into the page below. Taller on mobile, where the copy sits at the
          bottom of the frame and the side scrim below does less for it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent sm:h-40 sm:via-transparent" />

      {/* Directional scrim, not a full-frame dim — it sits under the copy column
          and is fully transparent by mid-frame, so the subject stays bright.
          Needed because the montage passes through a very light venue scene.
          Same treatment as the Gym hero. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-0 flex items-end pb-20 sm:items-center sm:pb-0"
      >
        {/* Legibility over undimmed footage — see the note above. The solid
            accent pill opts back out with [text-shadow:none]. */}
        <div className="mx-auto w-full max-w-[1500px] px-6 [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_3px_12px_rgba(0,0,0,0.85),0_10px_40px_rgba(0,0,0,0.7)] sm:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="mb-8 text-xs font-semibold uppercase tracking-widest text-accent-400"
          >
            Business &amp; Operations Solutions
          </motion.p>

          <h1 className="max-w-[24ch] text-[clamp(2.2rem,5.6vw,5.4rem)] leading-[0.98] font-bold tracking-tight text-white">
            {['WE DESIGN THE BUSINESS', 'BEHIND THE OPERATION.'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.25, delay: 0.35 + i * 0.12, ease: EASE }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.75, ease: EASE }}
            className="mt-9 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/90"
          >
            Restaurants, retail, fitness, leisure, hospitality and beyond. From
            customer experience to daily operations, management and growth, we
            build connected solutions around the way your business needs to work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.95, ease: EASE }}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
          >
            <a
              href="#consultation"
              className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 [text-shadow:none] shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
            >
              Discuss Your Business
            </a>
            <a
              href="#approach"
              className="glass rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Explore Our Approach
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
