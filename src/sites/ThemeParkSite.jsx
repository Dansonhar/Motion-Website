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
const JOURNEY = [
  { step: '01', title: 'Buy Anywhere', img: 'journey-1-buy.jpg' },
  { step: '02', title: 'Ticket Issued Instantly', img: 'journey-2-issued.jpg' },
  { step: '03', title: 'Scan and Walk In', img: 'journey-3-scan.jpg' },
  { step: '04', title: 'Everything Reconciles Itself', img: 'journey-4-dashboard.jpg' },
]

/* One marquee cell: image above, step + title below. Fixed width so the track
   maths stay predictable; the source images differ in aspect so the frame is
   locked to 4:3 and cropped to fill. */
function JourneyCell({ stage }) {
  return (
    <figure className="flex w-[260px] shrink-0 flex-col sm:w-[340px] lg:w-[400px]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
        <img
          src={`${BASE}images/themepark/${stage.img}`}
          alt={stage.title}
          loading="lazy"
          draggable="false"
          className="aspect-[4/3] w-full select-none object-cover"
        />
      </div>
      <figcaption className="mt-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent-400">
            {stage.step}
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        {/* wraps rather than nowrap — a long title would otherwise spill out of
            the fixed-width cell and collide with the next one */}
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
          {stage.title}
        </h3>
      </figcaption>
    </figure>
  )
}

/* Infinite right-to-left marquee that the visitor can also scrub by hand.

   Built on a real overflow-x scroller rather than a keyframe animation: a
   keyframe can't be grabbed mid-flight and resumed from wherever the user let
   go, but `scrollLeft` can. A rAF loop nudges scrollLeft forward each frame —
   increasing scrollLeft reveals content further right, so the cards travel
   leftwards (right-to-left).

   Manual control comes free on touch and trackpad; a pointer-drag handler adds
   it for mouse. Any interaction parks the autoplay, which restarts RESUME_MS
   after the visitor stops.

   Three identical copies are rendered so there is always a full copy of
   headroom either side of the visible window; the loop keeps scrollLeft inside
   the middle copy, and because the copies are identical, wrapping by exactly
   one period is invisible.

   Card order is plain JOURNEY order: reading left-to-right the steps run
   01→04, and because new cards enter from the RIGHT they also *arrive* 01→04.
   Both readings ascend, so no reversal is needed. */
const SPEED = 65 // px per second
const RESUME_MS = 1200

function JourneyMarquee({ reduced }) {
  const scrollerRef = useRef(null)
  const pausedUntilRef = useRef(0)
  const dragRef = useRef(null)
  const [grabbing, setGrabbing] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || reduced) return

    // Exact loop period: the gap sits *between* every card, so scrollWidth/3
    // would be short by a third of a gap and drift. Measure it off the DOM.
    let period = 0
    const measure = () => {
      const kids = el.children
      period = kids[JOURNEY.length]
        ? kids[JOURNEY.length].offsetLeft - kids[0].offsetLeft
        : 0
      // Park in the middle copy so there's room to drag backwards.
      if (period && el.scrollLeft < period) el.scrollLeft = period
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    let last = performance.now()
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05) // clamp after tab-away
      last = now
      if (!dragRef.current && now >= pausedUntilRef.current) {
        el.scrollLeft += SPEED * dt
      }
      if (period > 0) {
        if (el.scrollLeft >= period * 2) el.scrollLeft -= period
        else if (el.scrollLeft < period) el.scrollLeft += period
      }
      raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])

  const hold = () => {
    pausedUntilRef.current = Infinity
  }
  const release = () => {
    pausedUntilRef.current = performance.now() + RESUME_MS
  }

  const onPointerDown = (e) => {
    hold()
    if (e.pointerType !== 'mouse') return // touch scrolls natively
    dragRef.current = { x: e.clientX, left: scrollerRef.current.scrollLeft }
    scrollerRef.current.setPointerCapture(e.pointerId)
    setGrabbing(true)
  }
  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag) return
    scrollerRef.current.scrollLeft = drag.left - (e.clientX - drag.x)
  }
  const onPointerUp = () => {
    dragRef.current = null
    setGrabbing(false)
    release()
  }
  // Only a sideways wheel/trackpad gesture counts as scrubbing — plain vertical
  // page scrolling over the row shouldn't stall the loop.
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) release()
  }

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
    <div
      ref={scrollerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={hold}
      onTouchEnd={release}
      onWheel={onWheel}
      className={`flex gap-10 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [scrollbar-width:none] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [&::-webkit-scrollbar]:hidden sm:gap-16 ${
        grabbing ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {[...JOURNEY, ...JOURNEY, ...JOURNEY].map((stage, i) => (
        <JourneyCell key={`${stage.step}-${i}`} stage={stage} />
      ))}
    </div>
  )
}

// Grounded in what the kiosk footage actually shows — the tile menu, the card
// terminal and NFC pad, the authorising screen and the ticket coming out.
const KIOSK_FEATURES = [
  {
    title: 'Sells More Than Entry',
    text: 'Day passes, fast passes, family bundles, locker rental, food vouchers and park maps all sit on one menu, so a guest can arrange the whole visit before they walk in.',
  },
  {
    title: 'Every Way to Pay',
    text: 'A certified card terminal handles chip and PIN, while the contactless pad on the front takes tap cards and phone wallets.',
  },
  {
    title: 'Ticket Printed on the Spot',
    text: 'Payment clears and the pass prints from the slot below within seconds — a scannable QR the guest can carry straight to the gate.',
  },
  {
    title: 'Built for the Entrance Plaza',
    text: 'A sealed outdoor-rated body that stands in the queue line itself, so arrivals buy where they land instead of doubling back to a counter.',
  },
]

// Grounded in what the turnstile footage actually shows — the terminal on the
// mast, the scan pad on the top panel, the LED strip and the tripod arms.
const GATE_FEATURES = [
  {
    title: 'Terminal on the Mast',
    text: 'A screen at eye level guides the guest and reads face or QR at standing height, so nobody has to crouch or hunt for the reader.',
  },
  {
    title: 'Contactless Scan Pad',
    text: 'A second reader sits flat on the top panel for wallet passes and printed QR tickets — hold it over the pad and walk.',
  },
  {
    title: 'Status You Can See Down the Queue',
    text: 'A full-length LED strip runs the height of the column and around the top edge. Green for open, so guests pick a free lane before they reach it.',
  },
  {
    title: 'Tripod Arms, Weatherproof Body',
    text: 'Three arms release one guest per rotation and the powder-coated body is built to sit outdoors under a canopy all season.',
  },
]

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

/* Autoplay can be refused (data saver, low power mode). Retry once the element
   is in view so a clip never sits on a frozen poster. */
function useAutoplay(reduced) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
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
  return ref
}

/* One channel box: a 16:9 clip that loops on its own, with the label below. */
function ChannelBox({ channel, index, reduced }) {
  const videoRef = useAutoplay(reduced)

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

/* A piece of hardware: looping clip on one side, feature list on the other.
   `flip` alternates which side the clip lands on so consecutive blocks don't
   read as the same slab twice. */
function HardwareBlock({
  id,
  eyebrow,
  title,
  lead,
  features,
  video,
  poster,
  alt,
  flip = false,
  reduced,
}) {
  const videoRef = useAutoplay(reduced)

  return (
    <div
      id={id}
      className="mt-24 scroll-mt-24 border-t border-white/8 pt-16 sm:mt-28 sm:pt-20"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={flip ? 'lg:order-2' : ''}
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60">
            {lead}
          </p>

          <ul className="mt-8 space-y-6">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {f.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 16:9 clip in a 16:9 frame — full width, no crop, no letterbox, and
            nothing printed on the kiosk screens gets clipped. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl ${
            flip ? 'lg:order-1' : ''
          }`}
        >
          <video
            ref={videoRef}
            className="aspect-video w-full object-contain"
            src={`${BASE}video/themepark/${video}`}
            poster={`${BASE}video/themepark/${poster}`}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
            aria-label={alt}
          />
        </motion.div>
      </div>
    </div>
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

        {/* ---- the hardware, in the order a guest meets it ---- */}
        <HardwareBlock
          id="park-kiosk"
          eyebrow="At the entrance"
          title={<>The kiosk that sells<br />the whole visit.</>}
          lead="Guests who arrive without a ticket buy one where they are standing. Tickets, passes, lockers and food vouchers on one menu, paid for and printed in under a minute."
          features={KIOSK_FEATURES}
          video="kiosk.mp4"
          poster="kiosk-poster.jpg"
          alt="Self-service ticketing kiosk at a theme park entrance"
          reduced={reduced}
        />

        <HardwareBlock
          id="park-gates"
          eyebrow="At the gate"
          title={<>The turnstile every<br />ticket ends up at.</>}
          lead="Whichever channel sold the ticket, this is where it gets read. One tripod lane handles face, wallet pass and printed QR, and reports every entry back to the same dashboard."
          features={GATE_FEATURES}
          video="turnstile.mp4"
          poster="turnstile-poster.jpg"
          alt="Tripod turnstile at a theme park entrance"
          flip
          reduced={reduced}
        />

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
