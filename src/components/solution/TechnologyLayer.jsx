import { CinematicVideo } from './SolutionMedia.jsx'
import { Display, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 7 — the technology layer.

   Deliberately near the end of the page, not the front. It is the spec sheet,
   not the pitch: the device, its name, nothing else.

   Stills carry the grid and only one cell moves. Six autoplaying films
   three-across would make the last section the loudest one and undo the
   ordering the whole page argues for — so a second film is a decision, not a
   default.

   Each system is a category, not a product name, and each is deliberately broad
   enough to mean something in any sector — a kiosk sells tickets at an
   attraction and signs up members at a gym.

   COUNT MUST BE A MULTIPLE OF SIX. The grid is `gap-px` over a `bg-white/10`
   container with `bg-ink-950` cells, so it reads as a hairline table — and an
   incomplete row leaves the container's light background showing through as a
   grey block. Two columns at `sm`, three at `lg`, so only multiples of six fill
   every row on both. Adding a seventh entry means going to twelve.

   Access & Admission (gates, turnstiles, verified entry) is the strongest
   candidate for a seventh — see the Gym and Theme Park verticals, which are
   built around exactly that. It is left out here because every sector needs a
   customer record while only some have gates. Swap it for one of these six, or
   go to twelve.

   A SLOT WITHOUT A `name` STAYS A PLACEHOLDER, and the grid, numbering and
   motion do not change either way — so a system can be pulled back out without
   touching the layout. Optional `body` and `href` per entry.

   `image` names a file in public/images/solution/tech/ and is the device
   itself. A cell with an image drops its `body`: the picture is the
   description, and printing both would say the same thing twice.

   The supplied set is six selling devices, so the section is now the six ways a
   customer can transact — not the whole stack. Payments, Customer & Loyalty and
   Backoffice & Analytics came out with the old copy; they are software layers
   with no object to photograph. Restoring them means going to twelve cells (see
   the multiple-of-six rule above) or a separate text block.
   --------------------------------------------------------------------------- */
/* Ordered by how much staff involvement the sale takes: fully staffed at the
   counter, then staff on the floor, then the customer serving themselves, then
   the business selling with nobody present at all.

   A real ’ character in any body string, not `&rsquo;` — these are JS strings,
   not JSX text, so an HTML entity would render literally. */
const SYSTEMS = [
  /* A cell takes either a still or a film. `video` wins, and `image` is its
     poster so the tile is never empty while the file loads.

     The remaining cells are named and nothing else — add `image: '<file>.jpg'`
     (in public/images/solution/tech/) or `video: '<file>.mp4'` (in
     public/video/solution/tech/) to fill any of them and the cell picks it up
     with no other change.

     Both films are authored 960x960 and cropped to the tile at encode time,
     18% down from the top — the same offset for both, so they read as one set
     rather than two crops. */
  { id: 'pos', name: 'Point of Sale', video: 'pos.mp4', image: 'pos-poster.jpg' },
  { id: 'mobile-pos', name: 'Mobile POS', video: 'mpos.mp4', image: 'mpos-poster.jpg' },
  { id: 'table', name: 'Table Ordering' },
  { id: 'kiosk', name: 'Self-Service Kiosk' },
  { id: 'qr', name: 'QR Ordering' },
  { id: 'online', name: 'Online Store' },
]

export default function TechnologyLayer() {
  return (
    <SectionShell label="The technology behind the operation" className="bg-ink-900">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Underneath</Eyebrow>
            <Display className="mt-7 max-w-[16ch]">
              The technology behind the operation.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.12}>
            <Lede>
              The right technology should disappear into the business, whatever
              that business sells — connecting the customer experience, staff
              operations and management without creating more complexity.
            </Lede>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:mt-28 sm:grid-cols-2 lg:grid-cols-3">
        {SYSTEMS.map((system, i) => (
          <SystemSlot key={system.id} system={system} index={i} />
        ))}
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
