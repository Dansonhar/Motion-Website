import { createContext, useContext, useState } from 'react'

// The verticals the site can present. Add a new entry here + a matching site
// component to introduce another attraction type.
//
// ARRAY ORDER IS THE SWITCHER ORDER — every Attractions menu renders this list
// as-is, so moving an entry here moves it in the UI. It is ordered by what we
// lead with, not alphabetically or by build date: Solution first (the practice
// itself), QStudio second (the product), then the sector stories. Entries
// carrying `hidden` are filtered out of the switcher by the provider and do not
// take a slot. Four are hidden today — Gym, Theme Park, Salons & Spa and
// Mostar — so the menu shows Solution and QStudio only.
//
// TWO FLAGS, AND THEY MEAN DIFFERENT THINGS.
//
//   `hidden`    not offered in the switcher. The page is live and still renders
//               when something links to it. Gym and Theme Park are hidden
//               because the Solution industry chooser is the route to them, and
//               listing them twice made the switcher a duplicate of that
//               section.
//   `withdrawn` additionally, a stored selection pointing here is not restored.
//               For a page taken out of service, not one merely de-listed. Only
//               Salons & Spa carries it.
//
// The distinction is load-bearing: without it, hiding Gym would mean a visitor
// who opened it from the chooser got bounced back to the default on reload,
// because the provider used to reject any stored `hidden` id.
//
// The landing default is DERIVED from this list rather than named — see
// DEFAULT_ID below — so it can never point at a page the switcher does not
// offer.
export const ATTRACTIONS = [
  {
    id: 'solution',
    label: 'Solution',
    brandA: 'Solution',
    brandB: '',
    available: true,
    // In page order, and each label names what the reader actually lands on.
    // "About" pointed at #about — which is the problem statement, written about
    // the CUSTOMER's business, not about us. Anyone clicking it expected to
    // find out who Q Studio is and got a list of their own moving parts.
    links: [
      { label: 'The Business', href: '#about' },
      { label: 'Solutions', href: '#solutions' },
      // Was "Approach" -> #approach, the six-stage list. That section is gone;
      // the industry chooser stands in its place and this points at it.
      { label: 'Your Industry', href: '#choose' },
      { label: 'Industries', href: '#industries' },
      { label: 'Work', href: '#work' },
    ],
    // This vertical sells a consulting engagement, not a product trial — the
    // shared "Book a Demo" CTA would undercut the whole positioning.
    cta: { label: 'Discuss Your Business', href: '#consultation' },
    /* NO `theme` ON PURPOSE — this page stays on the monochrome tokens.
       The lime belongs to STUDIO, which is QBot's own product and their own
       colour. Solution sells the practice, not the product, and it sits
       alongside Gym and Theme Park as one of the sector stories. Adding an
       accent here would make three of the five verticals look like one
       product line and the other two like a different company. */
    footer: {
      blurb:
        'We design the business behind the operation — connected systems for restaurants, retail, fitness, leisure and hospitality, built around the way each business needs to work.',
      /* EVERY LINK HERE HAS TO LAND SOMEWHERE. The old footer listed labels
         with no destination — the five solution areas and a Resources column
         (Documentation, Installation, Case Studies, FAQ) all pointed at #top,
         so a visitor clicking "Documentation" was thrown back to the hero for
         a page that does not exist. Each label below names a section this page
         actually renders and the href is that section's own id. */
      columns: [
        {
          heading: 'What We Solve',
          links: [
            { label: 'The Business', href: '#about' },
            { label: 'Customer Experience & Operations', href: '#solutions' },
            { label: 'Where We Meet Customers', href: '#technology' },
          ],
        },
        {
          heading: 'Work With Us',
          links: [
            { label: 'Choose Your Industry', href: '#choose' },
            { label: 'Industries We Work In', href: '#industries' },
            { label: 'Selected Work', href: '#work' },
            { label: 'Discuss Your Business', href: '#consultation' },
          ],
        },
      ],
    },
  },
  /* STUDIO — QBot's platform for membership businesses, and the only product
     page in this set. The rest are sector stories.

     POSITIONING, and every link below serves it: this page is written to be
     read by an OPERATOR WITH A BUDGET — someone running outlets, carrying
     payroll, answerable to a partner or a board. It is deliberately not written
     to convert a single-owner shop hunting the cheapest monthly fee. That is
     why the nav routes to what a real buyer evaluates (what it replaces, what
     it costs, how it is configured, how the data is governed) rather than to a
     feature tour, and why the CTA asks for a business review instead of a chat.

     Copy is drawn from qbot.now/qstudio. Nothing here is invented — see the
     header of QStudioSite.jsx, which holds the same rule and names the one
     number that is still yours to set. */
  {
    id: 'qstudio',
    label: 'QStudio',
    brandA: 'STUDIO',
    brandB: '',
    available: true,
    /* In page order. `#journey` and `#one` are pinned scroll rigs — anchoring
       into one lands the visitor at its first step, which is the intent.

       "Investment" is in the nav ON PURPOSE. A price shopper clicks it, reads
       "billed annually, on application", and leaves without ever reaching the
       form — which is the cheapest qualification this page can do. Hiding it
       would only push that same visitor into the sales queue. */
    links: [
      { label: 'The Journey', href: '#journey' },
      { label: 'Seven Jobs', href: '#jobs' },
      { label: 'What It Replaces', href: '#cost' },
      { label: 'Custom Build', href: '#custom' },
      { label: 'Compliance', href: '#governance' },
      { label: 'Investment', href: '#investment' },
    ],
    /* Not "Book a Demo". A demo is a product trial and costs the visitor
       nothing to ask for; a business review implies preparation on both sides
       and is the CTA a multi-outlet operator expects to see. */
    cta: { label: 'Request a Business Review', href: '#review' },
    // QBot's own accent, on the page that sells QBot's own product.
    theme: 'lime',
    footer: {
      blurb:
        'The operating system for membership-based, walk-in businesses — memberships, bookings, check-in and payments from sign-up to renewal on one system.',
      /* Named after the sections themselves, and each href is that section's
         id — the footer is the long form of the nav, reaching the eleven
         sections the six nav links do not have room for. Nothing here is a
         page we would have to build: "Security & PDPA" is #governance,
         "Standing" is #proof, and so on down the list. */
      columns: [
        {
          heading: 'The Product',
          links: [
            { label: 'The Journey', href: '#journey' },
            { label: 'Seven Jobs', href: '#jobs' },
            { label: 'What It Replaces', href: '#cost' },
            { label: 'Configured, Not Templated', href: '#custom' },
            { label: 'Who It Is For', href: '#who' },
            { label: 'At the Door', href: '#door' },
          ],
        },
        {
          heading: 'Before You Buy',
          links: [
            { label: 'Compliance & Data Ownership', href: '#governance' },
            { label: 'Standing', href: '#proof' },
            { label: 'Investment', href: '#investment' },
            { label: 'The Detail', href: '#more' },
            { label: 'Request a Business Review', href: '#review' },
          ],
        },
      ],
    },
  },
  /* Gym — live, and reached from the Solution industry chooser (door 01)
     rather than from the switcher. `hidden` only de-lists it; it is NOT
     `withdrawn`, so a visitor who opens it from that door stays on it across a
     reload. */
  {
    id: 'gym',
    label: 'Gym',
    brandA: 'Gym',
    brandB: 'Access',
    available: true,
    hidden: true,
    links: [
      { label: 'Solutions', href: '#solutions' },
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Hardware', href: '#hardware' },
      { label: 'Contact', href: '#contact' },
    ],
    footer: {
      blurb:
        'A connected gym entrance system pairing self-service kiosks with face-verified tripod turnstiles and AI tailgating detection.',
      /* Was: Membership Kiosk / Tripod Turnstile / Face Recognition / AI
         Monitoring, all four pointing at #top. Two of them named nothing on
         the page at all — there is no standalone face-recognition or
         monitoring section — and the hardware section is a SWING turnstile,
         so "Tripod Turnstile" sent the reader looking for the wrong gate.
         These are the five sections the page really has, under the headings
         those sections carry on screen. */
      columns: [
        {
          heading: 'Solutions',
          links: [
            { label: 'How It Works', href: '#solutions' },
            { label: 'Self-Service Kiosk', href: '#solutions-kiosk' },
            { label: 'Kiosk Features', href: '#features' },
            { label: 'Swing Turnstile', href: '#hardware' },
            { label: 'QSentry AI', href: '#qsentry' },
          ],
        },
        {
          heading: 'Why Gyms Run It',
          links: [
            { label: 'Operational Benefits', href: '#benefits' },
            { label: 'The Numbers', href: '#results' },
            { label: 'Book a Demo', href: '#contact' },
          ],
        },
      ],
    },
  },
  // Theme Park — same as Gym: live, reached from the chooser (door 02), de-listed
  // from the switcher rather than withdrawn.
  {
    id: 'themepark',
    label: 'Theme Park',
    brandA: 'Park',
    brandB: 'Access',
    available: true,
    hidden: true,
    links: [
      { label: 'Ticketing', href: '#park-channels' },
      { label: 'Kiosk', href: '#park-kiosk' },
      { label: 'Gates', href: '#park-gates' },
      { label: 'Contact', href: '#park-contact' },
    ],
    /* THIS PAGE HAS NO `#top`. Its hero is `#park-top` (the id has to be
       unique against the scroll rig), so the shared "#top" every other
       vertical uses — the footer's back-to-top, the default CTA — resolved to
       nothing here and the click did nothing at all. Both are stated. */
    topHref: '#park-top',
    cta: { label: 'Talk to Us', href: '#park-contact' },
    footer: {
      blurb:
        'A connected theme park platform — tickets, food, retail and gate entry running on one system.',
      /* The four selling channels (app, kiosk, POS, webstore) are four cards
         inside ONE section, so four separate links would all land on the same
         place and read as broken. The column names the section instead, the
         way it is titled on screen.

         SPLIT ACROSS TWO COLUMNS, like every other vertical. As a single
         column of four it was the only footer on the site with two tracks
         instead of three — the brand block then took half the row for 320px
         of blurb and left the difference as a hole in the middle, which is the
         exact spacing bug the layout was rebuilt to remove. Two columns of two
         is also the honest division: what you sell it through, and what the
         guest walks through. */
      columns: [
        {
          heading: 'Ticketing',
          links: [
            { label: 'Ticket Channels', href: '#park-channels' },
            { label: 'The Guest Journey', href: '#park-journey' },
          ],
        },
        {
          heading: 'At the Gate',
          links: [
            { label: 'Self-Service Kiosk', href: '#park-kiosk' },
            { label: 'Tripod Turnstile', href: '#park-gates' },
            { label: 'Talk to Us', href: '#park-contact' },
          ],
        },
      ],
    },
  },
  /* Salons & Spa — WITHDRAWN FROM VIEW, not deleted.

     `hidden: true` takes it out of every Attractions switcher (they all render
     the filtered list from the provider), and the matching door on the Solution
     industry chooser is hidden alongside it — see the note on `hidden` in
     IndustryChooser. The two have to move together: the reason this entry used
     to stay visible was that the chooser offered the sector publicly, and a
     door that opens has to have a room. With the door gone, nothing points here.

     The page is kept and still renders if selected directly, the same way
     Mostar does. `available: false` is also kept, so if this is ever un-hidden
     the switcher tags it "Soon" again and SalonSite still says so in full —
     un-hiding is one word in each of the two files, with no copy to rewrite. */
  {
    id: 'salon',
    label: 'Salons & Spa',
    brandA: 'Salon',
    brandB: 'Access',
    available: false,
    hidden: true,
    /* The one entry that is out of service rather than merely de-listed, so a
       stale stored selection is not restored onto it — anyone left here from
       before it was hidden lands on the default instead. */
    withdrawn: true,
    // No `theme` either — it is reached from Solution and has to match the
    // page the visitor just left, or the door reads as a broken link.
    // Nothing to anchor to — the page is one screen.
    links: [],
    /* The default CTA is "Book a Demo", which on a page that opens with "is
       being built" is the one sentence this page cannot say. There is nothing
       to demo yet; what we want from this visitor is a conversation. */
    cta: { label: 'Register Interest', href: '#top' },
    footer: {
      /* NO `columns` ON PURPOSE. The page is one screen with a single anchor,
         so there is nothing to link to — and eight labels that all scroll back
         to the same screen is worse than no column at all. The footer drops to
         the blurb and the CTA, which is the whole page's offer anyway. */
      blurb:
        'A connected salon and spa system in development — practitioner diaries, client history and end-of-day settlement on one platform.',
    },
  },
  {
    id: 'mostar',
    label: 'Mostar City',
    brandA: 'Mostar',
    brandB: ' City',
    available: true,
    // Standalone cinematic page (its own header/scroll rig) — the shared nav
    // and footer are hidden and it provides its own attraction switcher.
    standalone: true,
    links: [],
    // Hidden from the Attractions switcher — the page itself still works if
    // ever linked to directly, it's just not offered as an option.
    hidden: true,
  },
]

const AttractionContext = createContext(null)

/* Jump to the top with NO animation, whatever the stylesheet says.

   `window.scrollTo({ top: 0, behavior: 'auto' })` does not do this, and that
   was the bug this replaced. Per spec `auto` does not mean "instant" — it
   defers to the CSS `scroll-behavior` property, and index.css sets
   `html { scroll-behavior: smooth }` so anchor links glide. So every attraction
   switch animated the scroll instead of cutting: measured at 3347px over about
   410ms, with the incoming page mounting a third of the way through it. The
   visitor landed inside the new page and watched it slide up, which reads as a
   glitch rather than as a page opening.

   Two mechanisms, because each one alone was measured failing.

   `behavior: 'instant'` is the spec answer and ignores CSS outright, but it is
   an enum value that throws on engines predating it, so it needs a fallback.

   Flipping the property inline is that fallback — inline beats the stylesheet —
   but ONLY ONCE THE WRITE IS VISIBLE TO THE SCROLL CALL. Style writes are
   batched and `window.scrollTo` does not flush them, so the first version of
   this fix set the inline value, scrolled, and still animated: the scroll read
   `smooth` off index.css because the recalc had not happened. Measured 31
   intermediate positions, i.e. no change at all. Reading the computed value
   back forces the recalc and makes the flip real. */
export function jumpToTop() {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  // Not dead code: this read is what flushes the write above.
  void getComputedStyle(root).scrollBehavior
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  } catch {
    window.scrollTo(0, 0)
  }
  root.style.scrollBehavior = previous
}

/* WHERE A FIRST-TIME VISITOR LANDS, derived rather than named.

   This used to be a hardcoded `'gym'`. The moment Gym was hidden that became a
   default pointing at a page the switcher does not list: the bar would read
   "Gym" as the current attraction while offering only Solution and QStudio, and
   a visitor could leave it but never come back. Taking the first entry that is
   actually on offer means the default follows the list and cannot drift out of
   it again. Today that is Solution — the practice, and the page that routes to
   every hidden one. */
const DEFAULT_ID = (ATTRACTIONS.find((a) => !a.hidden) || ATTRACTIONS[0]).id

export function AttractionProvider({ children }) {
  const [id, setId] = useState(() => {
    try {
      const stored = localStorage.getItem('attraction')
      const match = ATTRACTIONS.find((a) => a.id === stored)
      /* `withdrawn`, NOT `hidden`, is what disqualifies a stored selection.
         Being on a hidden page is a legitimate state — it is where the Solution
         chooser sends people — so it has to survive a reload. Only a page taken
         out of service evicts. */
      return match && !match.withdrawn ? stored : DEFAULT_ID
    } catch {
      return DEFAULT_ID
    }
  })

  const setAttraction = (next) => {
    /* TOP FIRST, THEN THE SWAP, and the order is the whole point. The outgoing
       page is still mounted and still tall here, so the jump happens under
       content the visitor is about to lose and is invisible. Scrolling after
       the swap instead is what makes the INCOMING page the thing that moves. */
    jumpToTop()

    // Re-selecting the current attraction is just a request to go back to the
    // top of it — the jump above has already done that.
    if (next === id) return

    setId(next)
    try {
      localStorage.setItem('attraction', next)
    } catch {
      /* storage unavailable */
    }

    /* A hash points at a section of the page being left, and most of those
       ids do not exist on the one being opened. Dropping it keeps a reload on
       the new attraction at the top rather than hunting for an anchor that
       belonged to the old one. */
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }

  // `current` resolves against the full list so a hidden attraction still
  // renders if selected directly; `attractions` is the switcher-facing list,
  // filtered here so every switcher hides the same entries by default.
  const current = ATTRACTIONS.find((a) => a.id === id) || ATTRACTIONS[0]
  const attractions = ATTRACTIONS.filter((a) => !a.hidden)

  return (
    <AttractionContext.Provider value={{ current, setAttraction, attractions }}>
      {children}
    </AttractionContext.Provider>
  )
}

export function useAttraction() {
  const ctx = useContext(AttractionContext)
  if (!ctx) throw new Error('useAttraction must be used within AttractionProvider')
  return ctx
}
