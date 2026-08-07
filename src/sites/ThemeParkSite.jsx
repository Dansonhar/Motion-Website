import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Smartphone,
  MonitorSmartphone,
  CreditCard,
  Globe,
  Boxes,
  ScanLine,
  UtensilsCrossed,
  LineChart,
  ArrowRight,
} from 'lucide-react'
import ThemeParkHero from '../components/ThemeParkHero.jsx'

const BASE = import.meta.env.BASE_URL

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

// The four ticketing channels, each with its own looping clip.
const CHANNELS = [
  {
    id: 'app',
    src: 'channel-app.mp4',
    icon: Smartphone,
    step: '01',
    title: 'Mobile App',
    text: 'Guests buy and store tickets on their phone, then scan straight in at the gate.',
  },
  {
    id: 'kiosk',
    src: 'channel-kiosk.mp4',
    icon: MonitorSmartphone,
    step: '02',
    title: 'Self-Service Kiosk',
    text: 'On-site kiosks sell tickets and print passes in seconds — no queue at the counter.',
  },
  {
    id: 'pos',
    src: 'channel-pos.mp4',
    icon: CreditCard,
    step: '03',
    title: 'Counter POS',
    text: 'Staff sell, upgrade and redeem tickets at the counter on one connected terminal.',
  },
  {
    id: 'webstore',
    src: 'channel-webstore.mp4',
    icon: Globe,
    step: '04',
    title: 'Online Webstore',
    text: 'Visitors book online before they travel and arrive with a ready-to-scan QR code.',
  },
]

// What the four channels share once a ticket is sold — the reason they're one
// platform rather than four disconnected tills.
const CAPABILITIES = [
  {
    icon: Boxes,
    title: 'One Live Inventory',
    text: 'Every channel sells from the same stock of tickets and time slots. When the last slot for a session goes, it disappears from the app, the kiosk, the counter and the webstore at the same moment — so a session can never be oversold.',
  },
  {
    icon: ScanLine,
    title: 'One Gate, Every Ticket',
    text: 'A phone wallet pass, a printed kiosk ticket, a counter receipt and an online QR code all scan through the same reader. Guests walk straight in, and each ticket is checked and voided the instant it is used.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food, Retail and Add-Ons',
    text: 'The same terminals that sell entry also handle café orders, gift-shop purchases and in-park upgrades — one basket, one payment, one receipt, with no separate system to reconcile at the end of the day.',
  },
  {
    icon: LineChart,
    title: 'One AI Dashboard',
    text: 'Admissions, revenue and gate traffic land in a single live view. See which channel is selling, where guests are queueing and how the day is tracking — without exporting anything from four different tools.',
  },
]

// The journey the hero footage shows, as a continuously travelling marquee.
// Titles only — a `src` can be added per stage later to drop a clip into the card.
const JOURNEY = [
  { step: '01', title: 'Buy Anywhere' },
  { step: '02', title: 'Ticket Issued Instantly' },
  { step: '03', title: 'Scan and Walk In' },
  { step: '04', title: 'Everything Reconciles Itself' },
]

/* One marquee cell. Kept deliberately simple so a video can slot in above the
   title without changing the track maths. */
function JourneyCell({ stage }) {
  return (
    <div className="flex w-[300px] shrink-0 flex-col justify-center sm:w-[380px]">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.3em] text-accent-400">
          {stage.step}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <h3 className="mt-4 whitespace-nowrap text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {stage.title}
      </h3>
    </div>
  )
}

/* Infinite left-to-right marquee. The track holds two identical copies of the
   list, so animating x from -50% to 0 travels exactly one copy and loops with
   no visible seam. */
function JourneyMarquee({ reduced }) {
  if (reduced) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY.map((stage) => (
          <JourneyCell key={stage.step} stage={stage} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <motion.div
        className="flex w-max gap-10 sm:gap-16"
        animate={{ x: ['-50%', '0%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {[...JOURNEY, ...JOURNEY].map((stage, i) => (
          <JourneyCell key={`${stage.step}-${i}`} stage={stage} />
        ))}
      </motion.div>
    </div>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/* One channel box: a 16:9 clip that loops on its own, with the label below. */
function ChannelBox({ channel, index, reduced }) {
  const videoRef = useRef(null)

  // Autoplay can be refused (data saver, low power mode). Retry once the
  // element is in view so the row never sits on a frozen poster.
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduced) return
    const tryPlay = () => v.play().catch(() => {})
    tryPlay()
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && tryPlay()),
      { threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduced])

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl transition-colors duration-300 group-hover:border-accent-500/40">
        <video
          ref={videoRef}
          className="aspect-video w-full object-contain"
          src={`${BASE}video/themepark/${channel.src}`}
          poster={POSTER}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="auto"
          aria-label={`${channel.title} ticketing`}
        />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/80 backdrop-blur">
          {channel.step}
        </span>
      </div>

      <div className="mt-4 px-0.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25">
            <channel.icon size={16} strokeWidth={1.9} />
          </span>
          <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
            {channel.title}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{channel.text}</p>
      </div>
    </motion.article>
  )
}

// NOTE: keep this page free of `overflow-*` on the wrapper — `overflow-x: hidden`
// computes `overflow-y: auto`, making it a scroll container, which stops the
// hero's sticky stage from pinning to the viewport.
export default function ThemeParkSite() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative min-h-[100svh] w-full bg-ink-950">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#17181b_0%,#0b0b0c_55%,#050505_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(80% 60% at 50% 20%,#000 0%,transparent 100%)',
          WebkitMaskImage: 'radial-gradient(80% 60% at 50% 20%,#000 0%,transparent 100%)',
        }}
      />

      {/* Long scroll-scrubbed banner, same rig as the Gym hero. */}
      <ThemeParkHero />

      <div
        id="park-channels"
        className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-300">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Theme Park Ticketing
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Four Ways to
            <br />
            <span className="text-accent-400">Buy a Ticket</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            App, kiosk, counter POS or online webstore — every channel sells from
            the same live inventory and scans through the same gate.
          </p>
        </motion.header>

        {/* All four clips play together. One row from md up; 2×2 on phones so
            each clip stays big enough to actually read. */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-5 lg:mt-16 lg:gap-6">
          {CHANNELS.map((channel, i) => (
            <ChannelBox key={channel.id} channel={channel} index={i} reduced={reduced} />
          ))}
        </div>

        {/* ---- what the four channels share ---- */}
        <div className="mt-24 border-t border-white/8 pt-16 sm:mt-28 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">
              Four channels, one platform
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              They all sell from the same system.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60">
              The four channels above are not four separate tills. They share one
              inventory, one gate and one set of numbers — which is what keeps a
              busy park from double-selling a slot or closing the day on four
              conflicting reports.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap, i) => (
              <motion.article
                key={cap.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass rounded-2xl p-6 transition-colors duration-300 hover:border-accent-500/30"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25">
                  <cap.icon size={19} strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                  {cap.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">
                  {cap.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* ---- the guest journey, end to end ---- */}
        <div className="mt-24 border-t border-white/8 pt-16 sm:mt-28 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">
              From purchase to gate
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              How a visit actually runs.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60">
              Whichever channel the guest starts in, the rest of the journey is
              identical — and every step is recorded against the same ticket.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mt-14"
          >
            <JourneyMarquee reduced={reduced} />
          </motion.div>
        </div>

        {/* ---- closing ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass mt-24 rounded-3xl px-8 py-12 text-center sm:mt-28 sm:px-14 sm:py-16"
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Sell everywhere. Manage it in one place.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60">
            We can map the setup to your park — how many gates, which channels
            you want live first, and what the day should look like on the
            dashboard.
          </p>
          <a
            href="#top"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03]"
          >
            Talk to us
            <ArrowRight size={16} strokeWidth={2.4} />
          </a>
        </motion.div>
      </div>
    </div>
  )
}
