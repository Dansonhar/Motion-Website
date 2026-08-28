import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Dumbbell, FerrisWheel, Scissors } from 'lucide-react'
import { useAttraction } from '../../attractions.jsx'
import { Display, EASE, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 4 — the industry doors. This REPLACES the six-stage "Our approach"
   list that used to sit here.

   Why it was replaced rather than trimmed: that list said "designed around the
   business, never the other way around" and then proved it with six stages that
   are identical for every reader — Understand, Identify, Design, Implement,
   Optimise, Scale. It described a customised engagement in the most generic
   form the page had. This section makes the same claim by ACTING on it: the
   visitor names their trade and the page hands back a build that is visibly not
   the other two.

   THE MECHANIC IS TWO-STAGE, and both stages matter.

     1. POINT AT A DOOR and the panel beside it rewrites — the brief, the three
        things that get configured, the one thing that decides whether the
        operation works. Nothing has been committed to and the page has already
        stopped being generic. This is the whole argument, delivered before any
        click.
     2. PRESS IT and it enters that attraction, which is a real, separately
        designed site, not an anchor further down this page.

   Stage 1 is what makes stage 2 feel like a choice instead of a menu.

   ACCESSIBILITY / TOUCH. There is no hover on a phone, so the panel is driven
   by state rather than CSS, and it is written by pointer entry, focus AND the
   first tap. On touch the panel simply shows the first door until something is
   touched, so a visitor who never interacts still reads a complete section.

   COPY RULE, same as everywhere else on this page: every line below describes
   work this practice actually does, in language an operator in that trade would
   use. No invented client, no invented number. The Salon entry ships `soon`
   and its door says so — an unbuilt sector is named honestly rather than
   dressed up as a live one.
   --------------------------------------------------------------------------- */

/* `attraction` is the id in attractions.jsx this door opens. `soon` marks a
   sector we are building for but have not published a site for — the door
   still opens (the destination says so plainly), it is just labelled up front
   so nobody feels tricked into a dead end. */
const DOORS = [
  {
    id: 'gym',
    attraction: 'gym',
    n: '01',
    icon: Dumbbell,
    name: 'Gyms & Fitness',
    line: 'Members come and go without a member of staff in the room.',
    /* Written in the operator's own terms — "the 6am hour with nobody on the
       desk" is the actual problem a gym owner describes, not "unattended
       access control". */
    brief:
      'The business runs on recurring revenue and unattended hours. The system has to sell the membership, hold the class, and open the door at 6am with nobody on the desk.',
    built: [
      'Membership plans, renewals and frozen accounts',
      'Class capacity, waitlists and no-show rules',
      'Face-verified entry with tailgating caught at the gate',
    ],
    decides: 'Whether a member can join, book and get in without being served.',
  },
  {
    id: 'themepark',
    attraction: 'themepark',
    n: '02',
    icon: FerrisWheel,
    name: 'Attractions & Leisure',
    line: 'Thousands arrive in the same two hours and all of them spend inside.',
    brief:
      'The business is one site with a gate, and demand arrives in peaks. The system has to sell before arrival, admit without a queue, and keep taking money at every counter behind it.',
    built: [
      'Tickets sold online, in-app and at the kiosk on one inventory',
      'Gate admission that scales to the peak, not the average',
      'Food, retail and rides reporting into a single day sheet',
    ],
    decides: 'Whether the queue at 10am becomes the review at 10pm.',
  },
  {
    id: 'salon',
    attraction: 'salon',
    n: '03',
    icon: Scissors,
    name: 'Salons & Spa',
    line: 'The product is an hour of a named person’s time.',
    soon: true,
    brief:
      'The business sells a practitioner’s diary, not a shelf of stock. The system has to protect that diary, follow the client between visits, and split the takings correctly at the end of the day.',
    built: [
      'Bookings held against the stylist or therapist, not the shop',
      'Client history, preferences and packages that carry over',
      'Commission, tips and retail split at close of day',
    ],
    decides: 'Whether a regular rebooks before they leave the chair.',
  },
]

export default function IndustryChooser() {
  const { setAttraction } = useAttraction()
  /* Index rather than id: this is "which door is being read", and it always
     has an answer, so the panel is never empty on a screen with no pointer. */
  const [active, setActive] = useState(0)
  const door = DOORS[active]

  /* Two refs, and both exist because of one bug found on a real touch device.

     A tap fires pointerdown -> focus -> pointerup -> click, and `onFocus`
     selects the door. React flushes that state update BEFORE the click event
     is dispatched, so by the time the click handler ran it had already been
     re-created with `active` pointing at the door being tapped — the "is this
     door already open" test was always true and the very first tap threw the
     visitor onto another site without them reading a word.

     So the answer has to be captured at the START of the gesture, before focus
     can move it. `gestureRef` records what kind of pointer began the press and
     whether the door was already selected at that moment; `activeRef` mirrors
     the state so that check does not read a stale closure either. */
  const activeRef = useRef(0)
  const gestureRef = useRef({ type: 'mouse', wasActive: true })
  const panelRef = useRef(null)

  const selectDoor = (i) => {
    activeRef.current = i
    setActive(i)
  }

  return (
    <SectionShell id="choose" label="Choose your industry">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Your industry</Eyebrow>
            <Display className="mt-7">
              Tell us what you
              <br />
              run.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.12}>
            <Lede>
              No two businesses look the same and no two operations work the
              same way — so nothing here is a template you adapt to. Choose the
              trade you are in and see the system that gets designed around it.
            </Lede>
          </Reveal>
        </div>
      </div>

      {/* The doors on the left, what a pick actually changes on the right.
          Two columns at lg; below that the panel drops under the doors and
          keeps working, driven by tap. */}
      <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ul className="border-t border-white/10">
            {DOORS.map((d, i) => {
              const Icon = d.icon
              const on = active === i
              return (
                <li key={d.id} className="border-b border-white/10">
                  <button
                    type="button"
                    /* `w-full` is load-bearing: a <button> sizes to its
                       content, and the row's layout is set by the grid inside
                       it. Without this the door collapses to the width of its
                       own text and the hairlines run past it.

                       `cursor-pointer` is NOT redundant. Tailwind's preflight
                       resets a <button> but sets no cursor, so it inherits the
                       UA default — an arrow. A row this large reads as a block
                       of copy rather than a control, and without the hand the
                       only hint it can be pressed is the arrow that fades in,
                       which is easy to miss. Same reason it is on the panel
                       CTA below. */
                    className="group relative flex w-full cursor-pointer items-center gap-5 py-7 text-left sm:gap-7 sm:py-9"
                    onPointerDown={(e) => {
                      // Read BEFORE focus can move the selection — see the refs.
                      gestureRef.current = {
                        type: e.pointerType,
                        wasActive: activeRef.current === i,
                      }
                    }}
                    onPointerEnter={(e) => {
                      // Mouse only. On touch, entry fires as part of the tap
                      // and would race the click handler below.
                      if (e.pointerType === 'mouse') selectDoor(i)
                    }}
                    onFocus={() => selectDoor(i)}
                    onClick={(e) => {
                      const g = gestureRef.current
                      /* Keyboard first. A click from Enter or Space reports
                         `detail === 0` and carries no pointer, so it must never
                         fall into the touch branch — where a stale gesture
                         could swallow it and leave the door unopenable without
                         a mouse. */
                      const keyboard = e.detail === 0

                      /* On a mouse the panel has already been showing this door
                         since the cursor arrived, so a click always travels. On
                         touch there is no hover, so the first tap SELECTS —
                         and scrolls the panel into view, because on a phone it
                         sits below the list and a tap that changed something
                         off-screen would read as a dead button. The second tap
                         on the same door opens it, as does the button in the
                         panel itself. */
                      if (!keyboard && g.type !== 'mouse' && !g.wasActive) {
                        selectDoor(i)
                        panelRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        })
                        return
                      }
                      setAttraction(d.attraction)
                    }}
                    aria-describedby="industry-panel"
                  >
                    {/* The lit marker. It is the only element that moves, and
                        it moves because a door is being read — the door itself
                        does not slide, which would make a three-item list feel
                        like a carousel. */}
                    <span
                      aria-hidden
                      className={`absolute left-0 top-0 h-full w-px transition-colors duration-500 ${
                        on ? 'bg-accent-400' : 'bg-transparent'
                      }`}
                    />
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-500 sm:size-14 ${
                        on
                          ? 'border-accent-400/40 bg-accent-400/10 text-accent-400'
                          : 'border-white/12 text-white/40'
                      }`}
                    >
                      <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-semibold tracking-widest text-accent-400">
                          {d.n}
                        </span>
                        {d.soon && (
                          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/45">
                            Coming soon
                          </span>
                        )}
                      </span>
                      <span className="mt-2 block text-[clamp(1.35rem,2.6vw,2.1rem)] font-bold leading-[1.1] tracking-tight text-white">
                        {d.name}
                      </span>
                      <span className="mt-2 block max-w-md text-[0.95rem] leading-relaxed text-white/55">
                        {d.line}
                      </span>
                    </span>

                    <ArrowRight
                      aria-hidden
                      className={`size-5 shrink-0 transition-all duration-500 ${
                        on
                          ? 'translate-x-0 text-accent-400 opacity-100'
                          : '-translate-x-2 text-white/30 opacity-0 group-hover:opacity-60'
                      }`}
                      strokeWidth={1.6}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* The panel. `aria-live="polite"` because on a mouse this rewrites
            without the visitor having pressed anything, and a screen reader
            that never announces it would leave the door labels meaning
            nothing. */}
        <div className="lg:col-span-5">
          <div
            ref={panelRef}
            id="industry-panel"
            aria-live="polite"
            className="glass h-full rounded-3xl p-7 sm:p-9"
          >
            {/* Keyed on the door so the whole panel cross-fades as one piece.
                Animating the individual lines instead made three separate
                things move at once, which read as busy rather than as a
                considered swap. */}
            <motion.div
              key={door.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-400">
                Designed for {door.name}
              </p>
              <p className="mt-5 text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-white/80">
                {door.brief}
              </p>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
                What gets built
              </p>
              <ul className="mt-4 space-y-3">
                {door.built.map((b) => (
                  <li key={b} className="flex gap-3 text-[0.95rem] leading-relaxed text-white/70">
                    <span
                      aria-hidden
                      className="mt-[0.55rem] size-[5px] shrink-0 rotate-45 bg-accent-400"
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="sol-rule mt-8 w-full" />
              <p className="mt-6 text-[0.95rem] leading-relaxed text-white/50">
                <span className="text-white/80">What it comes down to:</span>{' '}
                {door.decides}
              </p>

              {/* The same action as pressing the door, kept here because on a
                  phone the panel sits below the list and the door that opened
                  it has already been scrolled past. */}
              <button
                type="button"
                onClick={() => setAttraction(door.attraction)}
                className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-[0.95rem] font-semibold text-ink-950 transition-transform duration-300 hover:scale-[1.02]"
              >
                {door.soon ? `See ${door.name}` : `Open ${door.name}`}
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
