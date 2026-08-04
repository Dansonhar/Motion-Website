import { motion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

const PARTS = [
  { src: '1-screen.png', idx: '01', title: 'Touch Display', spec: '24″ portrait HD, capacitive multi-touch glass.' },
  { src: '3-panel.png', idx: '02', title: 'Printer & NFC', spec: 'Thermal receipt printer with contactless + QR scan.' },
  { src: '4-terminal.png', idx: '03', title: 'Card Terminal', spec: 'EMV chip, tap-to-pay and secure PIN entry.' },
  { src: '2-bracket.png', idx: '04', title: 'Mount Bracket', spec: 'VESA neck with hidden cable pass-through.' },
  { src: '5-column.png', idx: '05', title: 'Pedestal Column', spec: 'Steel core inside a powder-coated shell.' },
  { src: '6-base.png', idx: '06', title: 'Weighted Base', spec: 'Anti-tip footprint, floor-anchor ready.' },
]

export default function KioskLegend() {
  return (
    <section id="parts" className="relative bg-ink-950 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTS.map((p, i) => (
            <motion.article
              key={p.idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25"
            >
              <div className="flex h-36 items-center justify-center">
                <img
                  src={`${BASE}kiosk-parts/${p.src}`}
                  alt={p.title}
                  loading="lazy"
                  className="max-h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-105 [filter:drop-shadow(0_16px_22px_rgba(0,0,0,0.5))]"
                />
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-white/40">
                  {p.idx}
                </span>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{p.spec}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
