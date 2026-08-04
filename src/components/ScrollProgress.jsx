import { motion, useScroll, useSpring } from 'framer-motion'

// Thin accent bar at the very top that tracks whole-page scroll progress.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent-500 via-accent-400 to-accent-300"
      aria-hidden="true"
    />
  )
}
