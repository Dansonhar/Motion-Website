import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  LayoutDashboard,
  Monitor,
  QrCode,
  ScanLine,
  Smartphone,
  Store,
  Tablet,
} from 'lucide-react'
import { useAttraction } from '../attractions.jsx'
import ScrollVideo from '../motion/ScrollVideo.jsx'
import { EASE, ScrollCue, StepRail, StickyStage, Swap } from '../motion/StickyStage.jsx'
import { usePrefersReducedMotion, useSimpleMotion } from '../motion/env.js'
import { Device } from '../product/atoms.jsx'
import { ProductScreen } from '../product/screens.jsx'
import { Display, Eyebrow, Reveal, SectionShell } from '../components/solution/SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   QBot — the product page for QPOS.

   REBUILT AS A MOTION EXPERIENCE. The previous version was ~600 words across
   eight card-grid sections and showed nothing: no media, no scroll rig, no
   interaction, and QHub — which is the thing that makes six channels a platform
   rather than six tills — existed only as a string in a list.

   The page is now three demonstrations and a decision:

     1. ONE OPERATION   six channels appear and wire themselves back to QHub as
                        you scroll. The ecosystem is the animation.
     2. THREE MODES     one device morphs counter → handheld → kiosk. The
                        3-in-1 claim is made by the object changing shape.
     3. QHUB            the camera pushes past the floor into the back office.
                        The control centre is arrived at, not described.
     4. WHAT YOU RUN    the visitor ticks modules on and off themselves.

   Every claim is still from qbot.now, compressed but never inflated. No metrics
   appear because the source publishes none.

   NOTE: no `overflow-*` on the wrapper — `overflow-x: hidden` computes
   `overflow-y: auto` and silently breaks every sticky stage below it.
   --------------------------------------------------------------------------- */

/* Six channels on a ring around QHub. Positions are derived, not authored: the
   ring is drawn in a square box on a 0–100 viewBox, so a percentage coordinate
   is the same in the SVG and in the HTML layer stacked over it. Change the
   count and the ring re-spaces itself. */
const RADIUS = 37
const CHANNELS = [
  { id: 'pos', n: '01', name: 'POS', line: 'Your front counter.', icon: Monitor, screen: 'pos' },
  { id: 'mpos', n: '02', name: 'mPOS', line: 'Your floor and queue.', icon: Smartphone, screen: 'pos' },
  { id: 'kiosk', n: '03', name: 'Kiosk', line: 'Your self-service station.', icon: ScanLine, screen: 'kiosk' },
  { id: 'tablet', n: '04', name: 'Tablet', line: 'Right where they are.', icon: Tablet, screen: 'booking' },
  { id: 'qr', n: '05', name: 'QR Order', line: 'Their phone. Self-checkout.', icon: QrCode, screen: 'qr' },
  { id: 'web', n: '06', name: 'Webstore', line: 'Your online store. No middleman.', icon: Store, screen: 'webstore' },
].map((c, i, arr) => {
  const a = ((-90 + (360 / arr.length) * i) * Math.PI) / 180
  return { ...c, x: 50 + RADIUS * Math.cos(a), y: 50 + RADIUS * Math.sin(a) }
})

/* The channels plus the step where they all resolve into one system. */
const OPERATION_STEPS = [
  ...CHANNELS.map((c) => ({ id: c.id, title: c.name, line: c.line })),
  {
    id: 'hub',
    title: 'One operation',
    line: 'Every channel reporting into QHub.',
  },
]

/* The 3-in-1, told as a day. One purchase doing three jobs at three times —
   which is the argument, and it is made by the device changing shape. */
const MODES = [
  { id: 'counter', when: 'Morning', title: 'Counter POS', line: 'Docked at the till.', device: 'counter', screen: 'pos', screenTitle: 'Counter POS' },
  { id: 'handheld', when: 'Lunch', title: 'Mobile POS', line: 'Undocked, on the floor.', device: 'handheld', screen: 'pos', screenTitle: 'Mobile POS' },
  { id: 'kiosk', when: 'Night', title: 'Self-service', line: 'Wall-mounted. Serves itself.', device: 'kiosk', screen: 'kiosk' },
]

/* What feeds QHub. Named, not explained — the dashboard on screen beside them
   is the explanation. */
const FEEDS = ['Sales', 'Members', 'Bookings', 'Staff', 'Products', 'Marketing', 'Reporting']

/* 14 modules in the source site's own four groups. Rendered as togglable
   because "tick what you need, untick what you don't" is their claim, and a
   claim about configurability is better handed to the visitor than written. */
const MODULE_GROUPS = [
  { group: 'Sell', items: ['POS', 'mPOS', 'Kiosk', 'Webstore', 'Tablet', 'QR Order'] },
  { group: 'Manage', items: ['QHub', 'Inventory', 'Loyalty'] },
  { group: 'Operate', items: ['Kitchen Display', 'QMS', 'Live Display'] },
  { group: 'Grow', items: ['Sales Boosters', 'AI Insights'] },
]
/* QHub is not optional — it is the thing every other module reports into, so it
   cannot be switched off. Locking it here is the point being made. */
const LOCKED = new Set(['QHub'])
const ALL_MODULES = MODULE_GROUPS.flatMap((g) => g.items)

const HARDWARE = [
  { n: '01', name: 'QBOT V3 MIX', line: 'Counter, mobile and kiosk — three modes in one device.' },
  { n: '02', name: 'QBOT D3 PRO', line: '15.6" FHD desktop POS with optional dual display.' },
  { n: '03', name: 'K2 KIOSK', line: 'Self-service kiosk for high-traffic ordering. 21" or 27".' },
]

export default function QbotSite() {
  return (
    <div className="min-h-[100svh] w-full bg-ink-950">
      <main>
        <QbotHero />
        <OneOperation />
        <ThreeModes />
        <InServiceSection />
        <QHubSection />
        <ModulesSection />
        <HardwareSection />
        <FamilySection />
        <DemoCTA />
      </main>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Hero. The film is a montage of the six channels in real venues — a retail
   counter, a tablet at a hotel table, a bowling alley, a gym kiosk, a QR menu,
   a webstore on a laptop — which is the headline's own claim made visually
   before it is read.

   AUTOPLAY, SO MUTED AND STRIPPED. This is the one film on the page with no
   sound toggle: it is wallpaper behind type, not something anyone chooses to
   watch, so the audio track was removed at encode rather than muted at runtime.

   `preload="auto"` and the `autoPlay` attribute are BOTH correct here and only
   here — it is above the fold, so there is nothing to lazy-load for. Every
   other film on the page is `preload="none"` and started from script.

   NOT DIMMED AS A WHOLE. Standing feedback across this site is that a flat wash
   reads "too dark", so legibility comes from a directional scrim under the copy
   column plus text-shadow on the type. The right of frame stays at full
   brightness, which is where most of these shots put their subject.
   --------------------------------------------------------------------------- */
function QbotHero() {
  const reduced = usePrefersReducedMotion()
  const base = import.meta.env.BASE_URL

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[92svh] w-full items-center overflow-hidden px-6 pb-20 pt-32 sm:px-10 sm:pb-24 sm:pt-40"
    >
      <video
        src={`${base}video/qbot/hero.mp4`}
        poster={`${base}images/qbot/hero-poster.jpg`}
        muted
        loop
        playsInline
        preload="auto"
        autoPlay={!reduced}
        aria-hidden
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full select-none object-cover"
      />

      {/* Directional, not a full-frame dim — transparent by mid-frame. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/20" />
      {/* Seam into the section below, so the film resolves rather than stopping. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-ink-950 to-transparent" />
      {/* Phones get more cover: the copy sits over a 16:9 frame cropped hard by
          a portrait viewport, so the side scrim alone does not carry it. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-ink-950/35 sm:hidden" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-30%] -top-1/3 -z-10 h-[900px] rounded-[50%] border-t border-white/10 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-[1500px] [text-shadow:0_1px_3px_rgba(0,0,0,0.9),0_3px_12px_rgba(0,0,0,0.75),0_10px_40px_rgba(0,0,0,0.6)]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="mb-8 text-xs font-semibold uppercase tracking-widest text-accent-400"
        >
          QPOS — All-in-One POS
        </motion.p>

        <h1 className="max-w-[16ch] text-[clamp(2.6rem,7vw,6.4rem)] leading-[0.94] font-bold tracking-tight text-white">
          {['SIX WAYS TO SELL.', 'ONE OPERATION.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.12, ease: EASE }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
          className="mt-9 max-w-xl text-[clamp(1.05rem,1.3vw,1.35rem)] leading-snug text-white/75"
        >
          Switch on the channels you need. Add the rest when you’re ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
        >
          <a
            href="#demo"
            className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 [text-shadow:none] shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
          >
            Book a Demo
          </a>
          <a
            href="#operation"
            className="glass rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            See it connect
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   ONE OPERATION — the ecosystem, built by scrolling.

   Channels appear one per step and wire themselves back to QHub. On the last
   step the whole ring is live. No paragraph explains the platform because the
   diagram assembling itself is the explanation.
   --------------------------------------------------------------------------- */
function OneOperation() {
  return (
    <StickyStage
      id="operation"
      label="One operation"
      count={OPERATION_STEPS.length}
      vhPerStep={85}
      className="border-y border-white/10 bg-ink-900"
      fallback={<OperationStacked />}
    >
      {({ index, seek, progress }) => {
        const step = OPERATION_STEPS[index]
        const complete = index === OPERATION_STEPS.length - 1
        return (
          <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Everything connected</Eyebrow>

              <div className="mt-8 min-h-[12rem]">
                <Swap id={step.id}>
                  <h2 className="max-w-[12ch] text-[clamp(2.2rem,4vw,4rem)] leading-[1] font-bold tracking-tight text-white">
                    {step.title}
                  </h2>
                  <p className="mt-5 max-w-sm text-[clamp(1rem,1.15vw,1.15rem)] leading-snug text-white/60">
                    {step.line}
                  </p>
                </Swap>
              </div>

              <StepRail
                steps={OPERATION_STEPS}
                index={index}
                onSeek={seek}
                className="mt-10 max-w-lg"
              />
            </div>

            <div className="flex items-center justify-center lg:col-span-6 lg:col-start-7">
              <OperationRing lit={index} complete={complete} />
            </div>

            <ScrollCue progress={progress} />
          </div>
        )
      }}
    </StickyStage>
  )
}

/* The ring. An SVG carries the connectors (so they can draw themselves) and an
   HTML layer carries the nodes (so they can hold real icons and text). Both use
   the same percentage coordinates and the box is square, so the two layers line
   up exactly at any size. */
function OperationRing({ lit, complete }) {
  return (
    <div className="relative aspect-square w-full max-w-[min(62svh,560px)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* the ring itself, faint */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.25"
        />
        {CHANNELS.map((c, i) => {
          const on = i <= lit
          return (
            <motion.line
              key={c.id}
              x1={c.x}
              y1={c.y}
              x2="50"
              y2="50"
              stroke={complete ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.32)'}
              strokeWidth="0.35"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.65, ease: EASE }}
            />
          )
        })}
      </svg>

      {/* QHub at the centre. It only lights once something is feeding it. */}
      <motion.div
        animate={{
          scale: complete ? 1.06 : 1,
          borderColor: complete ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)',
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute left-1/2 top-1/2 flex size-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-2xl border bg-ink-950 text-white"
      >
        <LayoutDashboard className="size-[18%] min-h-4 min-w-4" strokeWidth={1.6} aria-hidden />
        <span className="text-[clamp(0.6rem,1.4vw,0.8rem)] font-bold uppercase tracking-widest">
          QHub
        </span>
      </motion.div>

      {CHANNELS.map((c, i) => {
        const on = i <= lit
        const Icon = c.icon
        return (
          <motion.div
            key={c.id}
            initial={false}
            animate={{ opacity: on ? 1 : 0.16, scale: on ? 1 : 0.86 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
          >
            <span
              className={`grid size-[clamp(2.5rem,7vw,3.5rem)] place-items-center rounded-full border transition-colors duration-500 ${
                on ? 'border-white/45 bg-ink-950 text-white' : 'border-white/12 bg-ink-950 text-white/40'
              }`}
            >
              <Icon className="size-[45%]" strokeWidth={1.7} aria-hidden />
            </span>
            <span
              className={`whitespace-nowrap text-[clamp(0.6rem,1.1vw,0.75rem)] font-semibold transition-colors duration-500 ${
                on ? 'text-white' : 'text-white/35'
              }`}
            >
              {c.name}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

/* Phones and reduced motion: the ring is shown complete, with the channels as a
   plain list. The relationship still reads; only the assembly is dropped. */
function OperationStacked() {
  return (
    <div className="px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Eyebrow>Everything connected</Eyebrow>
        <Display className="mt-6 max-w-[12ch]">Six ways to sell. One operation.</Display>

        <div className="mx-auto mt-12 w-full max-w-sm">
          <OperationRing lit={CHANNELS.length - 1} complete />
        </div>

        <ul className="mt-12 border-t border-white/10">
          {CHANNELS.map((c) => {
            const Icon = c.icon
            return (
              <li key={c.id} className="flex items-center gap-5 border-b border-white/10 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white">
                  <Icon className="size-[17px]" strokeWidth={1.7} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[1.05rem] font-bold tracking-tight text-white">
                    {c.name}
                  </span>
                  <span className="block text-[0.88rem] text-white/55">{c.line}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   THREE MODES — the 3-in-1 device, demonstrated by morphing.
   --------------------------------------------------------------------------- */
function ThreeModes() {
  return (
    <StickyStage
      id="device"
      label="One device, three modes"
      count={MODES.length}
      vhPerStep={100}
      className="border-b border-white/10"
      fallback={<ModesStacked />}
    >
      {({ index, seek }) => {
        const mode = MODES[index]
        return (
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>QBOT V3 MIX</Eyebrow>
              <h2 className="mt-8 max-w-[11ch] text-[clamp(2.2rem,4vw,4rem)] leading-[1] font-bold tracking-tight text-white">
                One device. Three modes.
              </h2>

              <div className="mt-9 min-h-[8rem]">
                <Swap id={mode.id}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                    {mode.when}
                  </p>
                  <p className="mt-3 text-[clamp(1.4rem,2.4vw,2.2rem)] leading-tight font-bold tracking-tight text-white">
                    {mode.title}
                  </p>
                  <p className="mt-3 text-[1rem] leading-snug text-white/60">{mode.line}</p>
                </Swap>
              </div>

              <StepRail steps={MODES} index={index} onSeek={seek} className="mt-10 max-w-sm" />
            </div>

            {/* Keyed on the MODE, not the screen — counter and handheld run the
                same till, so keying on `screen` would hold one instance across
                the morph and the header would swap labels without the screen
                ever re-entering. */}
            <div className="h-[46svh] sm:h-[54svh] lg:col-span-6 lg:col-start-7 lg:h-[64svh]">
              <Device kind={mode.device}>
                <Swap id={mode.id} y={10} duration={0.42} className="h-full">
                  <ProductScreen name={mode.screen} title={mode.screenTitle} />
                </Swap>
              </Device>
            </div>
          </div>
        )
      }}
    </StickyStage>
  )
}

function ModesStacked() {
  return (
    <div className="px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Eyebrow>QBOT V3 MIX</Eyebrow>
        <Display className="mt-6 max-w-[12ch]">One device. Three modes.</Display>
        <ol className="mt-12 space-y-12">
          {MODES.map((m) => (
            <li key={m.id}>
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                  {m.when}
                </p>
                <h3 className="mt-3 text-[1.6rem] font-bold tracking-tight text-white">{m.title}</h3>
                <p className="mt-2 text-[0.95rem] text-white/60">{m.line}</p>
                <div className="mt-6 h-[48svh]">
                  <Device kind={m.device}>
                    <ProductScreen name={m.screen} title={m.screenTitle} />
                  </Device>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   IN SERVICE — the footage.

   Sits directly after the device morph on purpose. That stage argues the 3-in-1
   with a rendered object changing shape; this is the same product happening in
   real venues, so the claim lands twice — once as a diagram, once as evidence.

   Scroll-driven, not click-to-play. The films start as the visitor reaches
   them, open from the centre, and drift against the page while they are on
   screen — see ScrollVideo for the four moves and why each one is shaped the
   way it is.

   MUTED BY NECESSITY. No browser autoplays audio, so an unmuted autoplay would
   simply never start. Both files keep their audio track and the frame offers a
   speaker toggle, which unmutes on a real click — the one moment sound is
   permitted.

   Full-width frames stacked, not a two-up grid. At half width these read as
   thumbnails; the whole point of footage on a page like this is scale.

   A `film` set to null renders as a quiet placeholder frame, so a third mode
   can be added here before its footage exists.
   --------------------------------------------------------------------------- */
const IN_SERVICE = [
  {
    id: 'mpos',
    mode: 'Mobile POS',
    film: 'mpos.mp4',
    poster: 'mpos-poster.jpg',
    caption: 'Poolside table service — the order taken where the guest is sitting.',
  },
  {
    id: 'kiosk',
    mode: 'Self-service Kiosk',
    film: 'kiosk.mp4',
    poster: 'kiosk-poster.jpg',
    caption: 'Sign-up at the kiosk — plan chosen, tapped to pay, receipt printed.',
  },
  {
    id: 'webstore',
    mode: 'Webstore',
    film: 'webstore.mp4',
    poster: 'webstore-poster.jpg',
    caption: 'Browsing and buying online — the same catalogue, no middleman.',
  },
]

function InServiceSection() {
  const base = import.meta.env.BASE_URL
  return (
    <SectionShell id="in-service" label="The device in service">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>In service</Eyebrow>
            <Display className="mt-7 max-w-[12ch]">Same device. Real floor.</Display>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.12}>
            <p className="text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/70">
              Three of the six channels above, running in a live venue.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-14 space-y-16 sm:mt-20 sm:space-y-24">
        {IN_SERVICE.map((v, i) => (
          <figure key={v.id}>
            {/* Number and mode ride ABOVE the frame so the curtain opens on an
                uninterrupted picture — a heading underneath would land after
                the reveal and read as an afterthought. */}
            <Reveal>
              <div className="mb-6 flex items-baseline gap-5 sm:mb-8 sm:gap-7">
                <span className="text-sm font-semibold tracking-widest text-accent-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[clamp(1.3rem,2.2vw,2rem)] font-bold tracking-tight text-white">
                  {v.mode}
                </h3>
                <span className="hidden h-px flex-1 bg-white/10 sm:block" />
              </div>
            </Reveal>

            <ScrollVideo
              ratio="wide"
              src={v.film ? `${base}video/qbot/${v.film}` : undefined}
              poster={v.poster ? `${base}images/qbot/${v.poster}` : undefined}
              label={v.mode}
              caption={v.caption}
            />
          </figure>
        ))}
      </div>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   QHUB — the push-in.

   The floor recedes and blurs while the back office rises to fill the frame.
   Deliberately a different move from the ring above: that one assembles, this
   one travels. Same subject seen from two distances.
   --------------------------------------------------------------------------- */
function QHubSection() {
  const { simple } = useSimpleMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const floorScale = useTransform(scrollYProgress, [0, 0.62], [1, 1.7])
  const floorOpacity = useTransform(scrollYProgress, [0.18, 0.55], [1, 0])
  const floorBlur = useTransform(scrollYProgress, [0.18, 0.55], ['blur(0px)', 'blur(14px)'])

  const hubScale = useTransform(scrollYProgress, [0.32, 0.85], [0.72, 1])
  const hubOpacity = useTransform(scrollYProgress, [0.32, 0.6], [0, 1])
  const capOpacity = useTransform(scrollYProgress, [0.7, 0.92], [0, 1])

  if (simple) {
    return (
      <SectionShell id="qhub" label="QHub" className="bg-ink-900">
        <Reveal>
          <Eyebrow>QHub</Eyebrow>
          <Display className="mt-7 max-w-[14ch]">Everything behind your business. One place.</Display>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 h-[56svh]">
            <Device kind="desktop">
              <ProductScreen name="qhub" />
            </Device>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {FEEDS.map((f) => (
              <li
                key={f}
                className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[0.85rem] text-white/70"
              >
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </SectionShell>
    )
  }

  return (
    <section
      id="qhub"
      aria-label="QHub"
      ref={ref}
      className="relative h-[300vh] border-b border-white/10 bg-ink-900"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden px-6 sm:px-10">
        {/* The floor: the operation as the customer meets it. It pushes past
            the camera and blurs out. */}
        <motion.div
          style={{ scale: floorScale, opacity: floorOpacity, filter: floorBlur }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-5 px-6 sm:gap-10 sm:px-10"
        >
          {['pos', 'kiosk', 'qr'].map((s) => (
            <div key={s} className="h-[34svh] w-full max-w-[280px]">
              <Device kind="counter">
                <ProductScreen name={s} />
              </Device>
            </div>
          ))}
        </motion.div>

        {/* The back office, arriving. */}
        <motion.div
          style={{ scale: hubScale, opacity: hubOpacity }}
          className="relative flex h-[62svh] w-full max-w-[1100px] items-center justify-center"
        >
          <Device kind="desktop">
            <ProductScreen name="qhub" />
          </Device>
        </motion.div>

        <motion.div
          style={{ opacity: capOpacity }}
          className="pointer-events-none absolute inset-x-6 bottom-10 text-center sm:inset-x-10 sm:bottom-14"
        >
          <p className="text-[clamp(1.4rem,3.4vw,2.8rem)] leading-tight font-bold tracking-tight text-white">
            Everything behind your business. One place.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {FEEDS.map((f) => (
              <li
                key={f}
                className="rounded-full border border-white/15 bg-ink-950/70 px-3.5 py-1.5 text-[0.78rem] text-white/70 backdrop-blur-sm"
              >
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   WHAT YOU RUN — the configurability claim, handed to the visitor.
   --------------------------------------------------------------------------- */
function ModulesSection() {
  const [on, setOn] = useState(() => new Set(ALL_MODULES))

  const toggle = (item) => {
    if (LOCKED.has(item)) return
    setOn((prev) => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  return (
    <SectionShell id="modules" label="What you run">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Fourteen modules</Eyebrow>
            <Display className="mt-7 max-w-[16ch]">Tick what you need. Untick what you don’t.</Display>
          </Reveal>
        </div>
        <div className="flex items-end lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.1}>
            <p className="text-[clamp(2.6rem,6vw,4.5rem)] font-bold leading-none tabular-nums tracking-tight text-white">
              {on.size}
              <span className="text-white/30">/{ALL_MODULES.length}</span>
            </p>
            <p className="mt-2 text-[0.85rem] text-white/45">switched on</p>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {MODULE_GROUPS.map((g, gi) => (
          <Reveal key={g.group} delay={gi * 0.07}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-400">
              {g.group}
            </p>
            <ul className="mt-5 space-y-2">
              {g.items.map((item) => {
                const active = on.has(item)
                const locked = LOCKED.has(item)
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      disabled={locked}
                      aria-pressed={active}
                      className={`group flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-300 ${
                        active
                          ? 'border-white/25 bg-white/[0.06] text-white'
                          : 'border-white/8 bg-transparent text-white/35 hover:border-white/20 hover:text-white/60'
                      } ${locked ? 'cursor-default' : ''}`}
                    >
                      <span
                        className={`grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors duration-300 ${
                          active ? 'border-white bg-white' : 'border-white/25 bg-transparent'
                        }`}
                      >
                        <motion.svg
                          viewBox="0 0 12 12"
                          className="size-2.5"
                          initial={false}
                          animate={{ opacity: active ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          aria-hidden
                        >
                          <path
                            d="M2 6.4 4.6 9 10 3.2"
                            fill="none"
                            stroke="#060807"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[0.92rem] font-medium">
                        {item}
                      </span>
                      {locked && (
                        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-white/35">
                          Core
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}

/* --------------------------------------------------------------------------- */
function HardwareSection() {
  return (
    <SectionShell id="hardware" label="Hardware" className="bg-ink-900">
      <Reveal>
        <Eyebrow>Hardware</Eyebrow>
        <Display className="mt-7 max-w-[14ch]">Built for your space.</Display>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 border-t border-white/10 sm:mt-16 md:grid-cols-3">
        {HARDWARE.map((h, i) => (
          <Reveal
            key={h.name}
            delay={i * 0.08}
            className={`border-b border-white/10 py-10 sm:py-12 ${
              i > 0 ? 'md:border-l md:pl-10' : ''
            } ${i < HARDWARE.length - 1 ? 'md:pr-10' : ''}`}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm font-semibold tracking-widest text-accent-400">{h.n}</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="mt-6 text-[clamp(1.2rem,1.7vw,1.55rem)] font-bold tracking-tight text-white">
              {h.name}
            </h3>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{h.line}</p>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   The handoff to QStudio. This is the seam between the two product pages, so
   it is a real route into the other one, not a card that mentions it.
   --------------------------------------------------------------------------- */
function FamilySection() {
  /* This switches the whole app to the QStudio attraction rather than
     navigating — the site is a single page with a context-driven vertical
     switcher, so an <a href> here would go nowhere. */
  const { setAttraction } = useAttraction()

  return (
    <SectionShell label="The QBot family">
      <Reveal>
        <Eyebrow>Also by QBot</Eyebrow>
        <Display className="mt-7 max-w-[18ch]">
          When the business runs on memberships.
        </Display>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight font-bold tracking-tight text-white">
              STUDIO
            </p>
            <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-white/60">
              The same platform, sharpened for people who walk in, book a slot or
              hold a membership.
            </p>
            <button
              type="button"
              onClick={() => setAttraction('qstudio')}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-accent-500 px-7 py-3.5 text-[0.95rem] font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Open STUDIO
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2.2}
                aria-hidden
              />
            </button>
          </div>

          <div className="h-[46svh] lg:col-span-6 lg:col-start-7 lg:h-[52svh]">
            <Device kind="phone">
              <ProductScreen name="member" />
            </Device>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* --------------------------------------------------------------------------- */
function DemoCTA() {
  return (
    <section
      id="demo"
      aria-label="See it in person"
      className="relative isolate overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20%] -top-40 -z-10 h-[600px] rounded-[50%] border-t border-white/10 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-[1500px]">
        <Reveal>
          <Eyebrow>Showroom — Publika KL</Eyebrow>
          <h2 className="mt-7 max-w-[14ch] text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] font-bold tracking-tight text-white">
            See it in person.
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {[
              ['Address', 'B3-6-13 Solaris Dutamas, Jalan Dutamas 1, 50480 Publika, KL'],
              ['Hours', 'Monday–Friday, 10AM–7PM. Reservation required.'],
            ].map(([label, value]) => (
              <div key={label} className="bg-ink-950 p-6 sm:p-8">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                  {label}
                </dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="https://wa.me/60126909189"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
            >
              Book via WhatsApp
            </a>
            <a
              href="mailto:hello@qbot.now"
              className="text-base font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              hello@qbot.now
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
