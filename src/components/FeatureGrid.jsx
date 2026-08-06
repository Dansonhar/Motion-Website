import { motion } from 'framer-motion'
import {
  ScanFace,
  UserPlus,
  RefreshCw,
  QrCode,
  CalendarCheck,
  ShoppingBag,
  CreditCard,
  Printer,
} from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const FEATURES = [
  {
    icon: ScanFace,
    title: 'Face Enrolment',
    description: 'Members capture their face once and it becomes their key — nothing to carry or lose.',
  },
  {
    icon: UserPlus,
    title: 'Member Registration',
    description: 'New members sign up on-screen in minutes — no queue, no paperwork.',
  },
  {
    icon: RefreshCw,
    title: 'Membership Renewal',
    description: 'Renew plans instantly with saved member profiles and clear pricing.',
  },
  {
    icon: CreditCard,
    title: 'Card Payments',
    description: 'Secure integrated card terminal for memberships, classes and products.',
  },
  {
    icon: QrCode,
    title: 'QR & NFC Fallback',
    description: 'Guests, day passes and staff can still enter by scan or card tap.',
  },
  {
    icon: CalendarCheck,
    title: 'Class Booking',
    description: 'Browse the timetable and reserve classes directly at the kiosk.',
  },
  {
    icon: ShoppingBag,
    title: 'Product Purchases',
    description: 'Sell drinks, gear and supplements through the same self-service flow.',
  },
  {
    icon: Printer,
    title: 'Receipt Printing',
    description: 'Built-in thermal printer issues receipts and confirmations on the spot.',
  },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="lazy-section relative py-24 sm:py-32">
      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-500/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Kiosk Features"
          title="Everything Members Need, Self-Served"
          description="The membership kiosk handles the full front-desk journey — sign-up, face enrolment, payments and bookings — on one screen."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: (index % 4) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="glass group rounded-2xl p-6 transition-colors duration-300 hover:border-accent-500/30"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/20 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-ink-950">
                <feature.icon size={22} strokeWidth={1.8} />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
