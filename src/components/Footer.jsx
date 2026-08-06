import { motion } from 'framer-motion'
import { ScanLine } from 'lucide-react'
import { useAttraction } from '../attractions.jsx'

const COLUMNS = [
  {
    heading: 'Solutions',
    links: ['Membership Kiosk', 'Tripod Turnstile', 'Face Recognition', 'AI Monitoring'],
  },
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
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-ink-950">
                <ScanLine size={18} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                {current.brandA}
                <span className="text-accent-400">{current.brandB}</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              A connected gym entrance system pairing self-service kiosks with
              face-verified tripod turnstiles and AI tailgating detection.
            </p>
          </div>

          {COLUMNS.map((column) => (
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-sm text-white/40 sm:flex-row">
          <p>© 2026 GymAccess. All rights reserved.</p>
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
