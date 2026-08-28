import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { CinematicVideo } from './SolutionMedia.jsx'
import { ProductScreen } from '../../product/screens.jsx'
import { Display, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 7 — the technology layer.

   Deliberately near the end of the page, not the front. It is the spec sheet,
   not the pitch: the device, its name, nothing else.

   All six cells now autoplay. That is a lot of motion for the last section on a
   page whose whole argument is that technology comes last — it was a deliberate
   call, not a drift. Every film is muted, loops, and does not load until its
   tile is near the viewport, so the cost is attention rather than bandwidth.

   Each system is a category, not a product name, and each is deliberately broad
   enough to mean something in any sector — a kiosk sells tickets at an
   attraction and signs up members at a gym.

   THE COUNT AND THE GRID. This is `gap-px` over a `bg-white/10` container with
   `bg-ink-950` cells, so it reads as a hairline table — which means an
   incomplete row leaves the container's light background showing through as a
   grey block. The layout is two columns at `sm` and three at `lg`, so a count
   has to divide by BOTH to fill every row at every width.

   Nine does not: it fills three rows at `lg` and leaves half a row empty at
   `sm`. That gap is closed by a single filler cell at the end of the grid,
   `hidden sm:block lg:hidden` — the only width where nine is short. Changing
   the count means re-checking that cell: a tenth entry would need it inverted
   (even at `sm`, two short at `lg`), and twelve would need it removed.

   Access & Admission used to be listed here as the strongest candidate for a
   seventh cell and was left out on the grounds that every sector needs a
   customer record while only some have gates. It is in now, along with the two
   things a gate needs behind it — the booking that reserved the slot and the
   membership that entitles it.

   A SLOT WITHOUT A `name` STAYS A PLACEHOLDER, and the grid, numbering and
   motion do not change either way — so a system can be pulled back out without
   touching the layout. Optional `body` and `href` per entry.

   `image` names a file in public/images/solution/tech/ and is the device
   itself. A cell with an image drops its `body`: the picture is the
   description, and printing both would say the same thing twice.

   TWO KINDS OF CELL, AND THE SPLIT IS THE ARGUMENT. Cells 01-06 are the places
   a customer transacts, and they are film of the actual device. Cells 07-09 are
   what the system holds about that customer — identity, reservation,
   entitlement — and those have no object to photograph, so they show the
   interface itself, live, via `screen`.

   That is not a compromise for missing footage. Shooting a "membership" would
   mean shooting a person, which says nothing about the system; the wallet
   screen says all of it. The three are rendered from product/screens.jsx —
   the same components QStudio uses — so they cannot drift from the product.

   Payments and Backoffice & Analytics are still missing and are the obvious
   candidates for 10 and 11 (see the grid note above before adding either).
   --------------------------------------------------------------------------- */
/* Ordered by how much staff involvement the sale takes: fully staffed at the
   counter, then staff on the floor, then the customer serving themselves, then
   the business selling with nobody present at all.

   A real ’ character in any body string, not `&rsquo;` — these are JS strings,
   not JSX text, so an HTML entity would render literally. */
const SYSTEMS = [
  /* A cell takes either a still or a film. `video` wins, and `image` is its
     poster so the tile is never empty while the file loads.

     A cell is filled by naming its file: `image: '<file>.jpg'` in
     public/images/solution/tech/, `video: '<file>.mp4'` in
     public/video/solution/tech/. Nothing else changes.

     Every film arrives square — 960x960 or 1080x1080 — and is cropped to the
     tile at encode time rather than by the browser, so nothing decodes pixels
     the frame discards. The vertical offset follows what the shot is about:
     18% where a person carries it (pos, mpos, table), 10% where a screen does
     (kiosk, qr, online), since a screen needs its top edge kept.

     All six are re-encoded to H.264. One source arrived as HEVC, which Chrome
     and Firefox will not play in an MP4 at all — it would have shown a black
     tile everywhere but Safari. Check the codec of anything dropped in here. */
  { id: 'pos', name: 'POS', video: 'pos.mp4', image: 'pos-poster.jpg' },
  { id: 'mobile-pos', name: 'Mobile POS', video: 'mpos.mp4', image: 'mpos-poster.jpg' },
  { id: 'table', name: 'Table Ordering', video: 'table.mp4', image: 'table-poster.jpg' },
  { id: 'kiosk', name: 'Self-Service Kiosk', video: 'kiosk.mp4', image: 'kiosk-poster.jpg' },
  { id: 'qr', name: 'QR Ordering', video: 'qr.mp4', image: 'qr-poster.jpg' },
  { id: 'online', name: 'Webstore', video: 'online.mp4', image: 'online-poster.jpg' },

  /* 07-09. `screen` addresses a component in product/screens.jsx and takes the
     place of `video`/`image` — see the note on the two kinds of cell above.
     Each one is the real interface, not a picture of a device running it. */
  /* `fade` marks a screen whose list is LONGER than a landscape tile can show,
     so the bottom edge gets a scrim and the last row reads as continuing
     rather than as cropped. Face ID is not one of them: it ends in a complete
     status bar that has to stay legible, and a scrim over it just looked like
     the cell was dimming for no reason. */
  { id: 'access', name: 'Access & Face ID', screen: 'faceid' },
  { id: 'booking', name: 'Booking', screen: 'booking', fade: true },
  { id: 'membership', name: 'Membership', screen: 'member', fade: true },
]

export default function TechnologyLayer() {
  return (
    <SectionShell label="Where the business meets its customers" className="bg-ink-900">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            {/* This said "Underneath" / "The technology behind the operation" —
                but every tile below is a surface the CUSTOMER touches, which is
                in front of the operation, not behind it. Nothing underneath was
                ever shown.

                Then it said "Every place the business sells", which was exact
                while the grid held six selling devices and became wrong the
                moment a gate, a booking and a membership were added — none of
                which is a sale. "Meets a customer" covers all nine: the ones
                that take the money, the one that opens the door, and the two
                that remember who they are. Re-read this if the grid changes
                again. */}
            <Eyebrow>The technology</Eyebrow>
            <Display className="mt-7 max-w-[16ch]">
              Every place the business meets a customer.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.12}>
            <Lede>
              Counter, floor, self-service, table, phone and online — plus the
              gate they walk through, the slot they reserved and the membership
              that entitles them to it. Every one of them running on the same
              system, so the business is not operating a different one for each
              way a customer arrives.
            </Lede>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {SYSTEMS.map((system, i) => (
          <SystemSlot key={system.id} system={system} index={i} />
        ))}
        {/* Nine cells fill three rows at `lg` and two-and-a-half at `sm`, and
            the half row would show the container's `bg-white/10` through the
            gap as a pale block. This is that missing half — an opaque cell,
            present only at the one width that needs it. See the grid note at
            the top of the file before changing the count. */}
        <div aria-hidden className="hidden bg-ink-950 sm:block lg:hidden" />
      </div>
    </SectionShell>
  )
}

function SystemSlot({ system, index }) {
  const filled = Boolean(system.name)
  const base = import.meta.env.BASE_URL
  const image = system.image ? `${base}images/solution/tech/${system.image}` : null
  const video = system.video ? `${base}video/solution/tech/${system.video}` : null
  const media = video || image || system.screen

  /* The interface cells are MOUNTED ON ENTRY, not on page load, and that is the
     whole point of this ref.

     Every screen animates itself on mount — the face scan sweeps once and lands
     on "Matched", the booking and wallet rows stagger in. Rendered with the
     rest of the page those animations run while the section is a thousand
     pixels below the fold, and a visitor scrolling down arrives at three
     finished, static screens having seen none of it.

     `once: true` so they play through exactly once and then hold, which matches
     the films beside them: those start on viewport entry too and are not
     restarted every time the row passes. */
  const slotRef = useRef(null)
  const inView = useInView(slotRef, { once: true, margin: '0px 0px -10% 0px' })

  return (
    /* The opaque cell is this outer div, NOT the animated one. The grid is
       `gap-px` over a `bg-white/10` container, so anything at `opacity: 0`
       lets that light background show through — and Reveal holds a cell at
       zero until it scrolls into view. Animating the grid item itself turned
       every not-yet-revealed row into a grey block. Only the contents fade. */
    <div ref={slotRef} className="bg-ink-950">
      <Reveal delay={(index % 3) * 0.07}>
        <div className="group flex min-h-[220px] flex-col justify-between gap-8 p-8 transition-colors duration-500 hover:bg-ink-900 sm:min-h-[260px] sm:p-10">
        <span className="text-sm font-semibold tracking-widest text-accent-400">
          {String(index + 1).padStart(2, '0')}
        </span>

        {filled ? (
          <div>
            {system.screen ? (
              /* The interface itself, in the same frame the films use, so the
                 nine cells stay one table rather than two. No `Device` chrome
                 around it on purpose: a bezel here would be a SECOND device
                 drawn beside six photographs of real ones, and the drawn one
                 always loses. The screen runs edge to edge instead and reads
                 as what it is — a picture of the software, not of a gadget. */
              <div className="relative mb-7 aspect-[683/472] w-full overflow-hidden rounded-lg border border-white/10 bg-ink-900">
                {inView && <ProductScreen name={system.screen} />}
                {/* See `fade` in SYSTEMS — only the screens that actually run
                    past the frame get this. `pointer-events-none` so it never
                    sits between the screen and a cursor. */}
                {system.fade && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-900 to-transparent"
                  />
                )}
              </div>
            ) : video ? (
              /* CinematicVideo rather than a bare <video>: it brings the lazy
                 start (nothing downloads until the tile is near the viewport),
                 the poster, and the drag-lock the rest of the page uses. */
              <CinematicVideo
                ratio="tile"
                src={video}
                poster={image || undefined}
                label={system.name}
                className="mb-7 w-full rounded-lg"
              />
            ) : (
              image && (
                <img
                  src={image}
                  alt={system.name}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  /* These carry their own backgrounds, so they are shown whole
                     in a fixed frame rather than floated on the cell — every
                     source is authored 683x472, so nothing is cropped. */
                  className="pointer-events-none mb-7 aspect-[683/472] w-full select-none rounded-lg object-cover [-webkit-user-drag:none]"
                />
              )
            )}
            <h3 className="text-[clamp(1.25rem,1.8vw,1.7rem)] font-bold tracking-tight text-white">
              {system.name}
            </h3>
            {/* The picture is the description — a cell showing the device does
                not also spell it out. Not <Lede> either: its clamp() font-size
                and this tile's smaller one are both arbitrary utilities, so
                which wins depends on stylesheet order rather than class order.
                Set it directly, as SolutionAreas does for the same reason. */}
            {!media && system.body && (
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/75">{system.body}</p>
            )}
          </div>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-widest text-white/55">
              [ System Placeholder ]
            </span>
          )}
        </div>
      </Reveal>
    </div>
  )
}
