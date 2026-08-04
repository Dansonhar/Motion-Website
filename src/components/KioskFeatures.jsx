import { motion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

const PARTS = [
  {
    src: '1-screen.png', idx: '01', title: 'Touch Display',
    blurb: 'A bright portrait display that carries the whole ordering journey.',
    features: ['24″ portrait HD display', 'Capacitive multi-touch glass', 'Anti-glare, always-on menu'],
  },
  {
    src: '3-panel.png', idx: '02', title: 'Printer & NFC',
    blurb: 'Receipts, contactless and scanning built into one service panel.',
    features: ['Thermal receipt printer', 'Contactless NFC reader', '1D / 2D QR scanner'],
  },
  {
    src: '4-terminal.png', idx: '03', title: 'Card Terminal',
    blurb: 'A secure, certified terminal for every way people pay.',
    features: ['EMV chip & PIN', 'Tap-to-pay cards & wallets', 'PCI-secure keypad'],
  },
  {
    src: '2-bracket.png', idx: '04', title: 'Mount Bracket',
    blurb: 'The neck that holds it all together and hides the wiring.',
    features: ['VESA mount neck', 'Hidden cable pass-through', 'Tool-free module swap'],
  },
  {
    src: '5-column.png', idx: '05', title: 'Pedestal Column',
    blurb: 'A powder-coated steel body that services in seconds.',
    features: ['Powder-coated steel shell', 'Locking service panel', 'Internal cable-management spine'],
  },
  {
    src: '6-base.png', idx: '06', title: 'Weighted Base',
    blurb: 'A weighted footprint that keeps the kiosk planted and level.',
    features: ['Weighted anti-tip footprint', 'Floor-anchor mounting points', 'Levelling feet for any surface'],
  },
]

function Row({ part, i }) {
  const flip = i % 2 === 1
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
      {/* image */}
      <motion.div
        initial={{ opacity: 0, x: flip ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className={`relative flex h-64 items-center justify-center sm:h-80 ${flip ? 'md:order-2' : ''}`}
      >
        <div className="absolute h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)] blur-2xl" />
        <img
          src={`${BASE}kiosk-parts/${part.src}`}
          alt={part.title}
          loading="lazy"
          className="relative max-h-full w-auto object-contain [filter:drop-shadow(0_24px_34px_rgba(0,0,0,0.55))]"
        />
      </motion.div>

      {/* copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={flip ? 'md:order-1' : ''}
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-white/40">
          {part.idx} / 06
        </span>
        <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{part.title}</h3>
        <p className="mt-3 max-w-md text-white/55">{part.blurb}</p>
        <ul className="mt-6 space-y-2.5">
          {part.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-white/70">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export default function KioskFeatures() {
  return (
    <section id="parts" className="relative bg-ink-950 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-white/45">
            Six modules, one kiosk
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Every piece pulls its weight.
          </h2>
          <p className="mt-4 text-white/55">
            Each module snaps together tool-free and services in seconds — swap a
            printer or terminal without pulling the whole unit off the floor.
          </p>
        </div>

        <div className="space-y-20 sm:space-y-28">
          {PARTS.map((part, i) => (
            <Row key={part.idx} part={part} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
