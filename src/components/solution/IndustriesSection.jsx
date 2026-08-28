import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from './SolutionMedia.jsx'
import { Display, EASE, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 8 — the industries, then the clients.

   The sector list comes first and does the positioning work: this is not a
   restaurant practice, it is one operating model applied across customer-facing
   businesses. Each line names the sector and the one thing that makes its
   operation different, so the breadth reads as range rather than as a
   catch-all.

   The clients follow as a logo wall, not as written case studies — the marks
   are the proof, and each is tagged with a sector from the list above so the
   two halves of this section answer each other. See the note on CLIENTS. */
/* `image` names a file in public/images/solution/sectors/ that sits DIMMED
   BEHIND the row and lifts toward full brightness on hover.

   ⚠ THESE ARE NOT STOCK. Every one is a frame pulled with ffmpeg from footage
   already in this repo (public/video/solution, /themepark), so the set is
   licensed by the fact that we shot it, and it carries the same grade, cast and
   lensing as the films elsewhere on the page — which is the whole reason it
   reads as one piece of work rather than eight bought pictures. Regenerating
   one means re-cutting from the source clip, not sourcing a new photograph. The
   exact source and timecode for each is recorded in the trailing comment.

   Two of them were re-cut after the first pass and the reasons are worth
   keeping: 01 and 02 first landed on a screen close-up, which illustrated an
   APP rather than a trade; and 05 and 07 both first landed on a hotel room, so
   two rows of the same list showed the same picture.

   `focus` is the vertical framing and it is NOT decoration. A row is roughly
   4:1 while every file is 16:9, so `object-cover` matches the WIDTH and throws
   away most of the height — each row shows one horizontal band of its picture
   and nothing else. Left at the default centre, half of these landed on the
   wrong band: the fitness frame became a strip of legs, the clinic frame a pair
   of hands, the multi-site frame the empty space under the tiles. The value is
   the `object-position` Y for that specific file and has to be re-judged by eye
   whenever a frame is re-cut.

   `shot` is NOT an alt attribute — the picture is rendered decorative
   (`alt=""`), because the row's own copy already names the sector and a screen
   reader gaining eight room descriptions would only be slowed down by them. It
   is a written record of what is actually in each frame, kept beside the
   timecode so a future re-cut can be checked against what it is replacing.

   The `image` field is optional and the row renders without it: an entry with no
   `image`, or one whose file has not landed yet, is simply the plain hairline
   row this list used to be. Nothing breaks, nothing shows a broken frame. */
/* ── THE BRIGHTNESS DIAL ───────────────────────────────────────────────────
   Two values, and the gap between them is the whole effect: `REST` is how the
   picture sits when nobody is touching the row, `LIT` is where it goes when
   somebody is. 1 is the untouched frame.

   REST WAS 0 — the rows were plain text until hovered, which meant a phone
   showed eight pictures that never appeared and a desktop showed one at a time.
   The pictures now carry the list; the copy animates in over them on scroll.

   0.55 is a legibility ceiling, not a taste call. The scrim below is
   directional (near-solid down the copy column, clear on the far side), so the
   number that matters is how much frame comes up UNDER the text. Past roughly
   0.6 the body copy on the bright frames — 04 attractions, 05 hotels, 07
   events — starts depending on its text-shadow alone. Raise it and check those
   three by eye, not the dark ones.

   LIT feeds BOTH interaction paths — set as a CSS variable the `group-hover:`
   utility reads, and used directly by the touch branch — so changing it here
   brightens desktop and mobile together. Do not re-introduce a literal in
   either place. */
const REST = 0.55
const LIT = 0.92

const SECTORS = [
  {
    n: '01',
    name: 'Restaurants & F&B',
    body: 'Service speed, order accuracy and turning covers without losing the room.',
    image: '01-restaurants.jpg',
    focus: '22%', // the counter and the room behind it, not the phone in the foreground
    shot: 'A café floor mid-service — a guest ordering from a phone, staff working behind',
    // solution/tech/qr.mp4 @ 6.77s
  },
  {
    n: '02',
    name: 'Retail & Concept Stores',
    body: 'Stock, checkout and a shop floor that has to sell as well as display.',
    image: '02-retail.jpg',
    focus: '20%', // the served customer and the wall of stock, not the countertop
    shot: 'A store counter — a customer being served, stock displayed on the wall behind',
    // solution/tech/pos.mp4 @ 6.77s
  },
  {
    n: '03',
    name: 'Fitness & Wellness',
    body: 'Memberships, class capacity and unattended access at every hour.',
    image: '03-fitness.jpg',
    focus: '14%', // the class itself — centred, the row is a band of legs
    shot: 'A class in session on a studio floor against a mirrored wall',
    // solution/area-02-operations.mp4 @ 5.00s (lower crop — the class, not the mirror)
  },
  {
    n: '04',
    name: 'Attractions & Leisure',
    body: 'Ticketing, admission and crowd flow across a whole site.',
    image: '04-attractions.jpg',
    focus: '45%', // gate signage above, ticketing kiosk below, both in frame
    shot: 'A theme park gate — a visitor at the ticketing kiosk, staffed window beside it',
    // themepark/channel-kiosk.mp4 @ 1.90s
  },
  {
    n: '05',
    name: 'Hotels & Hospitality',
    body: 'Arrival, in-stay spend and every department reporting into one picture.',
    image: '05-hotels.jpg',
    focus: '38%', // the lit room and the window, not the phone alone
    shot: 'A hotel room in the evening, a guest ordering in, the site lit beyond the window',
    // themepark/channel-app.mp4 @ 2.20s
  },
  {
    n: '06',
    name: 'Clinics & Appointment Services',
    body: 'Scheduling, practitioner time and records that follow the client.',
    image: '06-clinics.jpg',
    focus: '12%', // the practitioner's face and attention, not just the hands
    shot: 'A practitioner working with a client through a booked appointment',
    // solution/area-05-scale.mp4 @ 13.60s
  },
  {
    n: '07',
    name: 'Entertainment & Events',
    body: 'Sessions, capacity and demand that arrives in peaks, not evenly.',
    image: '07-events.jpg',
    focus: '12%', // the lanes running back — the venue is what names the sector
    shot: 'An entertainment venue — guests ordering at the table, lanes running behind them',
    // solution/tech/table.mp4 @ 4.50s
  },
  {
    n: '08',
    name: 'Multi-Site Groups & Franchises',
    body: 'One standard, many locations, and control that survives the distance.',
    image: '08-multi-site.jpg',
    focus: '22%', // the row of site tiles, not the figures beneath them
    shot: 'Several sites of one group open together on a single management screen',
    // solution/area-05-scale.mp4 @ 6.77s
  },
]

/* The clients, shown as their own marks — not written up as case studies.
   Each carried four blocks of copy (The Business / Challenge / Solution /
   Result) which ran to roughly 200 words for two entries and buried the logos
   under them. A mark plus the sector it trades in says who we work with; the
   write-up is a separate piece of work, and the drafted copy is in git history
   if it is ever wanted for one.

   THE MARKS SIT DIRECTLY ON THE PAGE — no plate, no caption. Which means every
   file here has to be legible on ink-950 (#060807) BY ITSELF. Check any new
   logo before dropping it in: dark ink on this background is not "subtle", it
   is gone. OWG is the worked example — its "ONLY WORLD GROUP" wordmark is pure
   black, contrast 2.5:1 on this page, so `owg-dark.png` is a copy with that
   one wordmark lifted to white and the red and grey untouched (the original
   `owg.png` is kept beside it for any light-background use). Recolouring a
   registered mark is a last resort; prefer a reversed version from the client
   where one exists.

   `logoClass` optically sizes each mark. Marks differ wildly in shape and ink
   density, so matching them by height alone makes the wide ones shout; see the
   note on Jadioc. Files should be trimmed to their ink so these caps act on
   the mark, not on transparent padding.

   An entry with no `logo` does not render, so a client can sit in this list
   waiting for its mark without leaving a hole in the wall. */
const CLIENTS = [
  { id: 'mks', name: 'MKS', logo: null },
  {
    id: 'owg',
    // The mark reads OWG / ONLY WORLD GROUP — the list previously said "OWGH".
    name: 'Only World Group',
    logo: 'owg-dark.png',
    // Tall stacked lockup (aspect 0.97) — takes the full height of the row.
    logoClass: 'max-h-full',
  },
  {
    id: 'jadioc',
    // The mark reads JADIOC — the list previously said "JadiAOC".
    name: 'Jadioc Barbershop',
    logo: 'jadioc.png',
    /* Wide horizontal lockup (aspect 1.71) at 41% ink density against OWG's
       28%. Matched to the full height it would carry roughly 2.6x OWG's ink
       and swamp it, so it is held to a share of the height — which still makes
       it the WIDER of the two on screen. Height alone is a bad proxy for how
       big a mark looks; set by ink area, checked by eye. */
    logoClass: 'max-h-[68%]',
  },
]

const SHOWN = CLIENTS.filter((c) => c.logo)

/* Brightness is driven by TWO separate mechanisms, and it needs both.

   `group-hover` is the desktop half and it CANNOT cover touch: Tailwind v4 emits
   every `hover:` utility inside `@media (hover: hover)`, so on a phone those
   rules do not exist at all and the row never lights up. Removing that guard is
   not the fix either — on touch, `:hover` latches on tap and stays latched until
   something else is tapped, which is the opposite of dimming when released.

   So touch is held in state here instead, off pointer events, which report their
   own `pointerType` and fire identically on iOS and Android. A finger down
   brightens the row it is on; lifting, cancelling (which is what a scroll that
   starts on a row emits) or leaving clears it. */
export default function IndustriesSection() {
  const reduced = usePrefersReducedMotion()
  const [heldIndex, setHeldIndex] = useState(null)

  // Mouse presses are ignored — hover already has the pointer case, and reacting
  // to both would make a desktop click flicker the row through a second state.
  const hold = (i) => (e) => {
    if (e.pointerType !== 'mouse') setHeldIndex(i)
  }
  const release = () => setHeldIndex(null)

  return (
    <SectionShell id="industries" label="Industries and experience">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Industries</Eyebrow>
            <Display className="mt-7 max-w-[14ch]">
              Different sectors.
              <br />
              Different operations.
              <br />
              Different solutions.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-6">
          <Reveal delay={0.12}>
            {/* Present tense on purpose. This read "none of them were given the
                same system" — a claim about past clients, made directly above
                three case-study cards that are still empty. Say what is true of
                the method, not what the page cannot yet show. */}
            <Lede>
              We work across customer-facing businesses, not one industry. None
              of these operations run the same way, so none of them get the same
              system.
            </Lede>
          </Reveal>
        </div>
      </div>

      {/* The sector list — the breadth stated plainly, before any client */}
      <div className="mt-12 grid grid-cols-1 border-t border-white/10 sm:mt-16 md:grid-cols-2">
        {SECTORS.map((s, i) => (
          /* `isolate` matters: the picture and its scrim sit at negative z so
             the copy stays above them, and without a stacking context here
             they would escape the row and paint behind the whole section.
             `overflow-hidden` keeps the hover scale from bleeding across the
             hairlines. Note that `inset-0` resolves to the PADDING box, so the
             left border on odd rows is never covered by the image. */
          /* NOT a `Reveal` any more. Reveal fades its whole subtree from
             opacity 0, which would have taken the photograph up with the copy
             — and the point of this row is that the picture is ALREADY THERE
             when the words arrive over it. The two are animated separately
             below, on the same trigger, a beat apart. */
          <div
            key={s.n}
            className={`group relative isolate overflow-hidden border-b border-white/10 py-10 sm:py-12 ${
              i % 2 === 0 ? 'md:pr-16' : 'md:border-l md:pl-16'
            }`}
            onPointerDown={hold(i)}
            onPointerUp={release}
            /* `pointercancel` is the important one: it is what the browser
               sends when a finger that went down on a row turns into a page
               scroll, and without it the row stays lit after the gesture has
               become something else entirely. */
            onPointerCancel={release}
            onPointerLeave={release}
          >
            {s.image && (
              <>
                {/* THE PICTURE LANDS FIRST. This layer carries the scroll
                    entry — fade plus a slow settle out of a slight overscale,
                    so the frame arrives as if a camera stopped moving — and the
                    copy follows a beat later, over it.

                    It has to be a SEPARATE element from the <img>. Framer
                    writes its animated values as inline style, and the image's
                    rest/hover brightness is a pair of Tailwind opacity
                    utilities: animating opacity on the image itself would put
                    an inline value on top of them and the hover would stop
                    working entirely. Entry lives out here, brightness stays in
                    there, and the two multiply.

                    `once` because a row that re-enters every time it is
                    scrolled past reads as a glitch rather than as craft. */}
                <motion.div
                  aria-hidden
                  initial={reduced ? false : { opacity: 0, scale: 1.06 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-12% 0px' }}
                  transition={{ duration: 1.3, ease: EASE }}
                  className="pointer-events-none absolute inset-0 -z-20"
                >
                <img
                  src={`${import.meta.env.BASE_URL}images/solution/sectors/${s.image}`}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  /* The lit value is published as a CSS variable and read back
                     by the `group-hover:` utility below, so hover (CSS) and
                     touch (the inline branch) cannot drift apart — LIT is the
                     only place the number exists. It used to be written twice,
                     which meant a phone and a laptop could brighten to two
                     different levels from one edit.

                     Touch has to be inline rather than a second class: the rest
                     opacity and the lit opacity are both plain utilities, so
                     which one won would depend on stylesheet order rather than
                     on which is applied. Inline outranks both and settles it.

                     Ramping IN faster than it fades out is deliberate. The
                     class below runs at 900ms, which is right for a mouse
                     drifting across a row but useless for a tap: a touch that
                     lasts 200ms would never get near full brightness. So a held
                     row lights in 260ms, then releases back down the slow
                     900ms path once these properties are dropped. */
                  style={{
                    objectPosition: `center ${s.focus || '50%'}`,
                    '--sector-rest': REST,
                    '--sector-lit': LIT,
                    ...(heldIndex === i
                      ? {
                          opacity: LIT,
                          transitionDuration: '260ms',
                          ...(reduced ? null : { transform: 'scale(1.05)' }),
                        }
                      : null),
                  }}
                  /* `opacity-[var(--sector-rest)]` rather than a literal, for
                     the same reason the lit value is a variable: REST is set
                     once in JS and read by both the class here and the touch
                     branch above, so a phone and a laptop cannot end up sitting
                     at two different rest brightnesses.

                     Positioning moved to the wrapper — this now just fills it. */
                  className="pointer-events-none h-full w-full select-none object-cover opacity-[var(--sector-rest)] transition-all duration-[900ms] ease-out [-webkit-user-drag:none] group-hover:scale-[1.05] group-hover:opacity-[var(--sector-lit)] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                </motion.div>
                {/* Directional, not a flat wash — the same rule the problem
                    band follows. The copy column keeps a near-solid ground for
                    contrast while the far side of the frame stays open, which
                    is what leaves the picture readable as a picture. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/0"
                />
              </>
            )}

            {/* THE WORDS ARRIVE SECOND, over a picture that is already there.

                Three staggered parts rather than one block, because a rule, a
                name and a sentence landing together is a card appearing —
                landing in sequence is a caption being written. The delays are
                measured from the picture's own entry (1.3s), not from zero:
                0.3 puts the rule in while the frame is still settling, and the
                sentence closes at 0.62 just as it comes to rest.

                The whole group is offset by the row's parity so the two columns
                of a desktop grid do not fire in lockstep — the same 0.08 the
                old Reveal used.

                Text-shadow as well as the scrim: at hover brightness a light
                ceiling or a window in frame can still come up under the body
                copy, and the gradient alone does not carry it. */}
            <div
              className={
                s.image
                  ? '[text-shadow:0_1px_3px_rgba(0,0,0,0.9),0_4px_18px_rgba(0,0,0,0.7)]'
                  : undefined
              }
            >
              <Words delay={0.3 + (i % 2) * 0.08} reduced={reduced}>
                <div className="flex items-baseline gap-6">
                  <span className="text-sm font-semibold tracking-widest text-accent-400">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </Words>
              <Words delay={0.46 + (i % 2) * 0.08} reduced={reduced}>
                <h3 className="mt-6 text-[clamp(1.3rem,2vw,1.9rem)] leading-[1.15] font-bold tracking-tight text-white">
                  {s.name}
                </h3>
              </Words>
              <Words delay={0.62 + (i % 2) * 0.08} reduced={reduced}>
                {/* `text-white/85`, up from the Lede default of /75. Over a
                    photograph the muted grey that reads as restraint on flat
                    ink reads as washed out instead. */}
                <Lede className={`mt-4 max-w-md ${s.image ? 'text-white/85' : ''}`}>
                  {s.body}
                </Lede>
              </Words>
            </div>
          </div>
        ))}
      </div>

      {/* Kept larger than the offsets above it — this is the seam between the
          sector list and the client wall, the one real break inside the
          section, so it has to out-space the gaps it separates. */}
      <div className="mt-16 sm:mt-20">
        <Reveal>
          <Eyebrow>Clients</Eyebrow>
          <Display className="mt-7 max-w-[20ch]">Who we work with.</Display>
        </Reveal>
      </div>

      {/* A logo wall. Columns follow the count so two marks fill the row rather
          than leaving a third column empty — add a third client and it becomes
          a three-up on its own. */}
      <div
        id="work"
        /* Left-aligned, not centred. A centred logo wall is the convention, but
           every headline, rule and list on this page hangs off the left gutter
           — centring these two put them adrift in the middle of the section
           with the headline pointing somewhere else. */
        className="mt-12 flex flex-wrap items-center gap-x-16 gap-y-14 scroll-mt-28 sm:mt-16 sm:gap-x-28 lg:gap-x-40"
      >
        {SHOWN.map((client, i) => (
          <Reveal key={client.id} delay={i * 0.1}>
            {/* A fixed-height row rather than a fixed-width cell: marks vary
                enormously in width and a grid column would leave the narrow
                ones adrift in white space. Centred and wrapping, so the wall
                stays balanced at any count without changing the column rule.

                `max-h` is a share of THIS height — see `logoClass`. */}
            <div className="flex h-28 items-center justify-center sm:h-36 lg:h-44">
              <img
                src={`${import.meta.env.BASE_URL}images/solution/clients/${client.logo}`}
                alt={`${client.name} logo`}
                loading="lazy"
                decoding="async"
                draggable={false}
                /* Every file is trimmed to its ink, so these caps act on the
                   mark itself rather than on baked-in transparent padding —
                   which is what made one look half the size of the other
                   despite both filling the same 512px canvas. */
                className={`w-auto max-w-full select-none object-contain [-webkit-user-drag:none] ${
                  client.logoClass || 'max-h-full'
                }`}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}

/* One line of the caption, lifting in over the picture.

   `margin: '-12% 0px'` matches the picture layer above it exactly. Both parts
   of a row therefore trigger on the SAME scroll position and separate purely by
   delay — if these two viewports drifted apart, a row entering slowly from the
   bottom of a tall screen could fire its copy before its photograph.

   Reduced motion gets the text immediately and unmoved. Someone who asked their
   OS for less motion should not have to wait out a choreography to read a list;
   `initial={false}` skips the animation entirely rather than shortening it. */
function Words({ children, delay, reduced }) {
  if (reduced) return children
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
