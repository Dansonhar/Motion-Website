import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Cinematic backdrop for the "Coming Soon" teaser: drifting embers + slow
// searching light shafts in a dark void, with a camera that pushes forward as
// the intro plays out — pure atmosphere, no geometry to get "wrong", so it
// holds up at any angle. `progress` is any object exposing .get() → 0..1 (a
// Framer Motion value tweened on a timer, safe to read outside React's render
// cycle), representing how far through the teaser we are.
export default function ThemeParkAtmosphere({ progress, activeUntil = 1 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50)
    camera.position.z = 6.4
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearAlpha(0)
    mount.appendChild(renderer.domElement)

    // Soft circular sprite for embers (a hard square point looks cheap).
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = spriteCanvas.height = 64
    const sctx = spriteCanvas.getContext('2d')
    const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    sg.addColorStop(0, 'rgba(255,255,255,1)')
    sg.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    sg.addColorStop(1, 'rgba(255,255,255,0)')
    sctx.fillStyle = sg
    sctx.fillRect(0, 0, 64, 64)
    const spriteTex = new THREE.CanvasTexture(spriteCanvas)

    const COUNT = 850
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    const drift = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9
      speeds[i] = 0.12 + Math.random() * 0.3
      drift[i] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.055,
      map: spriteTex,
      transparent: true,
      opacity: 0.6,
      color: new THREE.Color('#ffd8a6'),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Slow-sweeping light shafts, like spotlights searching a dark stage.
    const shaftCanvas = document.createElement('canvas')
    shaftCanvas.width = 128
    shaftCanvas.height = 512
    const shctx = shaftCanvas.getContext('2d')
    const shg = shctx.createLinearGradient(0, 0, 0, 512)
    shg.addColorStop(0, 'rgba(255,255,255,0)')
    shg.addColorStop(0.5, 'rgba(255,255,255,0.55)')
    shg.addColorStop(1, 'rgba(255,255,255,0)')
    shctx.fillStyle = shg
    shctx.fillRect(0, 0, 128, 512)
    const shaftTex = new THREE.CanvasTexture(shaftCanvas)

    const shafts = [-1, 0, 1].map((slot) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 11),
        new THREE.MeshBasicMaterial({
          map: shaftTex,
          transparent: true,
          opacity: 0.1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      )
      mesh.position.set(slot * 3.4, 0, -3.5)
      mesh.rotation.z = slot * 0.22
      scene.add(mesh)
      return { mesh, slot }
    })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)
      camera.aspect = w / (h || 1)
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    const clock = new THREE.Clock()
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const t = clock.getElapsedTime()
      const raw = progress.get()
      const p = Math.min(Math.max(raw, 0), activeUntil) / activeUntil

      // Push the camera forward through the particle field as the countdown
      // advances — the anticipation of "getting closer" to the reveal.
      camera.position.z = 6.4 - p * 3.6
      camera.position.x = Math.sin(t * 0.12) * 0.25
      camera.position.y = Math.cos(t * 0.09) * 0.15

      points.rotation.y = t * 0.015

      const posAttr = geo.attributes.position
      for (let i = 0; i < COUNT; i++) {
        posAttr.array[i * 3 + 1] += speeds[i] * 0.01
        posAttr.array[i * 3 + 0] += Math.sin(t * 0.3 + drift[i]) * 0.0008
        if (posAttr.array[i * 3 + 1] > 5.2) posAttr.array[i * 3 + 1] = -5.2
      }
      posAttr.needsUpdate = true

      shafts.forEach(({ mesh, slot }) => {
        mesh.rotation.z = slot * 0.22 + Math.sin(t * 0.09 + slot) * 0.06
      })

      // Fade the whole atmosphere out as we approach the reveal, so it
      // dissolves rather than cutting away.
      mat.opacity = 0.6 * (1 - p * 0.75)
      shafts.forEach(({ mesh }) => {
        mesh.material.opacity = 0.1 * (1 - p * 0.8)
      })

      renderer.render(scene, camera)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      geo.dispose()
      mat.dispose()
      spriteTex.dispose()
      shafts.forEach(({ mesh }) => {
        mesh.geometry.dispose()
        mesh.material.dispose()
      })
      shaftTex.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [progress, activeUntil])

  return <div ref={mountRef} className="pointer-events-none absolute inset-0 z-0" />
}
