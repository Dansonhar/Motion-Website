import { useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Dumbbell,
  FerrisWheel,
  FileDown,
  Fingerprint,
  MapPin,
  Scissors,
  ScrollText,
  ShieldCheck,
  Users2,
} from 'lucide-react'
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

   WHO THIS PAGE IS WRITTEN FOR, and it is a deliberate exclusion.

   The reader is an operator with a budget: outlets to run, payroll to meet,
   a partner or a board to answer to. The page is NOT written to convert a
   single-owner shop comparing monthly fees, and several choices here cost us
   that visitor on purpose:

     - The cost section asks what they already spend before we say what we
       charge. An operator paying six vendors recognises the number. Someone
       with no stack to replace has nothing to put in the boxes and leaves.
     - "Investment" is in the nav and says "on application". A price shopper
       clicks it, reads the terms, and disqualifies themselves for free —
       cheaper for everyone than doing it in the sales queue.
     - The primary CTA is a business review behind a six-field form, not a
       one-tap chat. WhatsApp is still here, demoted to "a quick question".

   What this page must never do is SAY any of that. Qualification works when
   it is structural — a price floor, procurement-grade depth, a form that
   expects preparation. Copy that sneers at small buyers reads as insecurity,
   and it costs referrals from the operators who grow into the budget.

   THE ONE NUMBER STILL MISSING is `PRICE_FROM` below. It is null, so the
   investment section reads "on application" — correct and shippable, but a
   published floor is the single strongest filter on this page. Set it.

   RULES THIS PAGE HOLDS TO
   - No video autoplays. There is no video on this page yet; when footage
     arrives it goes in ClickToPlayVideo, never CinematicVideo (which
     autostarts on viewport entry — see the note in that file).
   - Every claim still comes from qbot.now/qstudio. Nothing was invented to fill
     a shorter format, and no metric appears that the source does not publish.
     The one numeric comparison they do make — 30 seconds against 1 second at
     the door — is reproduced exactly.
   - THE COST FIGURES IN `STACK` ARE NOT CLAIMS ABOUT ANY BUSINESS. They are
     editable defaults, labelled as estimates in the UI, and the visitor is
     asked to replace them. Never present the total as a measured finding.
   - `CLIENTS` IS EMPTY AND RENDERS NOTHING. Named deployments and outcome
     metrics are the biggest gap on this page, but a fabricated logo wall or an
     invented percentage is worse than a missing one. Fill it from real,
     cleared references only.
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
   scatter is responsive without measuring anything.

   `cost` and `note` are used ONLY by CostSection, which turns this same list
   into the visitor's own monthly total. They are DEFAULTS FOR AN INPUT, not
   claims — a single Malaysian outlet is the reference, every field is editable,
   and the UI says so. The converge rig ignores both fields.

   Why this list carries money at all: the page's whole argument is that STUDIO
   replaces a stack, and "six subscriptions, or one" is only rhetoric until the
   reader sees a ringgit figure they recognise as their own. It also reframes
   the conversation before price is ever mentioned — from what STUDIO costs to
   what the current arrangement already costs. */
const STACK = [
  {
    label: 'Booking app',
    x: 18,
    y: 22,
    cost: 250,
    note: 'Class, slot and appointment software, licensed per outlet',
  },
  {
    label: 'Spreadsheet',
    x: 76,
    y: 18,
    cost: 900,
    note: 'Front-desk hours on membership admin, expiry chasing and reconciliation',
  },
  {
    label: 'Card terminal',
    x: 30,
    y: 74,
    cost: 400,
    note: 'Terminal rental plus gateway fees on recurring collections',
  },
  {
    label: 'Door keys',
    x: 82,
    y: 66,
    cost: 150,
    note: 'Cards and fobs, replacements, re-keying, shared-access losses',
  },
  {
    label: 'WhatsApp',
    x: 8,
    y: 52,
    cost: 200,
    note: 'Blast tool for reminders, renewals and win-backs, sent by hand',
  },
  {
    label: 'Accounting',
    x: 62,
    y: 84,
    cost: 350,
    note: 'Reconciling takings and memberships across systems that do not talk',
  },
]

/* What "configured to your business" has actually meant. Three deployments
   published on qbot.now/custom-pos, kept anonymous exactly as the source keeps
   them, and chosen because all three are membership-sector work — a salon
   chain, an events operator, a park.

   This section exists because it is the one argument a well-funded operator
   cannot get from a cheaper vendor. Feature lists are comparable and therefore
   commoditising; "we changed the product for them" is not. The fourth card is
   deliberately NOT a fabricated fourth story — it is the published scope list,
   which is honest and does the same job. */
const BUILDS = [
  {
    id: 'privacy',
    ask: 'Hide the member list. Staff shouldn’t see it.',
    who: 'Barbershop chain',
    problem:
      'The owner found that staff searching by phone number could browse the entire customer list. The concern was data walking out of the door with a leaver.',
    fix:
      'The member list was hidden outright. Search returns the one matched record and nothing else — nothing to scroll, nothing to copy.',
    before: 'Full list exposed on search',
    after: 'Only the matched record',
  },
  {
    id: 'booking',
    ask: 'We need the booking system inside the POS.',
    who: 'Events operator',
    problem:
      'Scheduling and session booking sat in a separate app. Staff switched systems mid-transaction, and the two never agreed on what had been sold.',
    fix:
      'The booking module was plugged straight into their setup. Walk-ins and reservations are worked from one screen — no third-party app, no second login.',
    before: 'Second app, second login',
    after: 'One screen, one record',
  },
  {
    id: 'wallet',
    ask: 'Sell tickets and earn points in our own wallet.',
    who: 'Theme park',
    problem:
      'They wanted ticket sales at the counter and their own branded wallet — points earned at the gate and spent anywhere inside the park.',
    fix:
      'Tickets, points and balance run natively. Visitors buy, earn instantly, and spend at any food stall or gift shop in the park. No third-party wallet app.',
    before: 'Third-party wallet, points siloed',
    after: 'Branded, native, one tap',
  },
]

/* Published scope for bespoke work, from qstudio's own "customised" step. Sits
   under BUILDS so the section ends on what is available rather than on three
   anecdotes. */
const BUILD_SCOPE = [
  'Multi-outlet rollup with per-outlet branding',
  'ClassPass and third-party channel integration',
  'Inventory sync with your supplier',
  'Custom commission rules for franchise or trainer payouts',
  'Role-based access defined per outlet and per device',
  'Fields added, hidden or locked to match how your floor works',
]

/* Promoted OUT of the DetailSection accordion, where it was three clicks down.
   This is the section a chain's procurement or finance lead is looking for, and
   the visitor who does not care about any of it is not the buyer this page
   wants. Every line is published on qbot.now/qstudio. */
const GOVERNANCE = [
  {
    icon: Fingerprint,
    title: 'Identity captured at source',
    line: 'NRIC data is read off the MyKad chip during sign-up, not typed in from a photocopy.',
  },
  {
    icon: ShieldCheck,
    title: 'Encrypted at rest, access logged',
    line: 'NRIC records, biometric templates and signed consents are encrypted, with an access log behind them.',
  },
  {
    icon: ScrollText,
    title: 'Consents held to retention',
    line: 'Waivers, agreements and signatures are stored against a retention policy — PDPA-aware by default.',
  },
  {
    icon: Building2,
    title: 'Scoped by role and outlet',
    line: 'Staff see the outlets they work at. Reports roll up to head office; access does not roll down.',
  },
  {
    icon: FileDown,
    title: 'Yours to take out',
    line: 'Members, sales, history and visit logs export to CSV or PDF at any time. No data held hostage.',
  },
  {
    icon: Check,
    title: 'Removable on request',
    line: 'A member can be exported or erased on request, which is the part an auditor asks about.',
  },
]

/* WHAT DETERMINES THE PRICE, rather than a fabricated tier matrix.

   qbot.now/qstudio/pricing publishes four tier NAMES, annual billing, 8% SST,
   and "price upon request" — the feature split behind those tiers is served
   from their backend and is not ours to guess. Inventing one would be the
   single easiest way to make this page dishonest, so it names the five
   variables a quote is actually built from instead. That is more useful to a
   real buyer than a grid, and it makes the eventual number legible. */
const PRICE_DRIVERS = [
  { k: 'Outlets', v: 'One, or fifty. One login either way — an outlet is added, not re-bought.' },
  { k: 'Doors', v: 'Face-ID door lock per room, or an auto-gate with the anti-tailgating sensor.' },
  { k: 'Channels', v: 'Counter only, or counter with lobby kiosk, your website and the member app.' },
  { k: 'Plug-ins', v: 'Which of the eleven you switch on — and which stay off until you want them.' },
  { k: 'Custom work', v: 'One-time development for the bespoke pieces, scoped and quoted separately.' },
]

const TIERS = ['Standard', 'Pro', 'Advanced', 'Enterprise']

/* SET THIS. Null renders "On application", which is correct but soft.

   A published floor — the realistic first-year figure for a single outlet,
   inclusive of onboarding — is the strongest qualifier on the whole page: it
   disqualifies the wrong visitor before they ever reach the form, and it
   anchors the right one above the RM69/mo bracket the POS configurator sets.
   It is a commercial decision, so it is left to you rather than guessed.

   Format: a plain integer in ringgit, e.g. 24000. */
const PRICE_FROM = null

/* Standing facts, all published, all verifiable. Deliberately not called
   "why choose us" — these are the four things a buyer checks before a demo:
   who built it, where it is serviced, whose payment rails, whose law. */
const STANDING = [
  { k: 'Designed in Tokyo', v: 'Built and serviced for Malaysia' },
  { k: 'Publika KL showroom', v: 'Mon–Fri, 10AM–7PM, by reservation' },
  { k: 'Payments on Fiuu', v: 'Recurring and one-time, local rails' },
  { k: 'PDPA-aware by default', v: 'Not a bolt-on for Malaysian operators' },
]

/* NAMED DEPLOYMENTS GO HERE and the section renders only when this is filled.

   Right now there is no client proof anywhere on the live site — no names, no
   logos, no outcome figures. For a buyer signing a multi-outlet contract that
   is the largest single objection on the page, and everything else here is
   worth less without it.

   Shape: { name, sector, outlets, outcome } — and `outcome` must be a real
   measured figure with a real owner behind it. If a reference cannot be named,
   an anonymised-but-specific entry is still worth far more than nothing:
   { name: 'Klang Valley fitness group', sector: 'Fitness', outlets: '14', ... }
   Do not populate this with estimates. */
const CLIENTS = []

/* The qualification form. Six fields, because six is where a serious buyer
   still completes and a browser gives up — which is the intended split.

   No backend on this site, so the answers compose a structured WhatsApp
   message, the same channel the live site already uses. That is honest and it
   means the sales team receives a qualified brief instead of "hi". */
const OUTLET_BANDS = ['1 outlet', '2–5 outlets', '6–20 outlets', '20+ outlets']
const MEMBER_BANDS = ['Under 300', '300–1,000', '1,000–5,000', '5,000+', 'Opening soon']
const TIMELINES = ['Live this month', 'This quarter', 'This year', 'Scoping only']

/* REAL QSTUDIO PHOTOGRAPHY. Pulled from qbot.now/qstudio (`/qfitimg/studioimg/`)
   and re-encoded for the web — 9.2MB of originals down to 1.9MB, source
   filenames and URLs recorded in the README beside them. These replaced the
   watermarked placeholders that stood in for the sectors and the door hardware.

   Always compose with `${import.meta.env.BASE_URL}` in front, never a bare
   `/images/...` — the site is served from a sub-path and a root-relative URL
   404s in the build. */
const IMG = 'images/qstudio/studio/'

/* The seven jobs, with the real room each one happens in.

   NOT a duplicate of JOURNEY above, and the split is deliberate: JOURNEY is the
   product interface, scrubbed step by step on a device that morphs — it answers
   "what would I be running". This answers "what does it look like in my
   building". Abstract UI first, real rooms second.

   Copy is the published lifecycle description from qbot.now/qstudio, trimmed
   but not embellished. */
const JOBS = [
  {
    id: 'signup',
    n: '01',
    name: 'Sign-up',
    line: 'Front counter, lobby kiosk, their own phone or your website. NRIC scan autofills name, IC, address and DOB; the digital waiver and e-signature are collected in the same flow.',
    image: 'job-signup.jpg',
    alt: 'A member signing up at a self-service kiosk in a gym lobby, the STUDIO app open on a phone beside it',
  },
  {
    id: 'membership',
    n: '02',
    name: 'Membership',
    line: 'Credit packs, unlimited plans, walk-in passes and trials. Recurring or one-time billing via Fiuu. Balances live in the customer app.',
    image: 'job-membership.jpg',
    alt: 'The STUDIO member app showing an active 3-month unlimited plan and a check-in pass',
  },
  {
    id: 'checkin',
    n: '03',
    name: 'Check-in',
    line: 'Face-ID door lock for small studios, Face-ID auto-gate for high-traffic venues, or counter check-in. The person matches the membership.',
    image: 'job-checkin.jpg',
    alt: 'Members passing through Face-ID auto-gates at a gym entrance with no front-desk queue',
  },
  {
    id: 'booking',
    n: '04',
    name: 'Booking',
    line: 'Classes, rooms, slots and appointments booked from your website, the customer app or the front-desk console. One calendar, one waitlist, credits auto-deduct.',
    image: 'job-booking.jpg',
    alt: 'The STUDIO booking calendar on a laptop with a class detail open on a phone',
  },
  {
    id: 'rewards',
    n: '05',
    name: 'Rewards',
    line: 'Every visit earns points. Birthday vouchers, expiry reminders and retention nudges fire automatically.',
    image: 'job-rewards.jpg',
    alt: 'Members after a workout with reward points and a visit streak notification',
  },
  {
    id: 'report',
    n: '06',
    name: 'Report',
    line: 'Daily takings, check-ins, new sign-ups, expiring memberships and at-risk members, pushed to your phone by WhatsApp, app push or email.',
    image: 'job-report.jpg',
    alt: 'The STUDIO AI dashboard on a desktop beside the daily report on a phone',
  },
  {
    id: 'custom',
    n: '07',
    name: 'Customised',
    line: 'Multi-outlet rollup, ClassPass integration, inventory sync, custom commission rules — configured to fit the business rather than the other way round.',
    image: 'job-custom.jpg',
    alt: 'A multi-outlet STUDIO dashboard on a screen overlooking a gym floor',
  },
]

const SECTORS = [
  {
    id: 'gym',
    name: 'Gyms & Studios',
    line: 'Fitness, yoga, pilates, martial arts, dance.',
    icon: Dumbbell,
    screen: 'booking',
    device: 'phone',
    image: 'sector-gym.jpg',
    alt: 'Two members using a self-service STUDIO kiosk on a gym floor',
  },
  {
    id: 'park',
    name: 'Theme & Indoor Parks',
    line: 'Ticketing, ride passes, indoor playgrounds.',
    icon: FerrisWheel,
    screen: 'kiosk',
    device: 'kiosk',
    image: 'sector-park.jpg',
    alt: 'Families at ticketing kiosks and entry gates in an indoor playground',
  },
  {
    id: 'salon',
    name: 'Salons & Spas',
    line: 'Hair, nails, beauty, massage, treatments.',
    icon: Scissors,
    screen: 'member',
    device: 'phone',
    image: 'sector-salon.jpg',
    alt: 'A customer booking a treatment at a kiosk in a salon reception',
  },
  {
    id: 'club',
    name: 'Wellness & Members’ Clubs',
    line: 'Wellness centres, private clubs, communities.',
    icon: Users2,
    screen: 'faceid',
    device: 'kiosk',
    image: 'sector-club.jpg',
    alt: 'A wellness centre reception with a self check-in station beside the desk',
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
  /* "Data, privacy and getting out" used to be the third entry here, closed by
     default. It is now GovernanceSection with its own anchor — a buyer sending
     this page to their finance or compliance lead should not need to know which
     accordion row to open. Do not re-add it here; one owner per claim. */
]

export default function QStudioSite() {
  return (
    <div className="min-h-[100svh] w-full bg-ink-950">
      <main>
        {/* Ordered as a considered purchase is actually evaluated, not as a
            feature tour: what it is, what it replaces, what that already costs
            you, why it is not a template, whether it fits, whether it can be
            trusted, who else runs it, what it costs, then the ask. Price comes
            after the cost of the status quo — never before it. */}
        <StudioHero />
        <JourneySequence />
        <SevenJobs />
        <ConvergeSection />
        <CostSection />
        <CustomSection />
        <WhoSection />
        <DoorSection />
        <GovernanceSection />
        <ProofSection />
        <InvestmentSection />
        <DetailSection />
        <BusinessReview />
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
      {/* The real thing, behind everything. `isolate` on the section is what
          keeps these negative z-indexes inside it instead of sliding under the
          page background.

          Eager, high priority, NOT lazy: this is the largest contentful paint on
          the page, and a lazy hero is a blank screen for the first second. */}
      <img
        src={`${import.meta.env.BASE_URL}${IMG}hero.jpg`}
        alt="Members passing through Face-ID auto-gates at a gym entrance"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[60%_center]"
      />
      {/* Two scrims, not one. The left-weighted pass buys contrast for the
          headline; the bottom pass fades the photo into the ink the next section
          sits on, so the hero ends rather than getting cut off. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(96deg,rgba(6,8,7,0.95)_0%,rgba(6,8,7,0.82)_38%,rgba(6,8,7,0.42)_72%,rgba(6,8,7,0.55)_100%)]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-20 h-1/3 bg-gradient-to-t from-ink-950 to-transparent"
      />

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
          {/* Primary is the review, not a demo. "Book a Demo" costs the
              visitor nothing to click and fills the queue with browsers; a
              business review implies preparation on both sides and is what a
              multi-outlet operator expects to be offered. */}
          <a
            href="#review"
            className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
          >
            Request a Business Review
          </a>
          <a
            href="#journey"
            className="glass rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Watch it run
          </a>
        </motion.div>

        {/* Scale signal, above the fold. An operator with twelve outlets needs
            to know in the first screen that this is not a single-shop tool. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.15, ease: EASE }}
          className="mt-8 text-[0.9rem] text-white/45"
        >
          One outlet or fifty · Face-ID at the door · PDPA-aware · Publika KL showroom
        </motion.p>
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
   The seven jobs, in real rooms.

   Sits directly after the journey rig and answers the other half of the
   question. The journey scrubs the INTERFACE on a morphing device — what you
   would be running. This is the same seven jobs photographed in the buildings
   they happen in — what it looks like in yours. Neither replaces the other, and
   the order matters: abstract first, concrete second.

   Photography is QStudio's own, from qbot.now/qstudio. Every caption is the
   published lifecycle copy.

   Layout: two rows of three, then the seventh full width.

   The first attempt spanned BOTH the first and last cards across two columns to
   fill nine cells. It filled them and looked wrong: a 16:9 card two columns wide
   is ~480px tall while a 3:2 card one column wide is ~280px, so the row left
   200px of dead space under its short neighbour. Equal-height spanning would
   have needed a ~31:10 letterbox.

   Six uniform 3:2 cards and one full-width closer solves it without any of that,
   and it lands better: "customised" is the widest claim in the set, so it gets
   the widest frame and closes the band.
   --------------------------------------------------------------------------- */
function SevenJobs() {
  return (
    <SectionShell id="jobs" label="The seven jobs" className="bg-ink-900">
      <Reveal>
        <Eyebrow>Every day, on one platform</Eyebrow>
        <Display className="mt-7 max-w-[17ch]">Seven jobs, one system.</Display>
        <p className="mt-7 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/70">
          Sign-up, membership, check-in, booking, rewards, report, customised — the
          seven a membership business runs every day. One platform rather than one
          tool each.
        </p>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
        {JOBS.map((job, i) => {
          const last = i === JOBS.length - 1
          return (
            <motion.li
              key={job.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.07, ease: EASE }}
              className={`group ${last ? 'sm:col-span-2 lg:col-span-3' : ''}`}
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950">
                {/* Only the closer changes shape, and only once there is a row to
                    span. Below sm every card is 3:2 and the grid is one column. */}
                <div className={last ? 'aspect-[3/2] sm:aspect-[21/9]' : 'aspect-[3/2]'}>
                  <img
                    src={`${import.meta.env.BASE_URL}${IMG}${job.image}`}
                    alt={job.alt}
                    loading="lazy"
                    decoding="async"
                    /* A restrained lift on hover. The images carry real UI, so
                       anything more than this starts to look like a carousel. */
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-[11px] font-semibold tracking-[0.3em] text-white/45">{job.n}</p>
                  <h3 className="mt-2 text-[clamp(1.25rem,2vw,1.75rem)] font-bold leading-tight tracking-tight text-white">
                    {job.name}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-[0.92rem] leading-relaxed text-white/60">{job.line}</p>
            </motion.li>
          )
        })}
      </ul>
    </SectionShell>
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
   The cost of the stack that just converged.

   Placed IMMEDIATELY after the converge rig, and the order is the argument:
   six systems gather into one, and then we ask what those six cost. "Six
   subscriptions, or one" is rhetoric until a ringgit figure the reader
   recognises is sitting under it.

   It is the visitor's own number, typed by them, which is why this beats a
   feature-versus-price comparison table. A table invites them to shop us on
   monthly fee against a cheaper vendor — a fight fought on the wrong ground.
   This reframes the question from what STUDIO costs to what the current
   arrangement is already costing, and it does so before price is mentioned.

   HONESTY CONSTRAINT: the defaults are estimates for a single outlet and the UI
   says so twice. The total is never described as a finding, a saving, or an
   ROI — it is what the visitor typed. Do not add a "you save RM X" line here;
   we do not know what STUDIO costs them until it is scoped.
   --------------------------------------------------------------------------- */
const money = (n) => n.toLocaleString('en-MY')

function CostSection() {
  const [rows, setRows] = useState(() =>
    STACK.map((item) => ({
      label: item.label,
      note: item.note,
      /* Held as a string so the field can be emptied while typing. An empty
         box reads as 0 in the total rather than snapping back to a default. */
      cost: String(item.cost),
      on: true,
    })),
  )

  const monthly = useMemo(
    () => rows.reduce((sum, r) => (r.on ? sum + (Number(r.cost) || 0) : sum), 0),
    [rows],
  )
  const active = rows.filter((r) => r.on).length

  const set = (i, patch) =>
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  return (
    <SectionShell id="cost" label="What it replaces">
      <Reveal>
        <Eyebrow>What it replaces</Eyebrow>
        <Display className="mt-7 max-w-[19ch]">You already pay for all of it.</Display>
        <p className="mt-7 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/70">
          Just not in one invoice. Put your own figures in — the total is what the
          current arrangement costs before anyone quotes you a price.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
        <ul className="lg:col-span-7">
          {rows.map((r, i) => (
            <li
              key={r.label}
              className="flex items-center gap-4 border-b border-white/10 py-5 first:border-t sm:gap-6 sm:py-6"
            >
              {/* The toggle is the label. A separate checkbox beside a title
                  doubles the hit area for no gain and reads as a form. */}
              <button
                type="button"
                onClick={() => set(i, { on: !r.on })}
                aria-pressed={r.on}
                className="group flex min-w-0 flex-1 items-center gap-4 text-left outline-none"
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-md border transition-colors duration-300 ${
                    r.on
                      ? 'border-white/45 bg-white/90 text-ink-950'
                      : 'border-white/15 bg-transparent text-transparent group-hover:border-white/35'
                  }`}
                >
                  <Check className="size-[14px]" strokeWidth={2.75} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-[1rem] font-semibold tracking-tight transition-colors duration-300 sm:text-[1.1rem] ${
                      r.on ? 'text-white' : 'text-white/35'
                    }`}
                  >
                    {r.label}
                  </span>
                  <span
                    className={`mt-1 block text-[0.82rem] leading-snug transition-colors duration-300 ${
                      r.on ? 'text-white/50' : 'text-white/25'
                    }`}
                  >
                    {r.note}
                  </span>
                </span>
              </button>

              <label className="flex shrink-0 items-center gap-1.5">
                <span className="sr-only">{`Monthly cost of ${r.label}`}</span>
                <span
                  className={`text-[0.8rem] font-semibold transition-colors duration-300 ${
                    r.on ? 'text-white/45' : 'text-white/20'
                  }`}
                >
                  RM
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={r.cost}
                  disabled={!r.on}
                  /* Digits only. `type="number"` brings spinners, locale-decimal
                     parsing and a scroll-wheel trap for no benefit here. */
                  onChange={(e) => set(i, { cost: e.target.value.replace(/[^\d]/g, '').slice(0, 6) })}
                  className={`w-[5.5rem] rounded-lg border bg-white/[0.04] px-3 py-2 text-right text-[0.95rem] font-semibold tabular-nums outline-none transition-colors ${
                    r.on
                      ? 'border-white/12 text-white focus:border-white/45'
                      : 'border-white/5 text-white/20'
                  }`}
                />
              </label>
            </li>
          ))}

          <li className="pt-6">
            <p className="text-[0.78rem] leading-relaxed text-white/35">
              Editable estimates for a single Malaysian outlet, not a quote and not a
              measurement of your business. Replace every figure with yours.
            </p>
          </li>
        </ul>

        {/* Sticky on desktop so the total stays visible while the figures above
            are being changed — the number reacting is the whole point. */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="glass rounded-3xl p-7 sm:p-9 lg:sticky lg:top-28">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Your stack, monthly
            </p>
            <p className="mt-5 flex items-baseline gap-2 text-white">
              <span className="text-[1.3rem] font-semibold text-white/50">RM</span>
              <motion.span
                key={monthly}
                initial={{ opacity: 0.4, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="text-[clamp(2.6rem,6vw,4rem)] font-bold leading-none tracking-tight tabular-nums"
              >
                {money(monthly)}
              </motion.span>
            </p>

            <dl className="mt-8 space-y-3 border-t border-white/10 pt-7 text-[0.9rem]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/50">Over twelve months</dt>
                <dd className="font-semibold tabular-nums text-white">
                  RM {money(monthly * 12)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/50">Systems to run it</dt>
                <dd className="font-semibold tabular-nums text-white">{active}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/50">Systems with STUDIO</dt>
                <dd className="font-semibold text-white">1</dd>
              </div>
            </dl>

            <p className="mt-8 border-t border-white/10 pt-7 text-[0.95rem] leading-relaxed text-white/70">
              One system, one invoice, one login, one set of numbers that agree with
              each other.
            </p>

            <a
              href="#investment"
              className="mt-7 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-white transition-colors hover:text-white/70"
            >
              What determines our price
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   Configured, not templated.

   The strongest section on the page for the buyer this site is trying to reach,
   because it is the one claim a cheaper vendor cannot match. Feature lists are
   comparable, and anything comparable gets shopped on price. "We changed the
   product for them" is not comparable.

   All three deployments are published on qbot.now/custom-pos and stay anonymous
   exactly as the source keeps them. Do not attach names here without a cleared
   reference — see the CLIENTS note above.
   --------------------------------------------------------------------------- */
function CustomSection() {
  const [active, setActive] = useState(0)
  const build = BUILDS[active]

  return (
    <SectionShell id="custom" label="Custom build" className="bg-ink-900">
      <Reveal>
        <Eyebrow>Configured, not templated</Eyebrow>
        <Display className="mt-7 max-w-[17ch]">The product changes for you.</Display>
        <p className="mt-7 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/70">
          Not a settings page — the product itself. Fields hidden, modules plugged in,
          rules written for one operator. You tell us what you need; we configure it.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
        <ul className="lg:col-span-5">
          {BUILDS.map((b, i) => {
            const on = i === active
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={on}
                  className="group w-full border-b border-white/10 py-6 text-left outline-none sm:py-7"
                >
                  <span
                    className={`block text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500 ${
                      on ? 'text-accent-400' : 'text-white/30'
                    }`}
                  >
                    {b.who}
                  </span>
                  {/* The ask is quoted, in the operator's own voice. A neutral
                      feature title here loses the entire effect. */}
                  <span
                    className={`mt-3 block text-[clamp(1.05rem,1.7vw,1.5rem)] leading-snug font-bold tracking-tight transition-colors duration-500 ${
                      on ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                    }`}
                  >
                    “{b.ask}”
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="lg:col-span-6 lg:col-start-8">
          <Swap id={build.id} y={12}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              The problem
            </p>
            <p className="mt-4 text-[1rem] leading-relaxed text-white/70">{build.problem}</p>

            <p className="mt-9 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              What we did
            </p>
            <p className="mt-4 text-[1rem] leading-relaxed text-white">{build.fix}</p>

            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              <div className="bg-ink-950 p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                  Before
                </p>
                <p className="mt-3 text-[0.9rem] leading-snug text-white/40">{build.before}</p>
              </div>
              <div className="bg-ink-950 p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent-400">
                  After
                </p>
                <p className="mt-3 text-[0.9rem] leading-snug text-white">{build.after}</p>
              </div>
            </div>
          </Swap>
        </div>
      </div>

      <Reveal>
        <div className="mt-16 border-t border-white/10 pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Also configured, per operator
          </p>
          <ul className="mt-7 grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {BUILD_SCOPE.map((item) => (
              <li key={item} className="flex gap-3 text-[0.92rem] leading-relaxed text-white/60">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-white/35" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-9 text-[0.85rem] text-white/35">
            Bespoke pieces are one-time development work, scoped and quoted separately.
          </p>
        </div>
      </Reveal>
    </SectionShell>
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
        <ul className="lg:col-span-5">
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

        <div className="lg:col-span-6 lg:col-start-7">
          <SectorMedia sector={sector} />
        </div>
      </div>

      <Reveal>
        {/* Extra clearance: the device inset above hangs ~24px below its frame,
            so the stock mt-14 had it nearly touching this label on desktop. */}
        <div className="mt-14 lg:mt-20">
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

/* Sector media — the place, with the product over it.

   WHY BOTH, rather than swapping the device out for a photograph: the still
   answers "is this my kind of business", the screen answers "what would I
   actually be running". Drop the still and every sector looks identical; drop
   the screen and the section stops demonstrating anything. So the still is the
   environment and the product sits in it, which is also how the real
   photography will be composited later.

   THE FRAME IS 3:2 AND SIZED BY WIDTH, which is the opposite of the rule Device
   holds to — deliberately. Device is height-sized because it MORPHS between
   9:19.5 and 16:10 and would otherwise shove the page around on every step;
   these four stills are all one ratio, so nothing morphs and width-driven is
   simply simpler. The ratio itself is the load-bearing part: the sector list
   beside this is only ~370px tall, and an earlier 4:5 portrait left 400px of
   dead column under it. 3:2 lands the panel at the list's own height.

   THE DEVICE SITS BOTTOM-LEFT, not bottom-right, and that is dictated by the
   photographs rather than by taste. In all four real sector shots the kiosk and
   the people are centre-to-right of frame; an inset on that side covered the
   one thing the picture was taken for. Bottom-left is floor in every one of
   them. Re-check this if the photography is ever reshot.
   --------------------------------------------------------------------------- */
function SectorMedia({ sector }) {
  const base = import.meta.env.BASE_URL

  return (
    <div className="relative">
      <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-white/10 bg-ink-950">
        <Swap id={sector.id} y={0} duration={0.55} className="h-full">
          <img
            src={`${base}${IMG}${sector.image}`}
            alt={sector.alt}
            /* Four of these exist and only one is ever on screen, so none of
               them should block the section above from painting. */
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </Swap>

        {/* Grounds the device against the still — weighted to the corner the
            device occupies, so the subject on the other side keeps its light. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/15 to-transparent"
        />
      </div>

      {/* The product, over the place. It breaks the frame edge on purpose —
          flush inside reads as picture-in-picture, overlapping reads as one
          composition.

          HIDDEN ON PHONES. The frame is only ~230px tall there, which put a
          kiosk at about 80px wide — present, covering a third of the
          photograph, and showing nothing legible. The journey rig above already
          gives phones every screen at full size, so this loses nothing. */}
      <div className="absolute -bottom-6 -left-4 hidden h-[62%] sm:block">
        <Device kind={sector.device}>
          <Swap id={sector.screen} y={10} duration={0.4} className="h-full">
            <ProductScreen name={sector.screen} />
          </Swap>
        </Device>
      </div>
    </div>
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
    image: 'door-lock.jpg',
    alt: 'A member opening a glass studio door with a Face-ID reader mounted beside the frame',
  },
  {
    id: 'gate',
    name: 'Auto Gate',
    line: 'Turnstile or boom gate.',
    for: 'Gyms, theme parks, larger clubs.',
    specs: ['One-in-one-out flow', 'Anti-tailgating (optional)', 'High-traffic ready'],
    image: 'door-gate.jpg',
    alt: 'A member walking through a Face-ID auto-gate turnstile lane at a gym entrance',
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
          {/* The photograph carries it now; the diagram survives as a schematic
              inset. Both earn their place for a hardware decision — the photo
              says what it looks like on a wall, the diagram says how the lane is
              laid out, which no photograph of a single doorway shows. */}
          <div className="relative">
            <div className="aspect-[3/2] overflow-hidden rounded-3xl border border-white/10 bg-ink-950">
              <Swap id={door.id} y={0} duration={0.5} className="h-full">
                <img
                  src={`${import.meta.env.BASE_URL}${IMG}${door.image}`}
                  alt={door.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </Swap>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink-950/80 via-transparent to-transparent"
              />
            </div>

            <div className="absolute -bottom-4 -left-3 w-[38%] max-w-[220px] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] sm:-bottom-5 sm:-left-4">
              <DoorDiagram variant={door.id} />
            </div>
          </div>
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

/* ---------------------------------------------------------------------------
   Compliance and data ownership.

   PROMOTED OUT OF THE ACCORDION. This was the third closed row in
   DetailSection, three interactions from the surface. It is the section a
   chain's finance or compliance lead is sent to look at, and a buyer forwarding
   this page should be able to link straight to it.

   It is also a filter that costs nothing: an operator running twenty outlets
   under PDPA reads this and relaxes; a visitor comparing monthly fees skips it
   entirely, which is the correct outcome for both.

   Every line is published on qbot.now/qstudio. Nothing here is softened into a
   compliance guarantee we are not in a position to give — "PDPA-aware",
   "encrypted at rest", "access logged" are the source's own words and the
   ceiling on what this section may claim.
   --------------------------------------------------------------------------- */
function GovernanceSection() {
  return (
    <SectionShell id="governance" label="Compliance and data ownership">
      <Reveal>
        <Eyebrow>Compliance &amp; data ownership</Eyebrow>
        <Display className="mt-7 max-w-[19ch]">Built for the questions you get asked.</Display>
        <p className="mt-7 max-w-2xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/70">
          You are holding identity documents, biometric templates and signed consents
          for every member. STUDIO is built PDPA-aware for Malaysian operators rather
          than certified after the fact.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {GOVERNANCE.map((g, i) => {
          const Icon = g.icon
          return (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}
              className="bg-ink-950 p-7 sm:p-8"
            >
              <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/80">
                <Icon className="size-[17px]" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-6 text-[1.05rem] font-bold leading-snug tracking-tight text-white">
                {g.title}
              </h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-white/55">{g.line}</p>
            </motion.div>
          )
        })}
      </div>

      {/* The exit clause, given its own weight. A buyer signing a multi-outlet
          contract is asking how they get out of it long before they ask how they
          get in — answering it unprompted is worth more than another feature. */}
      <Reveal>
        <div className="mt-10 flex flex-col gap-6 rounded-3xl border border-white/12 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="text-[clamp(1.3rem,2.4vw,2rem)] font-bold leading-tight tracking-tight text-white">
              No lock-in.
            </p>
            <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-white/60">
              Members, sales, history and visit logs export to CSV or PDF whenever you
              ask — including on the way out.
            </p>
          </div>
          <FileDown className="size-9 shrink-0 text-white/25" strokeWidth={1.5} aria-hidden />
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   Standing. Who the buyer would be signing with.

   Four checks a serious operator runs before agreeing to a meeting: who built
   it, where it gets serviced, whose payment rails it collects on, whose law it
   was written against. All four are published and verifiable.

   `CLIENTS` renders only when filled — see its note. An empty logo wall is a
   worse signal than no logo wall, and an invented one is not an option.
   --------------------------------------------------------------------------- */
function ProofSection() {
  return (
    <SectionShell id="proof" label="Standing" className="bg-ink-900">
      <Reveal>
        <Eyebrow>Standing</Eyebrow>
        <Display className="mt-7 max-w-[16ch]">Who you would be signing with.</Display>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {STANDING.map((f, i) => (
          <motion.div
            key={f.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
            className="bg-ink-900 p-7 sm:p-8"
          >
            <p className="text-[1.02rem] font-bold leading-snug tracking-tight text-white">{f.k}</p>
            <p className="mt-2.5 text-[0.88rem] leading-relaxed text-white/50">{f.v}</p>
          </motion.div>
        ))}
      </div>

      {CLIENTS.length > 0 && (
        <Reveal>
          <div className="mt-12 border-t border-white/10 pt-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Running on STUDIO
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {CLIENTS.map((c) => (
                <li key={c.name} className="border-l border-white/12 pl-6">
                  <p className="text-[1.05rem] font-bold tracking-tight text-white">{c.name}</p>
                  <p className="mt-1.5 text-[0.85rem] text-white/45">
                    {c.sector} · {c.outlets} outlets
                  </p>
                  <p className="mt-4 text-[0.92rem] leading-relaxed text-white/70">{c.outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <MapPin className="mt-0.5 size-5 shrink-0 text-white/35" strokeWidth={1.75} aria-hidden />
            <div>
              <p className="text-[1.05rem] font-bold tracking-tight text-white">
                See it running before you commit.
              </p>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-white/55">
                Publika KL showroom · Mon–Fri, 10AM–7PM · by reservation
              </p>
            </div>
          </div>
          <a
            href="#review"
            className="glass shrink-0 self-start rounded-full px-6 py-3 text-[0.92rem] font-semibold text-white transition-transform hover:-translate-y-0.5 sm:self-auto"
          >
            Reserve a visit
          </a>
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   Investment.

   IN THE NAV ON PURPOSE. A visitor whose budget is a monthly app fee clicks
   "Investment", reads "billed annually, on application", and leaves without
   ever reaching the form. That is the cheapest qualification available to this
   page, and far cheaper than discovering the same thing in a sales call.

   WHY THERE IS NO TIER MATRIX: qbot.now/qstudio/pricing publishes four tier
   names, annual billing and 8% SST, but serves the feature split from its
   backend. Reconstructing that grid from guesses would be the easiest way to
   make this page dishonest — and a real buyer gets more from knowing which five
   variables the quote is built from than from a comparison table.

   SET `PRICE_FROM`. Until then this reads "on application", which is accurate
   but does none of the filtering a published floor would do.
   --------------------------------------------------------------------------- */
function InvestmentSection() {
  return (
    <SectionShell id="investment" label="Investment">
      <Reveal>
        <Eyebrow>Investment</Eyebrow>
        <Display className="mt-7 max-w-[17ch]">Quoted to the operation.</Display>
        <p className="mt-7 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/70">
          There is no shelf price, because a single studio with one door and a
          fifty-outlet group with gates at every entrance are not the same build.
          Five things decide the number.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
        <dl className="lg:col-span-7">
          {PRICE_DRIVERS.map((d, i) => (
            <motion.div
              key={d.k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
              className="grid grid-cols-1 gap-2 border-b border-white/10 py-6 first:border-t sm:grid-cols-[10rem_1fr] sm:gap-8 sm:py-7"
            >
              <dt className="text-[1rem] font-bold tracking-tight text-white">{d.k}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-white/60">{d.v}</dd>
            </motion.div>
          ))}
        </dl>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="glass rounded-3xl p-7 sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              Software plans
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[0.85rem] font-semibold text-white/70"
                >
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
                First year, single outlet
              </p>
              {PRICE_FROM ? (
                <p className="mt-4 flex items-baseline gap-2 text-white">
                  <span className="text-[0.95rem] font-semibold text-white/50">from RM</span>
                  <span className="text-[clamp(2.2rem,5vw,3.2rem)] font-bold leading-none tracking-tight tabular-nums">
                    {money(PRICE_FROM)}
                  </span>
                </p>
              ) : (
                <p className="mt-4 text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-tight text-white">
                  On application
                </p>
              )}
              <p className="mt-5 text-[0.85rem] leading-relaxed text-white/45">
                Billed annually · 8% SST applies · upgrade or downgrade any month ·
                hardware, installation and onboarding scoped with the quote
              </p>
            </div>

            <a
              href="#review"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-[0.95rem] font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Get it scoped
              <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

/* ---------------------------------------------------------------------------
   The ask — a business review, behind six fields.

   REPLACES THE OLD "Book a Demo" BUTTON, which was a single tap straight into
   WhatsApp. That button converts everybody, which sounds good and is not: the
   queue fills with visitors who have not decided anything, and the operator
   with twelve outlets gets the same treatment as someone browsing.

   Six fields is the deliberate split. It is trivial for a buyer who already
   knows their outlet count and member base, and it is more than a browser will
   type. WhatsApp is still on the page, demoted to "a quick question", so the
   low-intent visitor is not blocked — just not counted as a lead.

   NO BACKEND on this site, so the answers compose a structured WhatsApp
   message — the channel the live site already uses. The team receives a
   qualified brief instead of "hi", which is the actual win here.
   --------------------------------------------------------------------------- */
const WA_NUMBER = '60126909189'

const SECTOR_OPTIONS = [...SECTORS.map((s) => s.name), 'Other']

function BusinessReview() {
  const [form, setForm] = useState({
    business: '',
    sector: '',
    outlets: '',
    members: '',
    timeline: '',
    name: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const ready = Object.values(form).every((v) => v.trim() !== '')

  const send = () => {
    const lines = [
      'STUDIO — business review request',
      '',
      `Business: ${form.business}`,
      `Sector: ${form.sector}`,
      `Outlets: ${form.outlets}`,
      `Active members: ${form.members}`,
      `Want to be live: ${form.timeline}`,
      `Contact: ${form.name}`,
    ]
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <section
      id="review"
      aria-label="Request a business review"
      className="relative isolate overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20%] -top-40 -z-10 h-[600px] rounded-[50%] border-t border-white/10 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Request a business review</Eyebrow>
            <h2 className="mt-7 max-w-[15ch] text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-bold tracking-tight text-white">
              See your own operation running on it.
            </h2>
            <p className="mt-7 max-w-md text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-white/70">
              We look at your outlets, what you run today and your member base, then come
              back with a scope and a number. Reviews are scheduled, not instant.
            </p>
            <p className="mt-8 text-[0.9rem] leading-relaxed text-white/45">
              Publika KL showroom · Mon–Fri, 10AM–7PM
              <br />
              Or{' '}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
              >
                ask a quick question on WhatsApp
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.12}>
            {/* Not a <form>: there is nothing to POST to, and a real submit
                event would navigate away from the page. The button opens the
                composed WhatsApp thread instead. */}
            <div className="glass rounded-3xl p-7 sm:p-9">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ReviewField label="Business name" className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.business}
                    onChange={set('business')}
                    placeholder="e.g. Studio Twelve"
                    className={FIELD_CLASS}
                  />
                </ReviewField>

                <ReviewField label="Sector" className="sm:col-span-2">
                  <ReviewSelect value={form.sector} onChange={set('sector')} options={SECTOR_OPTIONS} />
                </ReviewField>

                <ReviewField label="Outlets">
                  <ReviewSelect value={form.outlets} onChange={set('outlets')} options={OUTLET_BANDS} />
                </ReviewField>

                <ReviewField label="Active members">
                  <ReviewSelect value={form.members} onChange={set('members')} options={MEMBER_BANDS} />
                </ReviewField>

                <ReviewField label="Want to be live">
                  <ReviewSelect value={form.timeline} onChange={set('timeline')} options={TIMELINES} />
                </ReviewField>

                <ReviewField label="Your name">
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Who we speak to"
                    className={FIELD_CLASS}
                  />
                </ReviewField>
              </div>

              <button
                type="button"
                onClick={send}
                disabled={!ready}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[0.98rem] font-semibold transition-all ${
                  ready
                    ? 'bg-accent-500 text-ink-950 shadow-lg shadow-accent-500/20 hover:-translate-y-0.5'
                    : 'cursor-not-allowed border border-white/10 bg-white/[0.03] text-white/30'
                }`}
              >
                Send for review
                <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
              </button>

              <p className="mt-5 text-center text-[0.8rem] text-white/35">
                {ready
                  ? 'Opens WhatsApp with your brief attached.'
                  : 'All six fields, so the review is worth having.'}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* Shared field chrome. Kept as constants rather than components where it is
   only a class string — one place to change the input treatment. */
const FIELD_CLASS =
  'w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-[0.95rem] text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/45'

function ReviewField({ label, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-white/45">
        {label}
      </span>
      {children}
    </label>
  )
}

/* Native <select>, styled. A custom listbox would need its own keyboard and
   focus handling for no gain — the native control is better on mobile and
   already accessible. `bg-ink-900` is set so the option list is legible on the
   platforms that inherit it. */
function ReviewSelect({ value, onChange, options }) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={onChange}
        className={`${FIELD_CLASS} appearance-none bg-ink-900 pr-11 ${
          value ? 'text-white' : 'text-white/30'
        }`}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-white">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/40"
        strokeWidth={2}
      />
    </span>
  )
}
