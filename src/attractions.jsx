import { createContext, useContext, useState } from 'react'

// The verticals the site can present. Add a new entry here + a matching site
// component to introduce another attraction type.
export const ATTRACTIONS = [
  {
    id: 'gym',
    label: 'Gym',
    brandA: 'Gym',
    brandB: 'Access',
    available: true,
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
      solutions: ['Membership Kiosk', 'Tripod Turnstile', 'Face Recognition', 'AI Monitoring'],
    },
  },
  {
    id: 'themepark',
    label: 'Theme Park',
    brandA: 'Park',
    brandB: 'Access',
    available: true,
    links: [
      { label: 'Ticketing', href: '#park-channels' },
      { label: 'Kiosk', href: '#park-kiosk' },
      { label: 'Gates', href: '#park-gates' },
      { label: 'Contact', href: '#top' },
    ],
    footer: {
      blurb:
        'A connected theme park platform — tickets, food, retail and gate entry running on one system.',
      solutions: [
        'Mobile App',
        'Self-Service Kiosk',
        'Counter POS',
        'Online Webstore',
        'Tripod Turnstile',
      ],
    },
  },
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
      { label: 'Approach', href: '#approach' },
      { label: 'Industries', href: '#industries' },
      { label: 'Work', href: '#work' },
    ],
    // This vertical sells a consulting engagement, not a product trial — the
    // shared "Book a Demo" CTA would undercut the whole positioning.
    cta: { label: 'Discuss Your Business', href: '#consultation' },
    footer: {
      blurb:
        'We design the business behind the operation — connected systems for restaurants, retail, fitness, leisure and hospitality, built around the way each business needs to work.',
      solutions: [
        'Customer Experience',
        'Operations',
        'Management & Control',
        'Revenue & Retention',
        'Scale',
      ],
      // The shared list (Documentation, Installation, FAQ) is written for a
      // product you install. This vertical opens by saying it does not start
      // with technology, so it names sections of the page instead.
      resources: ['Our Approach', 'Industries We Work In', 'Selected Work'],
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
    footer: {
      blurb:
        'The operating system for membership-based, walk-in businesses — memberships, bookings, check-in and payments from sign-up to renewal on one system.',
      solutions: ['Memberships', 'Bookings', 'Face-ID Check-in', 'Rewards', 'Reports'],
      /* The shared list (Documentation, Installation, Case Studies, FAQ) is
         written for a product you download. A multi-outlet buyer's procurement
         asks these four questions instead. */
      resources: ['Security & PDPA', 'Data Ownership', 'Deployment & Onboarding', 'Service Levels'],
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

export function AttractionProvider({ children }) {
  const [id, setId] = useState(() => {
    try {
      const stored = localStorage.getItem('attraction')
      const match = ATTRACTIONS.find((a) => a.id === stored)
      return match && !match.hidden ? stored : 'gym'
    } catch {
      return 'gym'
    }
  })

  const setAttraction = (next) => {
    setId(next)
    try {
      localStorage.setItem('attraction', next)
    } catch {
      /* storage unavailable */
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
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
