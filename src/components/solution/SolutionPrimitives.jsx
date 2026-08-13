import { motion } from 'framer-motion'

/* ---------------------------------------------------------------------------
   Editorial primitives shared by every Solution section.

   Type is set with clamp() rather than breakpoint jumps so headlines scale
   continuously — an architectural/editorial look holds together at every width
   instead of stepping between three fixed sizes.
   --------------------------------------------------------------------------- */

// Slow, weighted easing. Motion here should feel expensive, not playful.
export const EASE = [0.16, 1, 0.3, 1]

/* Cinematic reveal. Framer's MotionConfig reducedMotion="user" (set in App)
   strips the transform for users who ask for reduced motion, leaving the fade. */
export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Small numbered/labelled kicker that opens a section. */
export function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-widest text-accent-400 ${className}`}
    >
      {children}
    </p>
  )
}

/* The big statement. `as` keeps the heading level semantic per section. */
export function Display({ as: Tag = 'h2', children, className = '' }) {
  return (
    <Tag
      className={`text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.02] font-bold tracking-tight text-white ${className}`}
    >
      {children}
    </Tag>
  )
}

/* Supporting paragraph. */
export function Lede({ children, className = '' }) {
  return (
    <p
      className={`text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/75 ${className}`}
    >
      {children}
    </p>
  )
}

/* Consistent section frame: hairline top rule, then the content.

   THIS PADDING DOUBLES BETWEEN SECTIONS. Every section pads its top and its
   bottom, so the visible gap between two of them is twice whatever is set here
   — `lg:py-20` reads as 160px of space, not 80px. It was `py-24 sm:py-32
   lg:py-40`, which put 320px of dead air between every section and made the
   page read as a stack of separate pages. Halved.

   Anything raised here should be checked against ProblemSection, which sets its
   own padding (it needs a full-bleed band that SectionShell's gutter would
   prevent) and is tuned to match these numbers by hand. */
export function SectionShell({ id, children, className = '', rule = true, label }) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`px-6 py-14 sm:px-10 sm:py-16 lg:py-20 ${className}`}
    >
      <div className="mx-auto max-w-[1500px]">
        {rule && <div className="sol-rule mb-10 w-full sm:mb-12" />}
        {children}
      </div>
    </section>
  )
}
