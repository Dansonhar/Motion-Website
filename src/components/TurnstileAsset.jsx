import { useRef, useState } from 'react'

// Hand-built vector "3D" model of the MT119-LED tripod turnstile, modelled on
// the product render: matte-black tapered column, green LED strips (top edge,
// vertical side, base plinth), chrome tripod hub with three arms. Tilts toward
// the pointer for a parallax 3D feel; LEDs pulse.
export default function TurnstileAsset({ className = '' }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ ry: px * 18, rx: -py * 12 })
  }
  const reset = () => setTilt({ rx: 0, ry: 0 })

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ perspective: 1100 }}
      className={`select-none ${className}`}
    >
      <div
        className="asset-float"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.25s ease-out',
        }}
      >
        <svg
          viewBox="0 0 400 470"
          className="mx-auto h-auto w-full max-w-[420px] drop-shadow-2xl"
          role="img"
          aria-label="3D model of the MT119-LED tripod turnstile"
        >
          <defs>
            <linearGradient id="ts-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2c332e" />
              <stop offset="1" stopColor="#111512" />
            </linearGradient>
            <linearGradient id="ts-side" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f1210" />
              <stop offset="1" stopColor="#060807" />
            </linearGradient>
            <linearGradient id="ts-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3c453e" />
              <stop offset="1" stopColor="#252b27" />
            </linearGradient>
            <linearGradient id="ts-base" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d221e" />
              <stop offset="1" stopColor="#0b0d0c" />
            </linearGradient>
            <linearGradient id="ts-door" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#181c19" />
              <stop offset="1" stopColor="#0d100e" />
            </linearGradient>
            <linearGradient id="ts-arm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a413b" />
              <stop offset="0.5" stopColor="#20251f" />
              <stop offset="1" stopColor="#0e110f" />
            </linearGradient>
            <linearGradient id="ts-led" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d4d4d4" />
            </linearGradient>
            <radialGradient id="ts-chrome" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#eef3ef" />
              <stop offset="0.5" stopColor="#a4b3a9" />
              <stop offset="1" stopColor="#454e48" />
            </radialGradient>
            <filter id="ts-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" />
            </filter>

            {/* LED strips defined once, reused for glow + crisp pass */}
            <g id="ts-leds" fill="url(#ts-led)">
              <rect x="156" y="150" width="130" height="6" rx="3" />
              <rect x="270" y="238" width="9" height="150" rx="4.5" />
              <rect x="126" y="442" width="170" height="7" rx="3.5" />
            </g>
          </defs>

          {/* Floor shadow */}
          <ellipse cx="205" cy="452" rx="120" ry="15" fill="#000" opacity="0.45" filter="url(#ts-glow)" />

          {/* Base plinth */}
          <polygon points="120,408 300,408 336,386 156,386" fill="url(#ts-top)" />
          <polygon points="300,408 336,386 336,430 300,452" fill="url(#ts-side)" />
          <rect x="120" y="408" width="180" height="44" fill="url(#ts-base)" />
          {/* bolt holes on base top */}
          <ellipse cx="180" cy="397" rx="4" ry="2.2" fill="#000" opacity="0.55" />
          <ellipse cx="250" cy="397" rx="4" ry="2.2" fill="#000" opacity="0.55" />

          {/* Column */}
          <polygon points="290,150 326,128 326,390 290,408" fill="url(#ts-side)" />
          <rect x="150" y="150" width="140" height="258" fill="url(#ts-body)" />
          <polygon points="150,150 290,150 326,128 186,128" fill="url(#ts-top)" />
          {/* front top bevel highlight */}
          <rect x="150" y="150" width="140" height="9" fill="#454e47" opacity="0.7" />

          {/* Recessed access door + indicator dot */}
          <rect x="168" y="246" width="86" height="150" rx="7" fill="url(#ts-door)" stroke="rgba(255,255,255,0.05)" />
          <circle cx="180" cy="260" r="2.6" fill="#fff" opacity="0.3" />

          {/* Tripod arms (behind hub) */}
          <g fill="none" strokeLinecap="round">
            <path d="M150 178 L26 151" stroke="url(#ts-arm)" strokeWidth="16" />
            <path d="M150 185 L62 300" stroke="url(#ts-arm)" strokeWidth="16" />
            <path d="M150 191 L116 344" stroke="url(#ts-arm)" strokeWidth="16" />
            {/* subtle top highlights */}
            <path d="M150 174 L28 147" stroke="#4c554e" strokeWidth="3" opacity="0.6" />
            <path d="M150 181 L64 296" stroke="#4c554e" strokeWidth="2.5" opacity="0.5" />
          </g>

          {/* Chrome hub */}
          <ellipse cx="152" cy="178" rx="28" ry="22" fill="url(#ts-chrome)" />
          <ellipse cx="150" cy="174" rx="15" ry="13" fill="url(#ts-chrome)" />
          <ellipse cx="145" cy="169" rx="5" ry="3" fill="#fff" opacity="0.55" />

          {/* LED glow + crisp */}
          <use href="#ts-leds" filter="url(#ts-glow)" className="led-glow" />
          <use href="#ts-leds" />
        </svg>
      </div>
    </div>
  )
}
