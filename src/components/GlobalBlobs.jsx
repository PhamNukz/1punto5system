import { useEffect, useRef } from 'react'
import './GlobalBlobs.css'

export default function GlobalBlobs() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W, H, t = 0

    /* Blobs distribuidos por toda la pantalla */
    const blobs = [
      // Zona superior-derecha (hero)
      { x: 0.78, y: 0.18, vx:  0.00022, vy:  0.00014, r: 0.30, col: [0, 130, 75] },
      { x: 0.88, y: 0.48, vx: -0.00018, vy:  0.00020, r: 0.24, col: [201, 168, 76] },
      // Zona centro
      { x: 0.25, y: 0.55, vx:  0.00012, vy: -0.00016, r: 0.26, col: [40, 60, 110] },
      { x: 0.60, y: 0.70, vx: -0.00020, vy:  0.00010, r: 0.22, col: [70, 30, 100] },
      // Zona inferior
      { x: 0.82, y: 0.82, vx:  0.00015, vy: -0.00022, r: 0.28, col: [0, 100, 60] },
      { x: 0.15, y: 0.85, vx:  0.00018, vy:  0.00008, r: 0.20, col: [160, 120, 40] },
      // Zona superior-izquierda
      { x: 0.10, y: 0.20, vx: -0.00010, vy:  0.00018, r: 0.22, col: [30, 80, 60] },
      // Zona media-derecha
      { x: 0.92, y: 1.15, vx: -0.00014, vy: -0.00012, r: 0.26, col: [100, 60, 20] },
    ]

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H)

      blobs.forEach(b => {
        b.x += b.vx + Math.sin(t * 0.8 + b.r * 10) * 0.00007
        b.y += b.vy + Math.cos(t * 0.6 + b.r * 8) * 0.00007

        if (b.x < -0.3) b.x = 1.3
        if (b.x > 1.3)  b.x = -0.3
        if (b.y < -0.3) b.y = 1.3
        if (b.y > 1.3)  b.y = -0.3

        const bx = b.x * W
        const by = b.y * H
        const br = b.r * Math.max(W, H) * 0.7

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        grad.addColorStop(0,   `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.22)`)
        grad.addColorStop(0.5, `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.07)`)
        grad.addColorStop(1,   `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI * 2)
        ctx.fill()
      })

      t += 0.005
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

  return <canvas ref={canvasRef} className="global-blobs-canvas" />
}
