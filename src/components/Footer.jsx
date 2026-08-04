import { ScanLine } from 'lucide-react'

const COLUMNS = [
  {
    heading: 'Solutions',
    links: ['Membership Kiosk', 'Tripod Turnstile', 'Access Control', 'Class Booking'],
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
  return (
    <footer className="border-t border-white/8 bg-ink-950 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-ink-950">
                <ScanLine size={18} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Gym<span className="text-accent-400">Access</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              A connected gym entrance system pairing self-service kiosks with the
              MT119-LED tripod turnstile for secure, automated entry.
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
                      className="text-sm text-white/50 transition-colors hover:text-accent-400"
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
      </div>
    </footer>
  )
}
