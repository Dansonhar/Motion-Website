import { motion } from 'framer-motion'
import { useAttraction } from '../attractions.jsx'
import Logo from './Logo.jsx'

// Company/Resources are generic across every attraction; only "Solutions"
// is product-specific, so it comes from each attraction's own `footer` field.
//
// An attraction can override "Resources" via `footer.resources` — the default
// list is written for a product you install and support, which does not hold
// for a vertical selling a consulting engagement.
const SHARED_COLUMNS = [
  {
    heading: 'Company',
    links: ['About', 'Contact', 'Support', 'Partners'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'Installation', 'Case Studies', 'FAQ'],
  },
]

export default function Footer() {
  const { current } = useAttraction()
  const blurb =
    current.footer?.blurb ??
    'A connected access system pairing self-service kiosks with secure, verified entry.'
  const columns = [
    { heading: 'Solutions', links: current.footer?.solutions ?? [] },
    ...SHARED_COLUMNS.map((c) =>
      c.heading === 'Resources' && current.footer?.resources
        ? { ...c, links: current.footer.resources }
        : c,
    ),
  ]
  return (
    <footer className="border-t border-white/8 bg-ink-950 px-5 py-16 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {blurb}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="inline-block text-sm text-white/50 transition-all duration-200 hover:translate-x-1 hover:text-accent-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-sm text-white/60 sm:flex-row">
          {/* The company, not the vertical. `brandA`/`brandB` name the product
              line for each attraction (GymAccess, ParkAccess, Solution), so
              this line used to claim copyright for a company called "Solution"
              directly under a logo that reads Q Studio. One owner, one name. */}
          <p>© 2026 Q Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#top" className="transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="#top" className="transition-colors hover:text-white/70">
              Terms
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
