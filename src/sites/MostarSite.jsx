import { useEffect, useRef, useState } from 'react'
import { Layers, ChevronDown, Check } from 'lucide-react'
import { useAttraction } from '../attractions.jsx'

// The Mostar cinematic page is a fully self-contained vanilla page served from
// public/mostar/. We embed it in a full-viewport iframe so its exact CSS/JS and
// remote assets run untouched, and overlay a small switcher to change attraction.
export default function MostarSite() {
  return (
    <div className="fixed inset-0 z-0 bg-[#0b1110]">
      <iframe
        title="Mostar city"
        src={`${import.meta.env.BASE_URL}mostar/index.html`}
        className="h-full w-full border-0"
      />
      <FloatingSwitch />
    </div>
  )
}

function FloatingSwitch() {
  const { current, setAttraction, attractions } = useAttraction()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  return (
    <div ref={ref} className="fixed right-4 top-4 z-[60] sm:right-6 sm:top-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-sm font-medium text-black shadow-lg backdrop-blur transition-colors hover:bg-white"
      >
        <Layers size={15} />
        <span className="font-semibold">{current.label}</span>
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-2xl"
        >
          {attractions.map((a) => {
            const active = a.id === current.id
            return (
              <li key={a.id}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setAttraction(a.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active ? 'bg-black/5 text-black' : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-medium">{a.label}</span>
                    {!a.available && (
                      <span className="rounded-full border border-black/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/40">
                        Soon
                      </span>
                    )}
                  </span>
                  {active && <Check size={16} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
