import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Layers, ChevronDown, Check } from 'lucide-react'
import { useAttraction } from '../attractions.jsx'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { current, setAttraction, attractions } = useAttraction()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [attrOpen, setAttrOpen] = useState(false)
  const attrRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the attractions dropdown on outside click.
  useEffect(() => {
    if (!attrOpen) return
    const onDown = (e) => {
      if (attrRef.current && !attrRef.current.contains(e.target)) setAttrOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [attrOpen])

  const links = current.links
  // Per-attraction call to action; verticals that sell a consultation rather
  // than a product override the default.
  const cta = current.cta || { label: 'Book a Demo', href: links[links.length - 1]?.href || '#top' }
  const pick = (id) => {
    setAttraction(id)
    setAttrOpen(false)
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/5 bg-ink-950/85 backdrop-blur-xl'
          : // At the top the bar sits directly on the hero video, which is no
            // longer darkened by any scrim — so the labels carry their own
            // shadow to stay legible over bright footage.
            'border-b border-transparent bg-transparent [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_2px_10px_rgba(0,0,0,0.6)]'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Logo */}
          <a href="#top" aria-label="Q Studio" className="flex items-center">
            <Logo />
          </a>

          {/* Attractions selector */}
          <div ref={attrRef} className="relative">
            <button
              type="button"
              onClick={() => setAttrOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={attrOpen}
              className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/10"
            >
              <Layers size={15} className="text-accent-400" />
              {/* Labels a demo switcher, not a destination — first to go. */}
              <span className="hidden xl:inline">Attractions:</span>
              <span className="font-semibold">{current.label}</span>
              <ChevronDown
                size={15}
                className={`transition-transform ${attrOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {attrOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  {attractions.map((a) => {
                    const active = a.id === current.id
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          onClick={() => pick(a.id)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            active ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="font-medium">{a.label}</span>
                            {!a.available && (
                              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                                Soon
                              </span>
                            )}
                          </span>
                          {active && <Check size={16} className="text-accent-400" />}
                        </button>
                      </li>
                    )
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Three fixes to one bug, and all three are needed:
            `whitespace-nowrap` on the labels (a wrapped label made the row two
            lines tall), `gap-6` until xl, and the desktop row now starting at xl
            rather than lg. Between 1024 and 1280 the hamburger takes over, which
            scales to any number of links — Solution was already wrapping at
            1024px with five, before QStudio ever had six. */}
        <ul className="hidden items-center gap-6 xl:flex xl:gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={cta.href}
            className="hidden whitespace-nowrap rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink-950 [text-shadow:none] transition-colors hover:bg-accent-400 xl:inline-block"
          >
            {cta.label}
          </a>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 xl:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-b border-white/5 bg-ink-950/95 backdrop-blur-xl xl:hidden"
          >
            <ul className="space-y-1 px-5 pb-6 pt-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={cta.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-accent-500 px-5 py-3.5 text-center text-base font-semibold text-ink-950 [text-shadow:none]"
                >
                  {cta.label}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
