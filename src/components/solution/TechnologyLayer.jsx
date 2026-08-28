import { CinematicVideo } from './SolutionMedia.jsx'
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

   ALL NINE ARE FILM. Cells 01-06 are the places a customer transacts; 07-09
   are what the system holds about that customer — identity, reservation,
   entitlement.

   07-09 shipped first as LIVE INTERFACES rendered from product/screens.jsx,
   through a `screen` field on the entry, because there was no footage for them
   yet. The footage landed and they were swapped to film. That `screen` path
   has been REMOVED rather than left in: it cost this page the whole 18kB
   screens chunk on every visit for a branch no entry used any more. It is one
   revert away in git if a future cell has no object to photograph — Payments
   and Backoffice & Analytics, the obvious 10 and 11, are exactly that kind of
   thing (read the grid note above before adding either).
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
  /* `membership.mp4` is the one to know about: its source is PORTRAIT
     (720x1280) where every other clip here is landscape, so filling this tile
     costs 61% of its height. The band was chosen by eye at y=390 — the only
     offset that keeps faces off the top edge AND the member-profile screen in
     the last shot, which is the frame that actually says "membership". Re-cut
     it and that offset has to be re-judged, not carried over.

     Its source also carried an AAC track, stripped on encode: these tiles
     autoplay muted and none of the other eight has audio. */
  { id: 'access', name: 'Access & Face ID', video: 'access.mp4', image: 'access-poster.jpg' },
  { id: 'booking', name: 'Booking', video: 'booking.mp4', image: 'booking-poster.jpg' },
  {
    id: 'membership',
    name: 'Membership',
    video: 'membership.mp4',
    image: 'membership-poster.jpg',
  },
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
  const media = video || image

  return (
    /* The opaque cell is this outer div, NOT the animated one. The grid is
       `gap-px` over a `bg-white/10` container, so anything at `opacity: 0`
       lets that light background show through — and Reveal holds a cell at
       zero until it scrolls into view. Animating the grid item itself turned
       every not-yet-revealed row into a grey block. Only the contents fade. */
    <div className="bg-ink-950">
      <Reveal delay={(index % 3) * 0.07}>
        <div className="group flex min-h-[220px] flex-col justify-between gap-8 p-8 transition-colors duration-500 hover:bg-ink-900 sm:min-h-[260px] sm:p-10">
        <span className="text-sm font-semibold tracking-widest text-accent-400">
          {String(index + 1).padStart(2, '0')}
        </span>

        {filled ? (
          <div>
            {video ? (
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
