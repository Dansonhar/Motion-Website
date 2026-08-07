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
    id: 'kiosk',
    label: 'Kiosk Only',
    brandA: 'Kiosk',
    brandB: ' Only',
    available: true,
    links: [
      { label: 'Overview', href: '#kiosk' },
      { label: 'Modules', href: '#parts' },
      { label: 'Contact', href: '#kiosk-contact' },
    ],
    footer: {
      blurb:
        'A self-service ordering kiosk built from six clean modules — display, payments, printing and a rock-solid stand.',
      solutions: ['Touch Display', 'Card Terminal', 'Printer & NFC', 'Pedestal Base'],
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
      { label: 'Gates', href: '#top' },
      { label: 'Contact', href: '#top' },
    ],
    footer: {
      blurb:
        'A connected theme park platform — tickets, food, retail and gate entry running on one system.',
      solutions: ['Mobile App', 'Self-Service Kiosk', 'Counter POS', 'Online Webstore'],
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
