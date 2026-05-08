import { useEffect, useState, useRef } from 'react'
import './IntroScreen.css'

export default function IntroScreen({ onDone }) {
  const [exiting, setExiting] = useState(false)
  const [pct, setPct] = useState(0)
  const pctRef = useRef(0)
  const rafRef = useRef(null)

  /* Animar el porcentaje en sync con la barra CSS */
  useEffect(() => {
    const start = performance.now()
    const DURATION = 1400   // ms — igual al progressFill
    const DELAY    = 1100   // ms — delay de la barra

    const tick = (now) => {
      const elapsed = now - start - DELAY
      if (elapsed < 0) { rafRef.current = requestAnimationFrame(tick); return }

      const t = Math.min(elapsed / DURATION, 1)
      // espejo aproximado de la curva CSS
      const curved =
        t < 0.60 ? t / 0.60 * 0.72 :
        t < 0.85 ? 0.72 + (t - 0.60) / 0.25 * 0.16 :
                   0.88 + (t - 0.85) / 0.15 * 0.12

      const val = Math.round(curved * 100)
      pctRef.current = val
      setPct(val)

      if (t < 1) { rafRef.current = requestAnimationFrame(tick) }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* Cuando la barra llega a 100 → espera 300ms → sale */
  useEffect(() => {
    if (pct < 100) return
    const t = setTimeout(() => {
      setExiting(true)
      // esperar la transición CSS (1.1s) antes de desmontar
      setTimeout(onDone, 1050)
    }, 300)
    return () => clearTimeout(t)
  }, [pct, onDone])

  return (
    <div className={`intro-screen${exiting ? ' exiting' : ''}`}>
      {/* Esquinas decorativas */}
      <div className="intro-corner intro-corner-tl" />
      <div className="intro-corner intro-corner-tr" />
      <div className="intro-corner intro-corner-bl" />
      <div className="intro-corner intro-corner-br" />

      {/* Línea horizontal sweep */}
      <div className="intro-divider-line" />

      {/* Logo */}
      <div className="intro-logo-wrap">
        <div className="intro-bar" />
        <div className="intro-dot" />
        {/* clip-wrapper: height = cap-height de Anton@128px ≈ 90px */}
        <div className="intro-num-wrap">
          <div className="intro-num">
            5<span className="intro-num-sup">°C</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="intro-tagline">Consultoría Ambiental Estratégica</div>

      {/* Progress */}
      <div className="intro-progress-wrap">
        <div className="intro-progress-track">
          <div className="intro-progress-bar" />
        </div>
        <div className="intro-progress-pct">{pct}%</div>
      </div>

      {/* Bottom */}
      <div className="intro-bottom-label">1.5 Consultores — Chile</div>
    </div>
  )
}
