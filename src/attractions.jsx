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
  /* QBot's own product line. Unlike Gym / Theme Park / Solution — which are
     sector stories — these two are PRODUCT pages: what it is, what it does,
     what it saves. Copy is drawn from qbot.now and qbot.now/qstudio and kept
     to what those pages actually claim; nothing here is invented.

     QBot is the company, QPOS and STUDIO are its products. Keep that hierarchy
     in any copy added later — the live site is consistent about it
     ("STUDIO by QBot", "STUDIO is part of the QBot product family"). */
  {
    id: 'qbot',
    label: 'QBot',
    brandA: 'QBot',
    brandB: '',
    available: true,
    /* In page order. Each anchor lands on a scroll rig, so `scroll-padding-top`
       in index.css is what keeps the pinned stage clear of the fixed navbar. */
    links: [
      { label: 'One Operation', href: '#operation' },
      { label: 'The Device', href: '#device' },
      { label: 'QHub', href: '#qhub' },
      { label: 'What You Run', href: '#modules' },
      { label: 'Hardware', href: '#hardware' },
    ],
    cta: { label: 'Book a Demo', href: '#demo' },
    footer: {
      blurb:
        'Malaysia’s first 3-in-1 POS — counter, mobile and self-service kiosk in one device, with six sales channels feeding a single system.',
      solutions: ['POS', 'mPOS', 'Kiosk', 'Tablet', 'QR Order', 'Webstore'],
    },
  },
  {
    id: 'qstudio',
    label: 'QStudio',
    brandA: 'STUDIO',
    brandB: '',
    available: true,
    /* In page order. `#journey` and `#one` are pinned scroll rigs — anchoring
       into one lands the visitor at its first step, which is the intent. */
    links: [
      { label: 'The Journey', href: '#journey' },
      { label: 'One Operation', href: '#one' },
      { label: 'Who It’s For', href: '#who' },
      { label: 'At the Door', href: '#door' },
      { label: 'Detail', href: '#more' },
    ],
    cta: { label: 'Book a Demo', href: '#demo' },
    footer: {
      blurb:
        'The operating system for membership-based, walk-in businesses — memberships, bookings, check-in and payments from sign-up to renewal on one system.',
      solutions: ['Memberships', 'Bookings', 'Face-ID Check-in', 'Rewards', 'Reports'],
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
