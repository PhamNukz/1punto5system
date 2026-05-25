import { useEffect, useRef } from 'react'
import './HeroCanvas.css'

export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W, H, t = 0

    /* ── Globe params ── */
    const LAT_LINES = 13
    const LON_LINES = 18
    const GLOBE_X_RATIO = 0.72  // right-center position
    const GLOBE_Y_RATIO = 0.50
    const GLOBE_R_RATIO = 0.28  // radius relative to height

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function rotateY(x, y, z, a) {
      return { x: x * Math.cos(a) + z * Math.sin(a), y, z: -x * Math.sin(a) + z * Math.cos(a) }
    }
    function rotateX(x, y, z, a) {
      return { x, y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) }
    }
    function project(x, y, z, cx, cy, R) {
      const fov = 900
      const scale = fov / (fov + z + R)
      return { x: cx + x * scale, y: cy + y * scale, alpha: (z + R) / (2 * R) }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H)

      /* ── 1. Globe wireframe ── */
      const R = GLOBE_R_RATIO * H
      const cx = GLOBE_X_RATIO * W
      const cy = GLOBE_Y_RATIO * H
      const angleY = t * 0.28
      const angleX = Math.sin(t * 0.12) * 0.25 + 0.15

      // Latitude lines
      for (let i = 0; i <= LAT_LINES; i++) {
        const phi = (i / LAT_LINES) * Math.PI
        const sinPhi = Math.sin(phi)
        const cosPhi = Math.cos(phi)
        const lineR = R * sinPhi
        const segs = Math.max(4, Math.floor(48 * sinPhi))

        ctx.beginPath()
        let first = true
        for (let j = 0; j <= segs; j++) {
          const theta = (j / segs) * Math.PI * 2
          let p = { x: lineR * Math.cos(theta), y: R * cosPhi, z: lineR * Math.sin(theta) }
          p = rotateX(p.x, p.y, p.z, angleX)
          p = rotateY(p.x, p.y, p.z, angleY)
          const pr = project(p.x, p.y, p.z, cx, cy, R)
          // fade back hemisphere
          const a = 0.06 + pr.alpha * 0.45
          ctx.strokeStyle = `rgba(0,180,100,${a})`
          if (first) { ctx.moveTo(pr.x, pr.y); first = false }
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Longitude lines
      for (let i = 0; i < LON_LINES; i++) {
        const theta = (i / LON_LINES) * Math.PI * 2
        const segs = 64
        ctx.beginPath()
        let first = true
        for (let j = 0; j <= segs; j++) {
          const phi = (j / segs) * Math.PI
          let p = {
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(theta),
          }
          p = rotateX(p.x, p.y, p.z, angleX)
          p = rotateY(p.x, p.y, p.z, angleY)
          const pr = project(p.x, p.y, p.z, cx, cy, R)
          const a = 0.04 + pr.alpha * 0.38
          ctx.strokeStyle = `rgba(201,168,76,${a})`
          if (first) { ctx.moveTo(pr.x, pr.y); first = false }
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Globe core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.5)
      glow.addColorStop(0, 'rgba(201,168,76,0.06)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2)
      ctx.fill()

      /* ── 4. Dark vignette left (keep text readable) ── */
      const vigLeft = ctx.createLinearGradient(0, 0, W * 0.6, 0)
      vigLeft.addColorStop(0,   'rgba(10,15,10,0.92)')
      vigLeft.addColorStop(0.5, 'rgba(10,15,10,0.50)')
      vigLeft.addColorStop(1,   'rgba(10,15,10,0)')
      ctx.fillStyle = vigLeft
      ctx.fillRect(0, 0, W, H)

      /* ── 5. Top + bottom vignette ── */
      const vigTop = ctx.createLinearGradient(0, 0, 0, H * 0.25)
      vigTop.addColorStop(0, 'rgba(10,15,10,0.7)')
      vigTop.addColorStop(1, 'transparent')
      ctx.fillStyle = vigTop
      ctx.fillRect(0, 0, W, H)

      const vigBot = ctx.createLinearGradient(0, H * 0.75, 0, H)
      vigBot.addColorStop(0, 'transparent')
      vigBot.addColorStop(1, 'rgba(10,15,10,0.7)')
      ctx.fillStyle = vigBot
      ctx.fillRect(0, 0, W, H)

      t += 0.006
      animId = requestAnimationFrame(drawFrame)
    }

    resize()
    window.addEventListener('resize', resize)
    drawFrame()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas" />
}
