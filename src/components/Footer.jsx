import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAttraction } from '../attractions.jsx'
import Logo from './Logo.jsx'

/* ---------------------------------------------------------------------------
   Site footer.

   ONE RULE, AND IT IS THE REASON THIS FILE WAS REWRITTEN: a link in here goes
   to a section that exists on the page the visitor is currently reading.

   It used to hold three columns — a per-attraction "Solutions" list plus a
   shared Company (About, Contact, Support, Partners) and Resources
   (Documentation, Installation, Case Studies, FAQ) — and every single one of
   those twelve links was `href="#top"`. None of those eight shared labels
   named anything that has ever been built here, so clicking "Documentation"
   silently threw the reader back to the hero. A footer full of labels that go
   nowhere reads as an unfinished site, and it hides the eleven real sections
   the nav has no room for.

   So the columns now come from each attraction's own `footer.columns`, where a
   link is `{ label, href }` and the href is a real section id — checked
   against the page's markup, not invented. An attraction with no `columns`
   (Salons & Spa, which is a single screen) falls back to its nav links, and if
   it has none of those either the columns disappear rather than render empty.
   Nothing in here needs a page we have not written.
   --------------------------------------------------------------------------- */
export default function Footer() {
  const { current } = useAttraction()
  const blurb =
    current.footer?.blurb ??
    'A connected access system pairing self-service kiosks with secure, verified entry.'

  // Fallback for a vertical that has not declared footer columns: its nav
  // links already point at real sections, so they are the safe default.
  const columns = (
    current.footer?.columns ??
    (current.links?.length ? [{ heading: 'Explore', links: current.links }] : [])
  ).filter((column) => column.links?.length)

  // The footer's own call to action, per attraction — the same destination the
  // navbar offers, for a reader who got here by scrolling past it.
  const cta = current.cta ?? { label: 'Book a Demo', href: '#contact' }

  // Theme Park's hero is `#park-top`, not `#top` — see `topHref` in
  // attractions.jsx. Hard-coding "#top" here made back-to-top a no-op there.
  const topHref = current.topHref ?? '#top'

  return (
    <footer className="border-t border-white/8 bg-ink-950 px-5 py-14 sm:px-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        {/* ONE GRID, EQUAL TRACKS, AND THE TRACK COUNT FOLLOWS THE CONTENT.

            Two layouts have been wrong here for the same reason — a column
            count fixed in the class list while the number of columns is
            per-attraction. First `md:grid-cols-[1.5fr_repeat(3,1fr)]`, which
            left dead tracks for any page with fewer than three. Then
            `md:justify-between`, which was worse: the brand block is capped
            (it has to be, or the blurb runs to 20 words a line) so the links
            were shoved against the right edge and the leftover width opened
            as a ~400px hole in the middle of the footer.

            `--footer-cols` is the brand block plus however many columns the
            attraction declares, so every track is the same width and every gap
            between them is the same `gap-x`. Solution and Gym and QStudio
            (two columns) render as thirds; Theme Park (one) as halves. No page
            gets a gap the others do not.

            Mobile is two tracks regardless — the brand spans both, then the
            columns sit side by side, because one column of five labels above
            another was a long scroll of nothing but links. */}
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[repeat(var(--footer-cols),minmax(0,1fr))] md:gap-x-10 md:gap-y-12 lg:gap-x-14"
          style={{ '--footer-cols': columns.length + 1 }}
        >
          {/* `max-w-xs` on the copy only, NOT on this cell — the cell is a
              grid track and capping it would reopen the gap this layout is
              here to close. The measure is set on the paragraph, which is the
              only thing that needs one. */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {blurb}
            </p>
            <a
              href={cta.href}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-accent-400/60 hover:text-accent-400"
            >
              {cta.label}
              <ArrowRight
                size={15}
                strokeWidth={2.4}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="min-w-0">
              <h3 className="text-sm font-semibold text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {/* `py-2` is the tap target, not decoration — the old
                        links were 20px tall on a phone and sat 12px apart,
                        which is under every touch-size guideline going.
                        `block` + padding gives ~36px of hit area without
                        changing how the column looks. */}
                    <a
                      href={link.href}
                      className="block py-2 text-sm leading-snug text-white/50 transition-all duration-200 hover:translate-x-1 hover:text-accent-400 md:py-1.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-sm text-white/60 sm:flex-row">
          {/* The company, not the vertical. `brandA`/`brandB` name the product
              line for each attraction (GymAccess, ParkAccess, Solution), so
              this line used to claim copyright for a company called "Solution"
              directly under a logo that reads Q Studio. One owner, one name. */}
          <p>© 2026 Q Studio. All rights reserved.</p>
          {/* Privacy and Terms stood here and both went to #top. There are no
              such documents on this site, and a legal link that quietly does
              nothing is worse than an absent one — it is the link a visitor is
              most likely to trust. Back to top is a promise this page can
              actually keep. */}
          <a
            href={topHref}
            className="min-h-11 py-2 transition-colors hover:text-white/80"
          >
            Back to top
          </a>
        </div>
      </motion.div>
    </footer>
  )
}
