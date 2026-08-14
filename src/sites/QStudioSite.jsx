import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Dumbbell, FerrisWheel, Scissors, Users2 } from 'lucide-react'
import { EASE, ScrollCue, StepRail, StickyStage, Swap } from '../motion/StickyStage.jsx'
import { useSimpleMotion } from '../motion/env.js'
import { Device } from '../product/atoms.jsx'
import { ProductScreen } from '../product/screens.jsx'
import { Display, Eyebrow, Reveal, SectionShell } from '../components/solution/SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   QStudio — "STUDIO by QBot".

   REBUILT AS A MOTION EXPERIENCE, not an editorial page. The previous version
   was eight identical `Eyebrow → Display → Lede → card grid` sections carrying
   ~890 words and no media, no scroll rig and no interaction. It explained the
   product; it never showed it.

   The spine is now one pinned scroll sequence — the customer's actual journey,
   with the product interface changing on screen as they move through it. Copy
   per step is a title and one line, because the interface is doing the
   explaining. Everything that used to be a paragraph in the flow is either
   demonstrated, made interactive, or moved down to the disclosure list at the
   end (Level 3), where someone who genuinely wants the detail can open it.

   RULES THIS PAGE HOLDS TO
   - No video autoplays. There is no video on this page yet; when footage
     arrives it goes in ClickToPlayVideo, never CinematicVideo (which
     autostarts on viewport entry — see the note in that file).
   - Every claim still comes from qbot.now/qstudio. Nothing was invented to fill
     a shorter format, and no metric appears that the source does not publish.
     The one numeric comparison they do make — 30 seconds against 1 second at
     the door — is reproduced exactly.
   - Mobile and reduced-motion never get a pinned stage. Every rig here has a
     stacked fallback; see StickyStage.

   NOTE: no `overflow-*` on the wrapper. `overflow-x: hidden` computes
   `overflow-y: auto`, making it a scroll container, which silently breaks every
   `position: sticky` below it.
   --------------------------------------------------------------------------- */

/* The journey, in the order a customer lives it. `screen` addresses a component
   in product/screens.jsx; `device` picks the form factor it is shown on. The
   two together are the argument — the same system, met on a phone, at a gate,
   at the counter, and finally from the back office. */
const JOURNEY = [
  {
    id: 'discover',
    n: '01',
    title: 'They find you',
    line: 'Plans and classes, bookable from your own site.',
    screen: 'webstore',
    device: 'phone',
  },
  {
    id: 'book',
    n: '02',
    title: 'A slot is held',
    line: 'One calendar. One capacity. One waitlist.',
    screen: 'booking',
    device: 'phone',
  },
  {
    id: 'pay',
    n: '03',
    title: 'Membership starts',
    line: 'Recurring or one-time, on Malaysia’s payment rails.',
    screen: 'checkout',
    device: 'phone',
  },
  {
    id: 'arrive',
    n: '04',
    title: 'The face is the membership',
    line: 'No card. No QR. No front desk.',
    screen: 'faceid',
    device: 'kiosk',
  },
  {
    id: 'inside',
    n: '05',
    title: 'Spend goes on the member',
    line: 'The counter already knows who they are.',
    screen: 'pos',
    device: 'counter',
  },
  {
    id: 'carry',
    n: '06',
    title: 'They carry it home',
    line: 'Credits, points and the next class, in their pocket.',
    screen: 'member',
    device: 'phone',
  },
  {
    id: 'hub',
    n: '07',
    title: 'You see all of it',
    line: 'Every outlet, on one screen.',
    screen: 'qhub',
    device: 'desktop',
  },
]

/* The stack STUDIO replaces. Positions are percentages of the stage, so the
   scatter is responsive without measuring anything. */
const STACK = [
  { label: 'Booking app', x: 18, y: 22 },
  { label: 'Spreadsheet', x: 76, y: 18 },
  { label: 'Card terminal', x: 30, y: 74 },
  { label: 'Door keys', x: 82, y: 66 },
  { label: 'WhatsApp', x: 8, y: 52 },
  { label: 'Accounting', x: 62, y: 84 },
]

const SECTORS = [
  {
    id: 'gym',
    name: 'Gyms & Studios',
    line: 'Fitness, yoga, pilates, martial arts, dance.',
    icon: Dumbbell,
    screen: 'booking',
    device: 'phone',
  },
  {
    id: 'park',
    name: 'Theme & Indoor Parks',
    line: 'Ticketing, ride passes, indoor playgrounds.',
    icon: FerrisWheel,
    screen: 'kiosk',
    device: 'kiosk',
  },
  {
    id: 'salon',
    name: 'Salons & Spas',
    line: 'Hair, nails, beauty, massage, treatments.',
    icon: Scissors,
    screen: 'member',
    device: 'phone',
  },
  {
    id: 'club',
    name: 'Wellness & Members’ Clubs',
    line: 'Wellness centres, private clubs, communities.',
    icon: Users2,
    screen: 'faceid',
    device: 'kiosk',
  },
]

const ALSO = [
  'Yoga', 'Pilates', 'Climbing Gyms', 'Boxing & MMA', 'CrossFit',
  'Aesthetic Clinics', 'TCM Clinics', 'Tuition', 'Kids Activity',
  'Coworking', 'Karaoke', 'Function Halls', 'Escape Rooms',
]

/* Level 3. Everything that used to sit in the scroll as a paragraph or a card
   grid lives here, closed, for the visitor who actually wants it. */
const DETAIL = [
  {
    q: 'What the seven steps actually cover',
    a: 'Sign-up, membership, check-in, booking, rewards, report and customised — the seven jobs a membership business runs every day, on one platform rather than one tool each.',
    items: [
      'Sign-up from counter, kiosk, phone or your website — NRIC autofill, digital waiver, e-signature',
      'Credit packs, unlimited plans, walk-in passes and trials, billed recurring or one-time via Fiuu',
      'Face-ID door lock, Face-ID auto-gate, or counter check-in',
      'Classes, rooms, slots and appointments on one calendar with auto-waitlist',
      'Loyalty points, birthday vouchers, expiry reminders, retention nudges',
      'Daily report pushed by WhatsApp, app push or email; live alerts as they happen',
      'Multi-outlet rollup, ClassPass, inventory sync, custom commission rules',
    ],
  },
  {
    q: 'Plug-ins you can switch on later',
    a: 'The core runs the day. These click on top when you want them — no migration, no second system to learn.',
    items: [
      'Together — invite friends, form squads, run challenges and a shared leaderboard',
      'Showcase — public trainer profiles, each with a shareable “Book with me” link',
      'Share & Gift — members gift a class, share credits or hand over a guest pass',
      'AutoWhatsApp — booking confirmations and reminders sent automatically',
      'eSign — waivers and agreements signed on any device, stored and searchable',
      'Rental — lockers, gear and equipment, timed, tracked and billed',
      'Plus ticketing, access rules, app push and NRIC verify, switched on per outlet',
    ],
  },
  {
    q: 'Data, privacy and getting out',
    a: 'Built PDPA-aware out of the box for Malaysian operators.',
    items: [
      'NRIC data, biometric records and signed consents encrypted at rest with access logs',
      'Waivers, agreements and consents stored with proper retention',
      'Members exportable or removable on request',
      'Members, sales, history and visit logs export to CSV or PDF at any time',
    ],
  },
]

export default function QStudioSite() {
  return (
    <div className="min-h-[100svh] w-full bg-ink-950">
      <main>
        <StudioHero />
        <JourneySequence />
        <ConvergeSection />
        <WhoSection />
        <DoorSection />
        <DetailSection />
        <DemoCTA />
      </main>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Hero. Six words of headline, one line under it. The old hero carried a
   43-word paragraph naming every module — which the journey below now shows.
   --------------------------------------------------------------------------- */
function StudioHero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[92svh] w-full items-center overflow-hidden px-6 pb-20 pt-32 sm:px-10 sm:pb-24 sm:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-30%] -top-1/3 -z-10 h-[900px] rounded-[50%] border-t border-white/10 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-[1500px]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="mb-8 text-xs font-semibold uppercase tracking-widest text-accent-400"
        >
          STUDIO by QBot
        </motion.p>

        <h1 className="max-w-[16ch] text-[clamp(2.6rem,7vw,6.4rem)] leading-[0.94] font-bold tracking-tight text-white">
          {['SIGN-UP TO', 'RENEWAL.', 'ONE SYSTEM.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: EASE }}
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
          transition={{ duration: 1.1, delay: 0.75, ease: EASE }}
          className="mt-9 max-w-xl text-[clamp(1.05rem,1.3vw,1.35rem)] leading-snug text-white/75"
        >
          For businesses where people walk in, book a slot, or hold a membership.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.95, ease: EASE }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
        >
          <a
            href="#demo"
            className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
          >
            Book a Demo
          </a>
          <a
            href="#journey"
            className="glass rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Watch it run
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   The journey. The page's centrepiece: the stage pins, and the product screen
   changes as the visitor scrolls through the customer's own path.
   --------------------------------------------------------------------------- */
function JourneySequence() {
  return (
    <StickyStage
      id="journey"
      label="The customer journey"
      count={JOURNEY.length}
      vhPerStep={95}
      className="border-y border-white/10 bg-ink-900"
      fallback={<JourneyStacked />}
    >
      {({ index, seek, progress }) => {
        const step = JOURNEY[index]
        return (
          <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>The journey</Eyebrow>

              <div className="mt-8 min-h-[13rem]">
                <Swap id={step.id}>
                  <p className="text-sm font-semibold tracking-[0.3em] text-white/40">{step.n}</p>
                  <h2 className="mt-4 max-w-[13ch] text-[clamp(2rem,3.6vw,3.6rem)] leading-[1.02] font-bold tracking-tight text-white">
                    {step.title}
                  </h2>
                  <p className="mt-5 max-w-sm text-[clamp(1rem,1.15vw,1.15rem)] leading-snug text-white/60">
                    {step.line}
                  </p>
                </Swap>
              </div>

              <StepRail steps={JOURNEY} index={index} onSeek={seek} className="mt-10 max-w-lg" />
            </div>

            {/* Fixed-height stage box — the device morphs inside it, so the
                layout never moves between steps. See the note on Device. */}
            <div className="h-[46svh] sm:h-[54svh] lg:col-span-6 lg:col-start-7 lg:h-[64svh]">
              <Device kind={step.device}>
                <Swap id={step.screen} y={10} duration={0.42} className="h-full">
                  <ProductScreen name={step.screen} />
                </Swap>
              </Device>
            </div>

            <ScrollCue progress={progress} />
          </div>
        )
      }}
    </StickyStage>
  )
}

/* Phones and reduced motion: the same seven steps, read rather than scrubbed.
   Each still shows its real screen — the demonstration survives, only the
   pinning is dropped. */
function JourneyStacked() {
  return (
    <div className="px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Eyebrow>The journey</Eyebrow>
        <Display className="mt-6 max-w-[14ch]">Sign-up to renewal.</Display>

        <ol className="mt-12 space-y-14">
          {JOURNEY.map((step) => (
            <li key={step.id}>
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.3em] text-white/40">{step.n}</p>
                <h3 className="mt-3 text-[clamp(1.5rem,6vw,2rem)] leading-tight font-bold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/60">{step.line}</p>
                <div className="mt-6 h-[52svh]">
                  <Device kind={step.device}>
                    <ProductScreen name={step.screen} />
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
   Before / after, as movement. Six scattered systems travel to the middle and
   resolve into one. Three words of copy, because the motion is the sentence.
   --------------------------------------------------------------------------- */
function ConvergeSection() {
  const { simple } = useSimpleMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const chipFade = useTransform(scrollYProgress, [0.5, 0.72], [1, 0])
  const oneOpacity = useTransform(scrollYProgress, [0.55, 0.78], [0, 1])
  const oneScale = useTransform(scrollYProgress, [0.55, 0.85], [0.86, 1])
  const ringScale = useTransform(scrollYProgress, [0.1, 0.8], [1.35, 1])
  const ringOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 0.5, 0.12])

  if (simple) {
    return (
      <SectionShell id="one" label="One operation">
        <Reveal>
          <Eyebrow>Before</Eyebrow>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {STACK.map((s) => (
              <li
                key={s.label}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.85rem] text-white/55"
              >
                {s.label}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-12 text-xs font-semibold uppercase tracking-widest text-accent-400">
            After
          </p>
          <Display className="mt-6 max-w-[10ch]">One operation.</Display>
        </Reveal>
      </SectionShell>
    )
  }

  return (
    <section
      id="one"
      aria-label="One operation"
      ref={ref}
      className="relative h-[260vh] border-b border-white/10"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden px-6 sm:px-10">
        <p className="absolute left-6 top-24 text-xs font-semibold uppercase tracking-widest text-accent-400 sm:left-10 sm:top-28">
          Six subscriptions, or one
        </p>

        {/* The gathering ring — a single hairline circle that tightens as the
            systems come together. Pure CSS, no asset. */}
        <motion.span
          aria-hidden
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute aspect-square w-[min(76vw,52svh)] rounded-full border border-white/25"
        />

        <div className="relative h-[min(76vw,66svh)] w-full max-w-[1100px]">
          {STACK.map((s, i) => (
            <ConvergeChip
              key={s.label}
              chip={s}
              index={i}
              progress={scrollYProgress}
              fade={chipFade}
            />
          ))}

          <motion.div
            style={{ opacity: oneOpacity, scale: oneScale }}
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <h2 className="text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] font-bold tracking-tight text-white">
              ONE
              <br />
              OPERATION.
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* One system travelling in. `left`/`top` are animated as percentages of the
   stage, so the scatter scales with the viewport and nothing has to be
   measured. Six elements — cheap enough not to need transforms. */
function ConvergeChip({ chip, index, progress, fade }) {
  const start = 0.08 + index * 0.03
  const end = 0.62
  const left = useTransform(progress, [start, end], [`${chip.x}%`, '50%'])
  const top = useTransform(progress, [start, end], [`${chip.y}%`, '50%'])

  return (
    <motion.span
      style={{ left, top, opacity: fade }}
      className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-ink-950/80 px-4 py-2 text-[0.8rem] font-medium text-white/70 backdrop-blur-sm sm:px-5 sm:py-2.5 sm:text-[0.9rem]"
    >
      {chip.label}
    </motion.span>
  )
}

/* ---------------------------------------------------------------------------
   Who it is for — a reveal, not a card grid. Picking a sector changes the
   screen beside it, so the breadth is demonstrated rather than asserted.
   --------------------------------------------------------------------------- */
function WhoSection() {
  const [active, setActive] = useState(0)
  const sector = SECTORS[active]

  return (
    <SectionShell id="who" label="Who it is for">
      <Reveal>
        <Eyebrow>Who it’s for</Eyebrow>
        <Display className="mt-7 max-w-[18ch]">
          If they walk in, book a slot, or hold a membership.
        </Display>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
        <ul className="lg:col-span-6">
          {SECTORS.map((s, i) => {
            const Icon = s.icon
            const on = i === active
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={on}
                  className="group flex w-full items-center gap-5 border-b border-white/10 py-6 text-left outline-none sm:py-7"
                >
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                      on
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/12 bg-white/[0.03] text-white/50 group-hover:border-white/25'
                    }`}
                  >
                    <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[clamp(1.15rem,1.9vw,1.7rem)] leading-tight font-bold tracking-tight transition-colors duration-500 ${
                        on ? 'text-white' : 'text-white/45 group-hover:text-white/75'
                      }`}
                    >
                      {s.name}
                    </span>
                    <motion.span
                      animate={{ opacity: on ? 1 : 0, height: on ? 'auto' : 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="block overflow-hidden text-[0.9rem] leading-relaxed text-white/55"
                    >
                      <span className="block pt-2">{s.line}</span>
                    </motion.span>
                  </span>
                  <span
                    className={`h-px shrink-0 transition-all duration-500 ${
                      on ? 'w-10 bg-white/60' : 'w-4 bg-white/15'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <div className="h-[50svh] lg:col-span-5 lg:col-start-8 lg:h-[58svh]">
          <Device kind={sector.device}>
            <Swap id={sector.screen} y={10} duration={0.4} className="h-full">
              <ProductScreen name={sector.screen} />
            </Swap>
          </Device>
        </div>
      </div>

      <Reveal>
        <div className="mt-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Also works for
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {ALSO.map((a) => (
              <li
                key={a}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.85rem] text-white/60 transition-colors duration-300 hover:border-white/25 hover:text-white"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   The door. Two hardware options, switched by the visitor — and the one hard
   number the source site publishes, animated rather than stated twice.
   --------------------------------------------------------------------------- */
const DOORS = [
  {
    id: 'lock',
    name: 'Door Lock',
    line: 'One door. No turnstile.',
    for: 'Studios, salons, treatment rooms, members’ areas.',
    specs: ['Single-door install', 'Member zones', 'Battery or wired'],
  },
  {
    id: 'gate',
    name: 'Auto Gate',
    line: 'Turnstile or boom gate.',
    for: 'Gyms, theme parks, larger clubs.',
    specs: ['One-in-one-out flow', 'Anti-tailgating (optional)', 'High-traffic ready'],
  },
]

function DoorSection() {
  const [pick, setPick] = useState(1)
  const door = DOORS[pick]

  return (
    <SectionShell id="door" label="At the door" className="bg-ink-900">
      <Reveal>
        <Eyebrow>At the door</Eyebrow>
        <Display className="mt-7 max-w-[14ch]">Pick the door that fits.</Display>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div
            role="tablist"
            aria-label="Door hardware"
            className="inline-flex rounded-full border border-white/12 bg-white/[0.03] p-1"
          >
            {DOORS.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={i === pick}
                onClick={() => setPick(i)}
                className={`relative rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-colors duration-300 ${
                  i === pick ? 'text-ink-950' : 'text-white/60 hover:text-white'
                }`}
              >
                {i === pick && (
                  <motion.span
                    layoutId="door-pill"
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 rounded-full bg-white"
                  />
                )}
                <span className="relative">{d.name}</span>
              </button>
            ))}
          </div>

          <Swap id={door.id} y={12}>
            <p className="mt-9 text-[clamp(1.4rem,2.4vw,2.2rem)] leading-tight font-bold tracking-tight text-white">
              {door.line}
            </p>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{door.for}</p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {door.specs.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/10 px-3.5 py-1.5 text-[0.8rem] text-white/55"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Swap>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <DoorDiagram variant={door.id} />
        </div>
      </div>

      {/* The source site's own comparison. Two numbers, no paragraph. */}
      <Reveal>
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {[
            { k: 'Card or QR', v: '30 sec', dim: true },
            { k: 'Face-ID', v: '1 sec', dim: false },
          ].map((m) => (
            <div key={m.k} className="bg-ink-950 p-7 sm:p-10">
              <p
                className={`text-[11px] font-semibold uppercase tracking-widest ${
                  m.dim ? 'text-white/40' : 'text-accent-400'
                }`}
              >
                {m.k}
              </p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.9, ease: EASE, delay: m.dim ? 0 : 0.15 }}
                className={`mt-4 text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-none tracking-tight ${
                  m.dim ? 'text-white/35' : 'text-white'
                }`}
              >
                {m.v}
              </motion.p>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* Two line drawings that share a frame, so switching reads as the same doorway
   being fitted differently rather than two unrelated pictures. Abstract on
   purpose — this is a diagram, not a product render. */
function DoorDiagram({ variant }) {
  const gate = variant === 'gate'
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-950">
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
        {/* floor line — shared by both */}
        <line x1="30" y1="250" x2="370" y2="250" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

        {gate ? (
          <motion.g
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* A tripod turnstile: one pedestal carrying the arm hub, and a rail
                opposite it forming the lane. The three arms radiate from the hub
                at 120°, which is what makes it read as a tripod rather than as
                a barrier — an earlier version drew them as three near-parallel
                bars across the lane and it looked like scaffolding.

                Rotation is a plain SVG `transform` attribute around an explicit
                centre, NOT a framer `rotate` with a CSS transform-origin. Mixing
                the two puts the origin in a different coordinate space from the
                geometry and the arms swing off the post entirely. */}
            <rect x="130" y="160" width="36" height="90" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" />
            <rect x="276" y="160" width="18" height="90" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.25)" />

            {/* ONE animated group, not three animated lines. Each arm carries a
                plain SVG `transform` rotate around the hub; the entrance is a
                single rotation of the whole assembly. Animating the lines
                individually meant framer's CSS transform (for scale) and the
                attribute rotate fought over the same element and two of the
                three arms ended up off the post. `transform-box: view-box` is
                what puts the px origin in viewBox coordinates. */}
            <motion.g
              initial={{ opacity: 0, rotate: -28 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              style={{ transformOrigin: '148px 160px', transformBox: 'view-box' }}
            >
              {[0, 120, 240].map((deg) => (
                <line
                  key={deg}
                  x1="148"
                  y1="160"
                  x2="228"
                  y2="160"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${deg} 148 160)`}
                />
              ))}
              <circle cx="148" cy="160" r="7" fill="rgba(255,255,255,0.9)" />
            </motion.g>

            {/* The reader sits on the opposite pillar, not above the hub — the
                240° arm sweeps up through that space and clipped straight
                across it there. */}
            <line x1="285" y1="130" x2="285" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <rect x="263" y="96" width="44" height="34" rx="6" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.5)" />
            <circle cx="285" cy="113" r="5" fill="rgba(255,255,255,0.7)" />
          </motion.g>
        ) : (
          <motion.g
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* The empty frame the door has swung out of. */}
            <rect x="120" y="70" width="160" height="180" rx="4" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="4 5" />

            {/* The swing arc — without it a door that has narrowed on the page
                reads as a door that shrank. */}
            <motion.path
              d="M280 250 A160 160 0 0 0 224 130"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeDasharray="3 5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />

            {/* The open door, drawn as explicit geometry rather than swung with
                a CSS transform.

                Both earlier attempts fought the SVG coordinate system: rotateY
                has no perspective to foreshorten against inside an <svg>, and
                scaleX around `transform-origin: left` resolved against a
                different box than the one the rect is drawn in, which put the
                door outside its own frame. A trapezoid needs no origin, no
                perspective and no transform-box: the hinge edge is short and
                far, the free edge is tall and near, which IS the projection.

                Hinge x=120 (matching the frame), free edge x=218. */}
            <motion.polygon
              points="120,72 218,56 218,264 120,248"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            />
            {/* handle on the free edge, so the swing direction is unambiguous */}
            <motion.circle
              cx="207"
              cy="160"
              r="4"
              fill="rgba(255,255,255,0.55)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            />

            {/* the reader panel, on the wall beside the frame */}
            <rect x="300" y="140" width="30" height="44" rx="6" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.5)" />
            <circle cx="315" cy="162" r="5" fill="rgba(255,255,255,0.7)" />
          </motion.g>
        )}
      </svg>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Level 3. Closed by default. Everything that was a paragraph in the old flow
   is here for the visitor who came looking for it.
   --------------------------------------------------------------------------- */
function DetailSection() {
  const [open, setOpen] = useState(null)

  return (
    <SectionShell id="more" label="The detail">
      <Reveal>
        <Eyebrow>If you want the detail</Eyebrow>
        <Display className="mt-7 max-w-[16ch]">Everything under the hood.</Display>
      </Reveal>

      <div className="mt-12 border-t border-white/10 sm:mt-16">
        {DETAIL.map((d, i) => {
          const on = open === i
          return (
            <div key={d.q} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="flex w-full items-center justify-between gap-6 py-7 text-left outline-none sm:py-8"
              >
                <span className="text-[clamp(1.1rem,1.7vw,1.5rem)] leading-snug font-bold tracking-tight text-white">
                  {d.q}
                </span>
                <motion.span
                  animate={{ rotate: on ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70"
                >
                  <ChevronDown className="size-[17px]" strokeWidth={1.8} aria-hidden />
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="pb-9 pr-4 sm:pb-10">
                  <p className="max-w-2xl text-[0.98rem] leading-relaxed text-white/70">{d.a}</p>
                  <ul className="mt-6 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                    {d.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[0.88rem] leading-relaxed text-white/55">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-white/35" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

/* --------------------------------------------------------------------------- */
function DemoCTA() {
  return (
    <section
      id="demo"
      aria-label="Book a demo"
      className="relative isolate overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20%] -top-40 -z-10 h-[600px] rounded-[50%] border-t border-white/10 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-[1500px]">
        <Reveal>
          <Eyebrow>Configured to your business, not a template</Eyebrow>
          <h2 className="mt-7 max-w-[14ch] text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] font-bold tracking-tight text-white">
            See your business running on it.
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="https://wa.me/60126909189"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
            >
              Book a Demo
            </a>
            <span className="text-base text-white/55">Publika KL · Mon–Fri · 10AM–7PM</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
