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
  },
  {
    id: 'boss',
    label: 'Boss',
    brandA: 'Boss',
    brandB: '',
    available: true,
    links: [
      { label: 'Overview', href: '#boss' },
      { label: 'Features', href: '#boss-features' },
      { label: 'Contact', href: '#boss-contact' },
    ],
  },
  {
    id: 'themepark',
    label: 'Theme Park',
    brandA: 'Park',
    brandB: 'Access',
    available: false,
    links: [
      { label: 'Ticketing', href: '#park-ticketing' },
      { label: 'Gates', href: '#park-gate' },
      { label: 'Contact', href: '#park-contact' },
    ],
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
  },
]

const AttractionContext = createContext(null)

export function AttractionProvider({ children }) {
  const [id, setId] = useState(() => {
    try {
      return localStorage.getItem('attraction') || 'gym'
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

  const current = ATTRACTIONS.find((a) => a.id === id) || ATTRACTIONS[0]

  return (
    <AttractionContext.Provider value={{ current, setAttraction, attractions: ATTRACTIONS }}>
      {children}
    </AttractionContext.Provider>
  )
}

export function useAttraction() {
  const ctx = useContext(AttractionContext)
  if (!ctx) throw new Error('useAttraction must be used within AttractionProvider')
  return ctx
}
