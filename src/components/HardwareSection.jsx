import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Lightbulb,
  Users,
  ScanLine,
  ShieldCheck,
  Timer,
  Siren,
} from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

// Feature callouts that wrap around the 3D model — left and right columns
// so the parts are annotated on every side, not stacked on one edge.
const LEFT = [
  {
    icon: Lightbulb,
    title: 'LED Access Indicators',
    text: 'Green and red light strips signal approval or denial at a glance.',
  },
  {
    icon: Users,
    title: 'Single-Person Entry',
    text: 'Silent servo-driven arms allow one authorised member through at a time.',
  },
  {
    icon: ScanLine,
    title: 'Universal Reader Zone',
    text: 'Reads QR codes, NFC / RFID cards, facial and barcode credentials.',
  },
]

const RIGHT = [
  {
    icon: ShieldCheck,
    title: '304 Stainless Body',
    text: 'Matte-black, scratch-resistant steel housing rated IP54 for durability.',
  },
  {
    icon: Timer,
    title: 'Automatic Locking',
    text: 'Arms re-lock after a 5-second timeout if no one passes through.',
  },
  {
    icon: Siren,
    title: 'Emergency Drop Arm',
    text: 'Arms drop automatically on power loss for fire-safe egress.',
  },
]

const SPECS = [
  '500 × 320 × 1000 mm',
  '35 people / min',
  'IP54 rated',
  '304 stainless steel',
  '3M-cycle mechanism',
]

function Callout({ item, side, index }) {
  // Left column points inward from the right edge; right column from the left.
  const fromLeft = side === 'left'
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`glass group relative rounded-2xl p-5 transition-colors duration-300 hover:border-accent-500/30 ${
        fromLeft ? 'lg:text-right' : 'lg:text-left'
      }`}
    >
      <div
        className={`flex items-start gap-3.5 ${
          fromLeft ? 'lg:flex-row-reverse lg:text-right' : ''
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/20 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-ink-950">
          <item.icon size={20} strokeWidth={1.8} />
        </span>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{item.text}</p>
        </div>
      </div>
      {/* Connector nub pointing toward the model (desktop only) */}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-accent-500/50 to-transparent lg:block ${
          fromLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full rotate-180'
        }`}
      />
    </motion.div>
  )
}

export default function HardwareSection() {
  const videoWrapRef = useRef(null)
  const inView = useInView(videoWrapRef, { once: true, margin: '-100px' })

  return (
    <section id="hardware" className="lazy-section relative py-24 sm:py-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent-500/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Turnstile Access Control"
            title="Secure Entry Without Slowing Members Down"
            description="The MT119-LED tripod turnstile provides controlled entry, clear LED access feedback and automatic locking after each member passes — built for staffed and unmanned gyms alike."
          />
        </div>

        {/* Annotated 3D layout: callouts left · model · callouts right */}
        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
          {/* Left callouts */}
          <div className="order-2 space-y-5 lg:order-1">
            {LEFT.map((item, i) => (
              <Callout key={item.title} item={item} side="left" index={i} />
            ))}
          </div>

          {/* Center: 3D product animation */}
          <motion.div
            ref={videoWrapRef}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative order-1 overflow-hidden rounded-3xl p-4 lg:order-2 sm:p-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,197,94,0.14),transparent_65%)]"
            />
            <span className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-ink-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/60 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
              MT119-LED
            </span>
            <video
              className="relative mx-auto max-h-[62vh] w-full object-contain"
              src="/video/tripod-3d.mp4"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'%3E%3Crect width='800' height='1000' fill='%230b0e0c'/%3E%3C/svg%3E"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="3D animation of the MT119-LED tripod turnstile"
            />
          </motion.div>

          {/* Right callouts */}
          <div className="order-3 space-y-5">
            {RIGHT.map((item, i) => (
              <Callout key={item.title} item={item} side="right" index={i} />
            ))}
          </div>
        </div>

        {/* Spec strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {SPECS.map((spec) => (
            <span
              key={spec}
              className="glass rounded-full px-4 py-2 text-xs font-medium text-white/70"
            >
              {spec}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
