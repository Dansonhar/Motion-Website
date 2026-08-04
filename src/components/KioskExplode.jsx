import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'

const BASE = import.meta.env.BASE_URL

// --- helpers ---------------------------------------------------------------
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// The whole rig is designed in a fixed 1000x1000 "stage" and scaled to fit the
// viewport, so every coordinate below is easy to reason about. (0,0) offsets are
// measured from the stage centre (500,500). `a` = assembled, `e` = exploded.
const PARTS = [
  {
    id: 'screen',
    src: '1-screen.png',
    w: 150,
    h: 280,
    idx: '01',
    title: 'Touch Display',
    spec: '24″ portrait HD · capacitive multi-touch',
    a: { x: 0, y: -170 },
    e: { x: -60, y: -350, z: 150, ry: -16, rx: 6 },
    win: [0.12, 0.44],
    lbl: { x: 560, y: 150 },
  },
  {
    id: 'panel',
    src: '3-panel.png',
    w: 225,
    h: 175,
    idx: '02',
    title: 'Printer & NFC',
    spec: 'Thermal receipt · contactless + QR scan',
    a: { x: 0, y: -40 },
    e: { x: -60, y: -150, z: 70, ry: -14, rx: 3 },
    win: [0.18, 0.5],
    lbl: { x: 560, y: 350 },
  },
  {
    id: 'terminal',
    src: '4-terminal.png',
    w: 120,
    h: 176,
    idx: '03',
    title: 'Card Terminal',
    spec: 'EMV chip · tap-to-pay · PIN pad',
    a: { x: 120, y: -70 },
    e: { x: 190, y: -40, z: 200, ry: 24, rx: 4 },
    win: [0.24, 0.56],
    lbl: { x: 770, y: 470 },
  },
  {
    id: 'bracket',
    src: '2-bracket.png',
    w: 200,
    h: 63,
    idx: '04',
    title: 'Mount Bracket',
    spec: 'VESA neck · cable pass-through',
    a: { x: 0, y: 35 },
    e: { x: -60, y: 60, z: -10, ry: -12, rx: 2 },
    win: [0.3, 0.62],
    lbl: { x: 560, y: 560 },
  },
  {
    id: 'column',
    src: '5-column.png',
    w: 64,
    h: 370,
    idx: '05',
    title: 'Pedestal Column',
    spec: 'Steel core · powder-coat shell',
    a: { x: 0, y: 150 },
    e: { x: -60, y: 250, z: -120, ry: -10, rx: 1 },
    win: [0.36, 0.68],
    lbl: { x: 560, y: 640 },
  },
  {
    id: 'base',
    src: '6-base.png',
    w: 250,
    h: 56,
    idx: '06',
    title: 'Weighted Base',
    spec: 'Anti-tip footprint · floor-anchor ready',
    a: { x: 0, y: 300 },
    e: { x: -60, y: 460, z: -180, ry: -8, rx: 1 },
    win: [0.42, 0.74],
    lbl: { x: 300, y: 940 },
  },
]

// --- one part + its floating callout ---------------------------------------
function Part({ p, progress }) {
  const t = useTransform(progress, (v) =>
    easeInOut(clamp((v - p.win[0]) / (p.win[1] - p.win[0]))),
  )
  const x = useTransform(t, (v) => lerp(p.a.x, p.e.x, v))
  const y = useTransform(t, (v) => lerp(p.a.y, p.e.y, v))
  const z = useTransform(t, (v) => lerp(0, p.e.z || 0, v))
  const rotateY = useTransform(t, (v) => lerp(0, p.e.ry || 0, v))
  const rotateX = useTransform(t, (v) => lerp(0, p.e.rx || 0, v))
  const labelOpacity = useTransform(t, (v) => clamp((v - 0.55) / 0.4))
  const labelX = useTransform(labelOpacity, (v) => (1 - v) * -16)

  return (
    <>
      <motion.img
        src={`${BASE}kiosk-parts/${p.src}`}
        alt={p.title}
        draggable="false"
        style={{
          position: 'absolute',
          left: 500,
          top: 500,
          width: p.w,
          marginLeft: -p.w / 2,
          marginTop: -p.h / 2,
          x,
          y,
          z,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="select-none [filter:drop-shadow(0_26px_34px_rgba(0,0,0,0.6))]"
      />

      {/* Floating callout — index badge + name + spec */}
      <motion.div
        style={{
          position: 'absolute',
          left: p.lbl.x,
          top: p.lbl.y,
          x: labelX,
          opacity: labelOpacity,
          transformStyle: 'preserve-3d',
        }}
        className="w-[230px] -translate-y-1/2"
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/25 bg-white/10 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
            {p.idx}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
        </div>
        <p className="text-sm font-semibold text-white">{p.title}</p>
        <p className="mt-0.5 text-xs leading-snug text-white/50">{p.spec}</p>
      </motion.div>
    </>
  )
}

export default function KioskExplode() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Fit the fixed 1000x1000 stage into whatever viewport we have.
  const [fit, setFit] = useState(0.7)
  useEffect(() => {
    const onResize = () =>
      setFit(Math.min((window.innerWidth * 0.92) / 1000, (window.innerHeight * 0.9) / 1000))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Pointer-driven 3D tilt of the whole rig (parts sit at different Z, so the
  // tilt reveals real parallax between them).
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.4 })
  const stageRotY = useTransform(sx, (v) => v * 12)
  const stageRotX = useTransform(sy, (v) => v * -9)

  const onPointerMove = (e) => {
    if (window.matchMedia('(hover: none)').matches) return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  const introOpacity = useTransform(scrollYProgress, [0, 0.09], [1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -70])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04, 0.08], [1, 1, 0])
  const railFill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="kiosk"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative h-[560vh] bg-ink-950"
    >
      <div
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden"
        style={{ perspective: 1600 }}
      >
        {/* backdrop: charcoal wash + blueprint grid + centre spotlight */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,#1a1a1d_0%,#0b0b0c_55%,#050505_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(70% 70% at 50% 45%, #000 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(70% 70% at 50% 45%, #000 0%, transparent 100%)',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)] blur-2xl" />

        {/* intro headline over the assembled kiosk */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute left-1/2 top-[12%] z-20 -translate-x-1/2 px-6 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-white/50">
            Self-Service Kiosk
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Built to come apart.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/55 sm:text-base">
            Scroll to dismantle the kiosk, module by module.
          </p>
        </motion.div>

        {/* the 3D exploded stage */}
        <motion.div
          style={{
            width: 1000,
            height: 1000,
            scale: fit,
            rotateX: stageRotX,
            rotateY: stageRotY,
            transformStyle: 'preserve-3d',
          }}
          className="relative shrink-0"
        >
          {PARTS.map((p) => (
            <Part key={p.id} p={p} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* scrub rail */}
        <div className="pointer-events-none absolute right-5 top-1/2 z-20 hidden h-40 w-px -translate-y-1/2 bg-white/15 sm:block">
          <motion.div className="w-full bg-white" style={{ height: railFill }} />
        </div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60"
        >
          <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="flex h-9 w-5 justify-center rounded-full border border-white/40 pt-1.5">
            <motion.span
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1 rounded-full bg-white"
            />
          </span>
        </motion.div>
      </div>
    </section>
  )
}
