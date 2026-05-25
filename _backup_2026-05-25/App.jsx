import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'
import LoadingScreen from './components/LoadingScreen'

/* ─── Datos ──────────────────────────────────────── */
const SERVICIOS = [
  { num: '01', title: 'Estudios de Impacto Ambiental', desc: 'Elaboración y tramitación de DIA y EIA para proyectos de inversión, faenas e instalaciones existentes ante el SEIA.' },
  { num: '02', title: 'Permisos Ambientales y Sectoriales', desc: 'Tramitación completa de PAS y permisos sectoriales, incluyendo consultas de pertinencia y análisis internos de procedencia.' },
  { num: '03', title: 'Sistemas de Gestión Ambiental', desc: 'Diseño, elaboración e implementación de SGA. Políticas, normas y procedimientos alineados a estándares nacionales e internacionales.' },
  { num: '04', title: 'Monitoreo y Seguimiento RCA', desc: 'Carga de compromisos en plataforma SMA, seguimiento de condiciones establecidas en la Resolución de Calificación Ambiental.' },
  { num: '05', title: 'Auditorías y Due Diligence', desc: 'Auditorías ambientales, procesos de due diligence y evaluaciones de riesgo para operaciones existentes y fusiones.' },
  { num: '06', title: 'Recursos Hídricos e Hidrología', desc: 'Asesoría especializada en hidrogeología, hidrología superficial y estudios asociados para proyectos de diversas industrias.' },
  { num: '07', title: 'Participación Ciudadana', desc: 'Diseño e implementación de estrategias de participación ciudadana y relacionamiento comunitario en materia ambiental.' },
  { num: '08', title: 'Evaluaciones Ambientales Estratégicas', desc: 'Diseño y elaboración de EAE para planes, programas y políticas que requieran evaluación de efectos ambientales de largo plazo.' },
]

const PILLARS = [
  { idx: 'I',   title: 'Alineación de decisiones',    desc: 'Coordinamos lo técnico, legal y económico en una sola estrategia, evitando decisiones que generen conflictos posteriores.' },
  { idx: 'II',  title: 'Reducción de fricciones',     desc: 'Articulamos los intereses de las distintas áreas involucradas, transformando potenciales conflictos internos en decisiones transversales.' },
  { idx: 'III', title: 'Optimización de procesos',    desc: 'Mejoramos procesos internos con enfoques ágiles: integramos lo ambiental-legal, la ingeniería y la gestión económica del proyecto.' },
  { idx: 'IV',  title: 'Fortalecimiento de gobernanza', desc: 'Dotamos a su organización de las herramientas y estructuras para gestionar la dimensión ambiental como un activo estratégico.' },
]

const PASOS = [
  { num: '01', title: 'Diagnóstico y Factibilidad',   desc: 'Evaluación temprana de viabilidad ambiental y normativa. Consultas de pertinencia y análisis de riesgo regulatorio para el proyecto.' },
  { num: '02', title: 'Tramitación y Permisos',       desc: 'Elaboración de DIA/EIA, tramitación de PAS y permisos sectoriales ante los organismos competentes del SEIA y la SMA.' },
  { num: '03', title: 'Implementación y Construcción', desc: 'Trabajo en terreno durante la fase de construcción. Supervisión de compromisos RCA, medidas de mitigación y participación ciudadana.' },
  { num: '04', title: 'Operación y Seguimiento',      desc: 'Monitoreo continuo de compromisos ambientales, carga en plataforma SMA y gestión de cumplimiento normativo en operación.' },
]

const RIESGOS = [
  'Retrasos en el desarrollo del proyecto',
  'Reprocesos y nuevas tramitaciones',
  'Incumplimientos normativos ante la SMA',
  'Costos excesivos y recurrentes no previstos',
  'Sanciones de la institucionalidad ambiental',
]

/* ─── Hook: IntersectionObserver ─────────────────── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ─── Reveal wrapper ─────────────────────────────── */
function Reveal({ children, className = '', style = {}, delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'visible' : ''}`}
      style={{ ...style, transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

/* ─── SVG Icons ──────────────────────────────────── */
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
)
const IconCheck = () => (
  <svg className="check-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6"/><path d="M5.5 8l2 2 3-3"/>
  </svg>
)
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="6"/><path d="M7 4v4l2.5 1.5"/>
  </svg>
)
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 2h3l1.5 3.5-2 1.5c1 2 2 3 4 4l1.5-2L13.5 10.5V13.5s-1.5 1-3.5 0C4 10.5 1 5 2 2z"/>
  </svg>
)

const IconLeaf = () => (
  <svg style={{width:40,height:40}} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="20" cy="20" r="16"/><path d="M20 10v10l6 4"/><path d="M12 30l16-20"/>
  </svg>
)
const IconHouse = () => (
  <svg style={{width:40,height:40}} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M8 32V20l12-12 12 12v12"/><rect x="16" y="24" width="8" height="8"/><path d="M14 14l6-6 6 6"/>
  </svg>
)
const IconList = () => (
  <svg style={{width:40,height:40}} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M8 12h24M8 20h16M8 28h20"/><circle cx="32" cy="28" r="5"/><path d="M30 28l1.5 1.5L34 26"/>
  </svg>
)

/* ─── Divider ────────────────────────────────────── */
const Divider = () => (
  <div className="divider">
    <div className="divider-line" />
    <div className="divider-dot" />
    <div className="divider-line" />
  </div>
)

/* ─── App ────────────────────────────────────────── */
export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [landingVisible, setLandingVisible] = useState(false)
  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    requestAnimationFrame(() => setLandingVisible(true))
  }, [])

  /* nav scroll */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* hero number parallax */
  const heroNumRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      if (heroNumRef.current)
        heroNumRef.current.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.25}px))`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Banner en desarrollo */}
      <div className="dev-banner">
        <div className="dev-banner-dot" />
        Sitio web en desarrollo — próximamente disponible
        <div className="dev-banner-dot" />
      </div>

      {/* Pantalla de intro */}
      {showIntro && <LoadingScreen onComplete={handleIntroDone} />}

      {/* Landing content */}
      <div className={`landing-content${landingVisible ? ' landing-visible' : ''}`}>

      {/* Nav */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a className="nav-logo" href="#">1.5 <span>Consultores</span></a>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#valor"    >Propuesta</a>
          <a href="#proceso"  >Proceso</a>
          <a href="#impacto" className="nav-cta">Contacto</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-number" ref={heroNumRef}>1.5</div>
        <div className="hero-content">
          <div className="hero-eyebrow">Consultoría Ambiental Estratégica</div>
          <h1>
            Viabilidad<br/>
            <em>ambiental</em> para<br/>
            proyectos que<br/>trascienden.
          </h1>
          <p className="hero-desc">
            Integramos objetivos económicos, ambientales y normativos en una sola estrategia corporativa. Acompañamos cada etapa del proyecto —desde la factibilidad hasta el cierre— con claridad, orden y eficiencia.
          </p>
          <div className="hero-actions">
            <a href="#servicios" className="btn-primary">
              Ver servicios <IconArrow />
            </a>
            <a href="#impacto" className="btn-ghost">
              <IconClock /> Conversemos
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" /> Desplazar
        </div>
        <div className="hero-stat-row">
          {[['EIA','Estudios de\nImpacto'],['RCA','Compromisos\nSMA'],['360°','Ciclo\ncompleto']].map(([n,l]) => (
            <div className="hero-stat" key={n}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l.split('\n').map((t,i) => <span key={i}>{t}<br/></span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Intro */}
      <section className="intro-section">
        <div className="intro-grid">
          {[
            { icon: <IconLeaf />, title: 'Enfoque estratégico', desc: 'Sostenibilidad empresarial rentable: integramos lo económico, lo ambiental y lo normativo en una sola visión corporativa coherente.' },
            null,
            { icon: <IconHouse />, title: 'Integración transversal', desc: 'Articulamos los intereses de todas las áreas —técnicas, legales, económicas— transformando conflictos internos en gobernanza de proyecto.', delay: 0.15 },
            null,
            { icon: <IconList />, title: 'Resultados concretos', desc: 'Evitamos retrasos, reprocesos y sanciones. El resultado es un proyecto viable en lo económico, ambiental y normativo simultáneamente.', delay: 0.3 },
          ].map((col, i) =>
            col === null
              ? <div className="intro-sep" key={i} />
              : (
                <IntroCellReveal key={i} icon={col.icon} title={col.title} desc={col.desc} delay={col.delay || 0} />
              )
          )}
        </div>
      </section>

      <Divider />

      {/* Servicios */}
      <section className="servicios-section" id="servicios">
        <div className="section-inner">
          <div className="servicios-layout">
            <div className="servicios-intro">
              <div className="section-label">Ámbitos de acción</div>
              <h2 className="section-h2">Servicios<br/><em>especializados</em></h2>
              <p>Cubrimos el ciclo completo de gestión ambiental: desde la etapa de prefactibilidad hasta la operación y cierre, con acompañamiento técnico senior en cada fase.</p>
            </div>
            <div className="servicios-grid">
              {SERVICIOS.map((s, i) => (
                <ServicioCardReveal key={s.num} {...s} delay={i * 0.05} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Valor */}
      <section className="valor-section" id="valor">
        <div className="valor-layout">
          <div className="valor-left">
            <div className="section-label">Propuesta de valor</div>
            <div className="valor-quote">
              Transformamos la complejidad<br/>
              normativa en una <em>ventaja<br/>
              competitiva</em> para su negocio.
            </div>
            <ul className="resultado-list">
              {['Viabilidad económica del proyecto','Cumplimiento ambiental certificable','Alineación normativa continua','Reducción de reprocesos y sanciones','Gobernanza integrada y eficiente'].map((t,i) => (
                <ResultadoItemReveal key={t} text={t} delay={i * 0.08} />
              ))}
            </ul>
          </div>
          <div className="valor-right">
            <div className="section-label">Integración organizacional</div>
            <h2 className="section-h2">Un socio<br/><em>estratégico</em><br/>en cada etapa</h2>
            <div className="valor-pillars">
              {PILLARS.map((p, i) => (
                <PillarReveal key={p.idx} {...p} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Proceso */}
      <section className="proceso-section" id="proceso">
        <div className="section-inner">
          <div className="proceso-header">
            <div className="section-label" style={{justifyContent:'center'}}>Metodología</div>
            <h2 className="section-h2">Acompañamiento en el <em>ciclo completo</em></h2>
            <p>Desde la factibilidad inicial hasta el cierre del proyecto, nos integramos como un socio técnico que aporta claridad en cada decisión crítica.</p>
          </div>
          <div className="proceso-steps">
            {PASOS.map((p, i) => (
              <PasoReveal key={p.num} {...p} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Impacto / CTA */}
      <section className="impacto-section" id="impacto">
        <div className="section-inner">
          <div className="impacto-inner">
            <div className="impacto-left">
              <div className="section-label">Resultados esperados</div>
              <h2 className="section-h2">Eficiencia y<br/><em>reducción</em><br/>de riesgos</h2>
              <p>La correcta implementación de un enfoque estratégico integrado permite evitar los principales obstáculos que ralentizan y encarecen el desarrollo de proyectos de inversión.</p>
              <a href="mailto:contacto@15consultores.cl" className="btn-primary">
                Conversar con un experto <IconArrow />
              </a>
            </div>
            <div className="impacto-card">
              <div className="impacto-card-title">Lo que prevenimos juntos</div>
              <ul className="impacto-items">
                {RIESGOS.map(r => (
                  <li key={r}><IconCheck />{r}</li>
                ))}
              </ul>
              <div className="impacto-cta">
                <a href="mailto:contacto@15consultores.cl" className="btn-impacto">
                  Solicitar asesoría
                </a>
                <a href="tel:+56900000000" className="btn-outline">
                  <IconPhone /> Llamar directamente
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">1.5 <span>Consultores</span></div>
        <div className="footer-copy">© 2024 1.5 Consultores — Consultoría Ambiental Estratégica</div>
        <div className="footer-links">
          <a href="#servicios">Servicios</a>
          <a href="#valor"    >Propuesta</a>
          <a href="#impacto"  >Contacto</a>
        </div>
      </footer>
      </div>{/* end landing-content */}
    </>
  )
}

/* ─── Sub-componentes con reveal individual ──────── */
function IntroCellReveal({ icon, title, desc, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <div ref={ref} className={`intro-col ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="intro-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function ServicioCardReveal({ num, title, desc, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <div ref={ref} className={`servicio-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="servicio-num">{num}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function ResultadoItemReveal({ text, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <li ref={ref} className={visible ? 'visible' : ''} style={{ transitionDelay: `${delay}s` }}>
      {text}
    </li>
  )
}

function PillarReveal({ idx, title, desc, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <div ref={ref} className={`pillar ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="pillar-idx">{idx}</div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  )
}

function PasoReveal({ num, title, desc, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <div ref={ref} className={`proceso-step ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="step-num-wrap"><span className="step-num">{num}</span></div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function useRevealHook() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}
