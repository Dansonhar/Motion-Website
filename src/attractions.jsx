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
