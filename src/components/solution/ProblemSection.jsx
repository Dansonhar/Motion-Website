import { motion } from 'framer-motion'
import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Megaphone,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Star,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react'
import { Display, EASE, Eyebrow, Lede, Reveal } from './SolutionPrimitives.jsx'

/* The invisible complexity behind any serious operation, whatever the sector.

   Every line is written to hold in any industry we work in — no software names,
   no product names, nothing that ties an item to one trade. And no claims: each
   body says what the part IS, not what we improve about it, because the section
   is stating the problem and has not named a solution yet.

   The point is still the WEIGHT of the list. The cards make each part legible;
   they are not twelve features being sold. */
const MOVING_PARTS = [
  { name: 'Customers', icon: Users, body: 'Profiles, history and preferences, held as one record.' },
  { name: 'Orders', icon: ShoppingBag, body: 'Taken, tracked and fulfilled without being re-keyed.' },
  { name: 'Payments', icon: CreditCard, body: 'Every channel settling through one payment layer.' },
  { name: 'Reservations', icon: CalendarCheck, body: 'Bookings and scheduling matched to real capacity.' },
  { name: 'Staff', icon: UserCog, body: 'Teams, roles, shifts and who is responsible for what.' },
  { name: 'Inventory', icon: Package, body: 'What is in stock, what is moving, what is running out.' },
  { name: 'Marketing', icon: Megaphone, body: 'Reaching customers the business already knows.' },
  { name: 'Loyalty', icon: Star, body: 'A reason to return, tied to the same customer record.' },
  { name: 'Reporting', icon: BarChart3, body: 'The day’s numbers without assembling them by hand.' },
  { name: 'Multiple locations', icon: MapPin, body: 'One standard held across every site that trades.' },
  { name: 'Management', icon: ShieldCheck, body: 'Oversight that does not depend on being on the floor.' },
  { name: 'Growth', icon: TrendingUp, body: 'New sites, formats and volume the operation has to carry.' },
]

/* ---------------------------------------------------------------------------
   Section 2 — the problem, stated editorially. No solution named yet.
   --------------------------------------------------------------------------- */
export default function ProblemSection() {
  return (
    /* Padding is set here rather than by SectionShell, and is hand-matched to
       it — keep these in step with the shell's `py-14 sm:py-16 lg:py-20` or this
       section sits at a different rhythm to the five that use the shell. */
    <section id="about" aria-label="The problem" className="pt-14 sm:pt-16 lg:pt-20">
      {/* The page's section rule, kept above the band. Without it this reads as
          a page opening rather than as the second section. */}
      <div className="px-6 sm:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="sol-rule mb-10 w-full sm:mb-12" />
        </div>
      </div>

      {/* Full-bleed band: the picture runs edge to edge with the headline on
          it. No `SectionShell` here — its gutter and max-width are what would
          stop the image reaching the screen edges.

          NOT viewport height. Copy over a full-bleed photo at 100svh is the
          hero's own recipe, and at that size this band competed with the real
          hero instead of supporting it. Roughly half a screen, with page
          showing above and below, keeps it a band inside a section.

          The image is NOT dimmed as a whole. Standing feedback on this site is
          that a flat wash reads "too dark", so legibility comes from a
          directional scrim under the copy column plus text-shadow on the type.
          The right half of the frame stays at full brightness. */}
      <div className="relative isolate flex min-h-[38svh] w-full items-center overflow-hidden py-16 sm:min-h-[48svh] sm:py-20">
        <img
          src={`${import.meta.env.BASE_URL}images/solution/story-01-before-open.jpg`}
          alt="A room being set before it trades — staff prepping, counters ready, no customers yet"
          draggable={false}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover [-webkit-user-drag:none]"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/95 via-ink-950/45 to-transparent" />
        {/* Seam into the list below, so the band resolves rather than stopping. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

        <div className="mx-auto w-full max-w-[1500px] px-6 [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_3px_12px_rgba(0,0,0,0.85),0_10px_40px_rgba(0,0,0,0.7)] sm:px-10">
          <Reveal>
            <Eyebrow>The reality of the business</Eyebrow>
            <Display className="mt-7 max-w-[18ch]">
              A successful business is more than what the customer sees.
            </Display>
          </Reveal>
        </div>
      </div>

      {/* Everything below returns to the page's normal gutter and rhythm. */}
      <div className="px-6 pb-14 pt-12 sm:px-10 sm:pb-16 sm:pt-14 lg:pb-20">
        <div className="mx-auto max-w-[1500px]">
          {/* Separated cards on a lit ground, not a hairline table. Because the
              cards no longer share borders, an incomplete row is harmless here
              — the count is free to change (it was locked to twelve when this
              was a `gap-px` grid, where an empty cell showed as a grey block).

              The arc and wash behind the grid are pure CSS — a huge, very faint
              ellipse plus one radial glow. No image, no extra download. */}
          {/* `overflow-hidden`, not `overflow-x-hidden`: the arc is wider than
              this container on purpose, and without clipping it pushed the
              whole page into horizontal scroll. Hiding only the x axis would
              compute `overflow-y: auto` and turn this into a scroll container. */}
          <div className="relative isolate overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-20%] -top-32 -z-10 h-[520px] rounded-[50%] border-t border-white/10 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,255,255,0.055),transparent_70%)]"
            />

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {MOVING_PARTS.map((part, i) => {
                const Icon = part.icon
                return (
                  <motion.li
                    key={part.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8% 0px' }}
                    transition={{ duration: 0.8, delay: (i % 4) * 0.07, ease: EASE }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.055] sm:p-7"
                  >
                    {/* Corner glow, lifted on hover. Behind the content. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(255,255,255,0.10),transparent_60%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <span className="absolute right-5 top-5 text-[11px] font-semibold tracking-widest text-white/45 transition-colors duration-500 group-hover:text-accent-400 sm:right-7 sm:top-7">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Icon beside the copy on phones, above it from `sm`. A
                        single column of twelve stacked cards ran to ~2500px;
                        laying each one out horizontally roughly halves that
                        without dropping any of the copy. */}
                    <div className="flex items-start gap-4 sm:block">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white shadow-[0_0_22px_-6px_rgba(255,255,255,0.5)] transition-colors duration-500 group-hover:border-white/30">
                        <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                      </span>

                      <div className="min-w-0 pr-8 sm:mt-6 sm:pr-0">
                        <h3 className="text-[clamp(1.05rem,1.4vw,1.35rem)] font-bold leading-tight tracking-tight text-white">
                          {part.name}
                        </h3>
                        <p className="mt-2.5 text-[0.9rem] leading-relaxed text-white/60">
                          {part.body}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12">
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="text-[clamp(1.35rem,2.3vw,2.15rem)] leading-[1.35] font-bold tracking-tight text-white">
                  When these parts operate separately, complexity grows with the
                  business.
                </p>
                <Lede className="mt-8">We bring them together.</Lede>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
