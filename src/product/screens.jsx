import { motion } from 'framer-motion'
import { EASE } from '../motion/StickyStage.jsx'
import { Bar, Row, Screen, ScreenBar, ScreenBody, Spark, Tile, itemIn } from './atoms.jsx'

/* ---------------------------------------------------------------------------
   The product, drawn.

   Each export is one state of the interface. They share the same chrome and the
   same atoms, which is the point: swapping between them on scroll reads as ONE
   system changing screens, not as six unrelated pictures.

   NOTHING HERE IS A CLAIM. The numbers are plausible interface furniture — a
   till total, a class capacity, a member's remaining credits — at the scale a
   real screen would show them. They are illustrative and deliberately
   unremarkable. Do not put a performance figure, a percentage uplift or a
   customer's name in these; the page makes no metric claims anywhere, and a
   number invented inside a mockup is the fastest way to lose that.
   --------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Webstore — where a customer meets the business.
   -------------------------------------------------------------------------- */
export function WebstoreScreen() {
  return (
    <Screen>
      <ScreenBar title="Webstore" right="Open 24/7" />
      <ScreenBody>
        <motion.div variants={itemIn} className="rounded-lg bg-white/[0.04] p-2.5 sm:p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Memberships
          </p>
          <p className="mt-1 text-[13px] font-bold leading-tight text-white sm:text-[15px]">
            Choose a plan
          </p>
        </motion.div>
        <Row label="Unlimited" sub="Monthly, auto-renew" value="RM 189" strong />
        <Row label="10-Class Pack" sub="Valid 90 days" value="RM 320" />
        <Row label="Day Pass" sub="Walk-in" value="RM 35" />
        <Row label="Trial" sub="First visit" value="Free" />
        {/* Pushed to the bottom of the frame. Without it a tall phone form
            factor leaves a third of the screen empty, which reads as a
            half-loaded page rather than as an interface. */}
        <motion.div
          variants={itemIn}
          className="mt-auto w-full rounded-lg bg-white py-2 text-center text-[11px] font-bold uppercase tracking-widest text-ink-950 sm:py-2.5 sm:text-[12px]"
        >
          Continue
        </motion.div>
      </ScreenBody>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   Booking — one calendar, one capacity, one waitlist.
   -------------------------------------------------------------------------- */
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function BookingScreen() {
  return (
    <Screen>
      <ScreenBar title="Booking" right="This week" />
      <ScreenBody>
        <motion.div variants={itemIn} className="flex gap-1">
          {DAYS.map((d, i) => (
            <span
              key={`${d}-${i}`}
              className={`flex-1 rounded-md py-1.5 text-center text-[9px] font-bold sm:text-[10px] ${
                i === 2 ? 'bg-white text-ink-950' : 'bg-white/[0.04] text-white/45'
              }`}
            >
              {d}
            </span>
          ))}
        </motion.div>

        {[
          { t: '07:00', n: 'Reformer Pilates', cap: 0.83, s: '10 / 12' },
          { t: '09:30', n: 'Vinyasa Flow', cap: 1, s: 'Full — waitlist' },
          { t: '18:00', n: 'Strength Lab', cap: 0.5, s: '8 / 16' },
          { t: '19:30', n: 'Boxing', cap: 0.35, s: '7 / 20' },
        ].map((c, i) => (
          <motion.div
            key={c.t}
            variants={itemIn}
            className={`rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 ${
              i === 1 ? 'bg-white/[0.07] ring-1 ring-white/15' : 'bg-white/[0.02]'
            }`}
          >
            {/* `min-w-0` + `truncate` on the name — without both, a two-word
                class title wraps the row to two lines and the four rows stop
                sharing a rhythm. */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[11px] font-semibold text-white sm:text-[12.5px]">
                <span className="tabular-nums text-white/50">{c.t}</span> {c.n}
              </span>
              <span className="shrink-0 text-[9.5px] tabular-nums text-white/45 sm:text-[10.5px]">
                {c.s}
              </span>
            </div>
            <Bar fill={c.cap} className="mt-2" />
          </motion.div>
        ))}
      </ScreenBody>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   Checkout — the money step.
   -------------------------------------------------------------------------- */
export function CheckoutScreen() {
  return (
    <Screen>
      <ScreenBar title="Payment" right="Secure" />
      <ScreenBody>
        <Row label="Unlimited — monthly" value="RM 189.00" />
        <Row label="Joining fee" value="RM 0.00" />
        <motion.div variants={itemIn} className="my-0.5 h-px w-full bg-white/10" />
        <Row label="Total" value="RM 189.00" strong />
        <Row label="Auto-renew" sub="Charged on the 1st" value="On" />
        <motion.button
          variants={itemIn}
          type="button"
          tabIndex={-1}
          aria-hidden
          className="mt-auto w-full rounded-lg bg-white py-2 text-[11px] font-bold uppercase tracking-widest text-ink-950 sm:py-2.5 sm:text-[12px]"
        >
          Confirm &amp; pay
        </motion.button>
      </ScreenBody>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   Face-ID — the door.

   Abstract on purpose: corner brackets, a sweeping scan line and a match
   confirmation. No rendered face. A drawn person here would be a fictional
   member, and a photographed one would need a release.
   -------------------------------------------------------------------------- */
export function FaceIdScreen() {
  return (
    <Screen>
      <ScreenBar title="Entry" right="Gate 01" />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
        <div className="relative aspect-square w-[52%] max-w-[190px]">
          {/* Bracket corners */}
          {[
            'left-0 top-0 border-l-2 border-t-2 rounded-tl-md',
            'right-0 top-0 border-r-2 border-t-2 rounded-tr-md',
            'left-0 bottom-0 border-b-2 border-l-2 rounded-bl-md',
            'right-0 bottom-0 border-b-2 border-r-2 rounded-br-md',
          ].map((pos) => (
            <motion.span
              key={pos}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`absolute size-6 border-white/70 sm:size-8 ${pos}`}
            />
          ))}

          {/* Scan sweep, then it stops and the match lands. */}
          <motion.span
            initial={{ top: '8%', opacity: 0 }}
            animate={{ top: ['8%', '88%', '8%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.6, ease: 'easeInOut', times: [0, 0.5, 1] }}
            className="absolute inset-x-2 h-px bg-white/80 shadow-[0_0_12px_2px_rgba(255,255,255,0.45)]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5, ease: EASE }}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="rounded-full border border-white/25 bg-ink-950/70 px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-[10.5px]">
              Matched
            </span>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.75 }}
        className="border-t border-white/8 px-3 py-2 sm:px-4 sm:py-2.5"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10.5px] font-semibold text-white sm:text-[12px]">
            Member · Unlimited
          </span>
          <span className="text-[9.5px] font-semibold uppercase tracking-widest text-white/50 sm:text-[10.5px]">
            Open
          </span>
        </div>
      </motion.div>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   POS — the counter, once they are inside.
   -------------------------------------------------------------------------- */
/* `title` is overridable because the same till runs in two of the 3-in-1 modes
   — the header has to say Mobile POS when the device is in the hand, or the
   screen contradicts the headline beside it. */
export function PosScreen({ title = 'Counter POS' }) {
  return (
    <Screen>
      <ScreenBar title={title} right="Order #2184" />
      <ScreenBody>
        <Row label="Protein shake" sub="Vanilla" value="RM 18.00" />
        <Row label="Towel hire" value="RM 5.00" />
        <Row label="Locker · 2h" value="RM 6.00" />
        <motion.div variants={itemIn} className="my-0.5 h-px w-full bg-white/10" />
        <Row label="Member discount" value="−RM 2.90" />
        <Row label="Total" value="RM 26.10" strong />
        <motion.div
          variants={itemIn}
          className="mt-auto flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-2 sm:px-3 sm:py-2.5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
            Charged to member
          </span>
          <span className="text-[10.5px] font-semibold text-white sm:text-[12px]">Card on file</span>
        </motion.div>
      </ScreenBody>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   Member app — what the customer carries.
   -------------------------------------------------------------------------- */
export function MemberScreen() {
  return (
    <Screen>
      <ScreenBar title="Member" right="Wallet" />
      <ScreenBody>
        <motion.div
          variants={itemIn}
          className="rounded-xl border border-white/12 bg-[linear-gradient(150deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))] p-3 sm:p-4"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Unlimited
          </p>
          <p className="mt-1.5 text-[19px] font-bold leading-none text-white sm:text-[24px]">
            Active
          </p>
          <p className="mt-1.5 text-[9.5px] text-white/45 sm:text-[10.5px]">Renews 1 Mar</p>
        </motion.div>
        <Row label="Class credits" value="8 left" strong />
        <Row label="Next booking" sub="Vinyasa Flow" value="Wed 09:30" />
        <Row label="Points" value="1,240" />
        <Row label="Birthday voucher" sub="Expires in 21 days" value="Ready" />
      </ScreenBody>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   QHub — the control centre. Everything above, reporting into one screen.
   -------------------------------------------------------------------------- */
export function QHubScreen() {
  return (
    <Screen>
      <ScreenBar title="QHub" right="All outlets" />
      <ScreenBody>
        <motion.div variants={itemIn} className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <Tile label="Takings" value="RM 8.4k" delta="Today" />
          <Tile label="Check-ins" value="312" delta="Today" />
          <Tile label="New members" value="9" delta="Today" />
          <Tile label="Expiring" value="14" delta="7 days" />
        </motion.div>

        {/* `flex-1` — the chart takes whatever height the dashboard has spare,
            so the desktop form factor fills rather than leaving a third of the
            screen blank under the last row. */}
        <motion.div
          variants={itemIn}
          className="flex min-h-[68px] flex-1 flex-col rounded-lg border border-white/8 bg-white/[0.03] p-2.5 sm:p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white/40 sm:text-[9.5px]">
              Takings · 7 days
            </span>
            <span className="text-[8.5px] font-medium text-white/35 sm:text-[9.5px]">4 outlets</span>
          </div>
          <Spark className="mt-1.5 flex-1" />
        </motion.div>

        <Row label="At-risk members" sub="No visit in 90 days" value="23" strong />
        <Row label="Staff on shift" sub="Across 4 outlets" value="11" />
      </ScreenBody>
    </Screen>
  )
}

/* --------------------------------------------------------------------------
   The remaining sales channels.
   -------------------------------------------------------------------------- */
export function KioskScreen() {
  return (
    <Screen>
      <ScreenBar title="Self-service Kiosk" right="Tap to start" />
      <ScreenBody>
        <motion.div variants={itemIn} className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {['Order', 'Sign up', 'Renew', 'Book'].map((t) => (
            <span
              key={t}
              className="grid h-12 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[10.5px] font-semibold text-white/80 sm:h-16 sm:text-[12px]"
            >
              {t}
            </span>
          ))}
        </motion.div>
        <Row label="No queue" sub="Serves itself" value="—" />
      </ScreenBody>
    </Screen>
  )
}

export function QrScreen() {
  return (
    <Screen>
      <ScreenBar title="QR Order" right="Table 12" />
      <div className="flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="grid aspect-square w-[46%] max-w-[150px] grid-cols-5 grid-rows-5 gap-[3px] rounded-md bg-white p-2"
        >
          {/* A QR-shaped mark, not a scannable code — it is an illustration. */}
          {[1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1].map(
            (on, i) => (
              <span
                key={i}
                className={`rounded-[1px] ${on ? 'bg-ink-950' : 'bg-transparent'}`}
              />
            ),
          )}
        </motion.div>
      </div>
      <div className="border-t border-white/8 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-white/45">
        Scan · order · pay
      </div>
    </Screen>
  )
}

/* Registry — screens are addressed by key from the story data, so a step's
   `screen` field is a string and the sequences stay declarative. */
export const SCREENS = {
  webstore: WebstoreScreen,
  booking: BookingScreen,
  checkout: CheckoutScreen,
  faceid: FaceIdScreen,
  pos: PosScreen,
  member: MemberScreen,
  qhub: QHubScreen,
  kiosk: KioskScreen,
  qr: QrScreen,
}

/* Extra props are forwarded to the screen — `title` is the only one any screen
   reads today (see PosScreen), and passing it to one that ignores it is
   harmless. */
export function ProductScreen({ name, ...rest }) {
  const Cmp = SCREENS[name] || QHubScreen
  return <Cmp {...rest} />
}
