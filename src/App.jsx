import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'
import LoadingScreen from './components/LoadingScreen'
import HeroCanvas from './components/HeroCanvas'
import GlobalBlobs from './components/GlobalBlobs'
import ContactForm from './components/ContactForm'

/* ─── Datos ──────────────────────────────────────── */
const SERVICIOS = [
  {
    num: '01',
    title: 'Estudios de Impacto Ambiental',
    plain: 'El estudio que el Estado exige para que tu proyecto pueda comenzar',
    desc: 'Elaboramos y tramitamos la DIA o EIA ante el SEIA. Nos encargamos de todo el proceso con la profundidad técnica que cada organismo exige, sin que tengas que aprender el lenguaje regulatorio.',
  },
  {
    num: '02',
    title: 'Permisos Ambientales y Sectoriales',
    plain: 'Los permisos específicos que piden organismos como el SAG, DGA o SEREMI',
    desc: 'Tramitamos todos los PAS y permisos sectoriales. Hacemos las consultas de pertinencia para que sepas exactamente qué necesitas antes de comprometer tiempo y recursos.',
  },
  {
    num: '03',
    title: 'Sistemas de Gestión Ambiental',
    plain: 'El orden interno que evita multas y facilita la operación diaria',
    desc: 'Diseñamos e implementamos el SGA de tu empresa: políticas, procedimientos y registros para que el cumplimiento ambiental sea parte natural de cómo operan, no una carga adicional.',
  },
  {
    num: '04',
    title: 'Monitoreo y Seguimiento RCA',
    plain: 'Cuidamos que se cumplan los compromisos que el Estado te aprobó',
    desc: 'Gestionamos tus compromisos en la plataforma SMA y hacemos seguimiento continuo de las condiciones de tu RCA. Sin que te lleguen sorpresas desde la Superintendencia del Medio Ambiente.',
  },
  {
    num: '05',
    title: 'Auditorías y Due Diligence',
    plain: 'Revisamos el estado ambiental antes de comprar, vender o fusionar',
    desc: 'Evaluamos el riesgo ambiental de operaciones existentes. Ideal para procesos de fusión, adquisición o cuando necesitas saber exactamente en qué situación está un proyecto antes de invertir.',
  },
  {
    num: '06',
    title: 'Recursos Hídricos e Hidrología',
    plain: 'Todo lo relacionado con el agua: ríos, napas subterráneas y derechos',
    desc: 'Elaboramos estudios hidrogeológicos e hidrológicos y gestionamos derechos de agua. Una variable que muchos proyectos subestiman y que puede paralizar la tramitación por completo.',
  },
  {
    num: '07',
    title: 'Participación Ciudadana',
    plain: 'Construimos confianza con las comunidades desde el primer día',
    desc: 'Diseñamos e implementamos la estrategia de relacionamiento comunitario. Un PAC mal gestionado obliga a rediseñar el proyecto desde cero. Nosotros lo prevenimos.',
  },
  {
    num: '08',
    title: 'Evaluaciones Ambientales Estratégicas',
    plain: 'El análisis ambiental que necesitan planes y políticas completas',
    desc: 'Elaboramos EAE para planes y programas que requieren evaluar efectos ambientales de largo plazo. Un paso que muchas organizaciones omiten y que puede frenar todo lo que viene después.',
  },
]

const PILLARS = [
  {
    idx: 'I',
    title: 'Una sola dirección para todos',
    desc: 'Cuando cada área tira para su lado, los proyectos se estancan. Alineamos lo técnico, lo legal y lo financiero en una estrategia única que todos entienden y que empuja en la misma dirección.',
  },
  {
    idx: 'II',
    title: 'Sin roces entre equipos',
    desc: 'Traducimos los intereses de cada área y los convertimos en acuerdos reales. El resultado es un proyecto que avanza sin conflictos internos ni decisiones que se contradicen a mitad de camino.',
  },
  {
    idx: 'III',
    title: 'Sin volver a empezar',
    desc: 'Los reprocesos son el costo más caro en cualquier proyecto. Integramos la ingeniería, el cumplimiento y los costos desde el inicio para que las decisiones sean correctas a la primera.',
  },
  {
    idx: 'IV',
    title: 'Tu organización sale más fuerte',
    desc: 'No solo resolvemos el proyecto de hoy. Te dejamos con las herramientas y la estructura para que la dimensión ambiental deje de ser un problema recurrente y se convierta en una ventaja.',
  },
]

const PASOS = [
  {
    num: '01',
    title: 'Miramos el proyecto contigo',
    desc: 'Evaluamos juntos la viabilidad antes de que inviertas en documentación. Identificamos los riesgos reales, las rutas posibles y lo que conviene hacer primero.',
  },
  {
    num: '02',
    title: 'Preparamos todo, bien',
    desc: 'Elaboramos estudios y permisos con la profundidad que exigen el SEIA y los organismos sectoriales. Sin que te sorprenda nada a mitad del proceso.',
  },
  {
    num: '03',
    title: 'Estamos en terreno contigo',
    desc: 'Durante la construcción supervisamos que los compromisos se cumplan. Si algo cambia, reaccionamos antes de que se convierta en una infracción o una paralización.',
  },
  {
    num: '04',
    title: 'Te acompañamos en operación',
    desc: 'Una vez que el proyecto funciona, seguimos. Monitoreamos tus compromisos para que la operación nunca esté en riesgo regulatorio.',
  },
]

const RIESGOS = [
  'Suspensión en el SEIA por antecedentes incompletos',
  'Multas de la SMA por incumplimiento de compromisos RCA',
  'Reprocesos costosos por cambios de diseño tardíos',
  'Paralizaciones por observaciones ciudadanas no anticipadas',
  'Sobrecostos por integración tardía de variables ambientales',
]

/* Datos reales del SEA — factores de suspensión de plazos */
const FACTORES_SEIA = [
  {
    pct: 35,
    label: 'Línea de Base incompleta',
    desc: 'Descripción insuficiente del área de influencia y del proyecto. Es la causa número uno de suspensiones — y la más costosa de corregir a mitad del proceso.',
    solution: 'Definimos el área de influencia y las variables de la LB antes de comprometer recursos. Incluye levantamientos tempranos de flora, fauna, patrimonio e hidrogeología.',
  },
  {
    pct: 25,
    label: 'Permisos Sectoriales sin información',
    desc: 'Organismos como el SAG (PAS 160) o la DGA (PAS 156/157) detienen el proceso por falta de planos, modelos técnicos o protocolos no preparados a tiempo.',
    solution: 'Identificamos todos los PAS aplicables desde el inicio y coordinamos sus antecedentes en paralelo con el EIA. Cuando el organismo pide, ya está listo.',
  },
  {
    pct: 15,
    label: 'Impactos significativos no declarados',
    desc: 'El SEA detecta riesgos que el titular no identificó y exige nuevos estudios para descartarlos, lo que paraliza el proceso por meses.',
    solution: 'Anticipamos los impactos potenciales y los justificamos técnicamente antes de la presentación, evitando observaciones que reinician el ciclo.',
  },
  {
    pct: 15,
    label: 'Rediseño por observaciones PAC',
    desc: 'Las observaciones ciudadanas durante la participación obligan a modificar el proyecto y actualizar toda la documentación desde cero.',
    solution: 'Diseñamos la estrategia de relacionamiento comunitario antes de presentar. Una PAC bien gestionada anticipa conflictos en vez de reaccionar a ellos.',
  },
  {
    pct: 10,
    label: 'Variable Cambio Climático — Ley 21.455',
    desc: 'Ya no basta medir cómo el proyecto afecta el entorno. Ahora hay que demostrar cómo el clima futuro afectará al propio proyecto. Una exigencia nueva que pocos anticipan.',
    solution: 'Incorporamos el análisis de vulnerabilidad climática en la etapa de factibilidad, usando las guías del SEA y los escenarios del MMA antes de que llegue como observación.',
  },
]

const EQUIPO = [
  { nombre: 'Carolina Hernández', iniciales: 'CH', email: 'chernandez@1punto5.com' },
  { nombre: 'Kurt Seiltgens',     iniciales: 'KS', email: 'kseiltgens@1punto5.com' },
]

/* ─── Hook: IntersectionObserver ─────────────────── */
function useRevealHook(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
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
const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IconBridge = () => (
  <svg style={{width:40,height:40}} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M4 28h32M4 28V16M36 28V16M14 28V20a6 6 0 0 1 12 0v8"/>
    <path d="M4 16c0-6 6-10 10-10M36 16c0-6-6-10-10-10"/>
  </svg>
)
const IconEye = () => (
  <svg style={{width:40,height:40}} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M4 20s6-12 16-12 16 12 16 12-6 12-16 12S4 20 4 20z"/>
    <circle cx="20" cy="20" r="5"/>
  </svg>
)
const IconShield = () => (
  <svg style={{width:40,height:40}} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M20 4l14 6v10c0 8-6 14-14 16C6 34 6 28 6 20V10l14-6z"/>
    <path d="M14 20l4 4 8-8"/>
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
  const [showIntro, setShowIntro]       = useState(true)
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
      {/* Pantalla de carga */}
      {showIntro && <LoadingScreen onComplete={handleIntroDone} />}

      {/* Blobs animados — fondo fijo detrás de toda la página */}
      <GlobalBlobs />

      <div className={`landing-content${landingVisible ? ' landing-visible' : ''}`}>

        {/* ── Nav ──────────────────────────────────── */}
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
          <a className="nav-logo" href="#">1.5 <span>Consultores</span></a>
          <div className="nav-links">
            <a href="#servicios">Servicios</a>
            <a href="#equipo"   >Equipo</a>
            <a href="#proceso"  >Proceso</a>
            <a href="#contacto" className="nav-cta">Contacto</a>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────── */}
        <section className="hero">
          <HeroCanvas />
          <div className="hero-bg-number" ref={heroNumRef}>1.5</div>
          <div className="hero-content">
            <div className="hero-eyebrow">Consultoría Ambiental Estratégica · Chile</div>
            <h1>
              Viabilidad<br/>
              <em>ambiental</em> para<br/>
              proyectos que<br/>trascienden.
            </h1>
            <p className="hero-desc">
              Somos el puente entre tu equipo técnico, legal y financiero.
              Con más de 20 años en infraestructura, minería y energía,
              integramos todo desde el inicio para que tu proyecto avance
              sin sorpresas, sin reprocesos y dentro del presupuesto.
            </p>
            <div className="hero-actions">
              <a href="#servicios" className="btn-primary">
                Ver servicios <IconArrow />
              </a>
              <a href="#contacto" className="btn-ghost">
                <IconClock /> Conversemos
              </a>
            </div>
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" /> Desplazar
          </div>
          <div className="hero-stat-row">
            {[
              ['+20', 'Años de\nexperiencia'],
              ['3', 'Industrias\nclave'],
              ['360°', 'Ciclo\ncompleto'],
            ].map(([n, l]) => (
              <div className="hero-stat" key={n}>
                <div className="hero-stat-num">{n}</div>
                <div className="hero-stat-label">
                  {l.split('\n').map((t, i) => <span key={i}>{t}<br /></span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── ¿Qué hacemos diferente? ───────────────── */}
        <section className="intro-section" id="quienes">
          <div className="intro-grid">
            {[
              {
                icon: <IconBridge />,
                title: 'Integramos desde el inicio',
                desc: 'Antes de que los problemas aparezcan, nosotros ya los vimos. Incorporamos lo técnico, lo ambiental, lo normativo y lo constructivo desde el primer día — no cuando ya es tarde para corregir.',
              },
              null,
              {
                icon: <IconEye />,
                title: 'Somos traductores estratégicos',
                desc: 'Cuando el área legal dice una cosa y el área técnica dice otra, nosotros los sentamos a la misma mesa y construimos una estrategia que funciona para todos. Eso evita reprocesos.',
                delay: 0.15,
              },
              null,
              {
                icon: <IconShield />,
                title: 'Proyectos que llegan al final',
                desc: 'Nuestro trabajo se mide en proyectos que obtienen su RCA a tiempo, sin multas y dentro del presupuesto. Con más de 20 años de experiencia, sabemos qué hace fracasar a un proyecto antes de que ocurra.',
                delay: 0.3,
              },
            ].map((col, i) =>
              col === null
                ? <div className="intro-sep" key={i} />
                : <IntroCellReveal key={i} icon={col.icon} title={col.title} desc={col.desc} delay={col.delay || 0} />
            )}
          </div>
        </section>

        <Divider />

        {/* ── Por qué se frenan los proyectos ──────── */}
        <section className="seia-section" id="seia">
          <div className="section-inner">
            <div className="seia-layout">
              <div className="seia-intro">
                <div className="section-label">Datos del SEA</div>
                <h2 className="section-h2">
                  Los mismos<br />problemas<br /><em>una y otra vez.</em>
                </h2>
                <p>
                  No son sorpresas. Son fallas que ocurren cuando la gestión
                  ambiental llega tarde al proyecto. Los datos del Sistema de
                  Evaluación de Impacto Ambiental muestran exactamente dónde
                  se detienen los proyectos — y por qué.
                </p>
                <div className="seia-callout">
                  Nosotros integramos estas variables desde el día uno,
                  antes de que se conviertan en tu problema.
                </div>
              </div>
              <AccordionSEIA items={FACTORES_SEIA} />
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Servicios ─────────────────────────────── */}
        <section className="servicios-section" id="servicios">
          <div className="section-inner">
            <div className="servicios-layout">
              <div className="servicios-intro">
                <div className="section-label">Ámbitos de acción</div>
                <h2 className="section-h2">
                  Lo que<br /><em>hacemos</em>
                </h2>
                <p>
                  Cubrimos el ciclo completo de gestión ambiental — desde la
                  prefactibilidad hasta la operación y cierre — con acompañamiento
                  técnico senior en cada fase. Dentro y fuera del SEIA.
                </p>
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

        {/* ── Cómo lo hacemos / Pilares ─────────────── */}
        <section className="valor-section" id="valor">
          <div className="valor-layout">
            <div className="valor-left">
              <div className="section-label">Propuesta de valor</div>
              <div className="valor-quote">
                Lo ambiental no tiene<br />
                por qué ser un freno.<br />
                En nuestras manos, es una<br />
                <em>ventaja para tu proyecto.</em>
              </div>
              <ul className="resultado-list">
                {[
                  'Tu proyecto obtiene su RCA en el menor tiempo posible',
                  'Sin reprocesos ni reingresos al SEIA',
                  'Sin multas de la SMA por compromisos incumplidos',
                  'Con todos tus equipos alineados desde el inicio',
                  'Con visibilidad real sobre el estado de tu proyecto',
                ].map((t, i) => (
                  <ResultadoItemReveal key={t} text={t} delay={i * 0.08} />
                ))}
              </ul>
            </div>
            <div className="valor-right">
              <div className="section-label">Cómo lo hacemos</div>
              <h2 className="section-h2">
                Cuatro pilares<br />que hacen la<br /><em>diferencia</em>
              </h2>
              <div className="valor-pillars">
                {PILLARS.map((p, i) => (
                  <PillarReveal key={p.idx} {...p} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Equipo ───────────────────────────────── */}
        <section className="equipo-section" id="equipo">
          <div className="section-inner">
            <div className="equipo-header">
              <div className="section-label" style={{ justifyContent: 'center' }}>Quiénes somos</div>
              <h2 className="section-h2">
                Más de 20 años de<br /><em>experiencia</em> aplicada
              </h2>
              <p>
                Combinamos trayectoria en evaluación ambiental, tramitación de permisos,
                ingeniería de proyectos y gestión de obras en terreno. No solo sabemos
                cómo funciona el sistema — sabemos cómo se construye.
              </p>
            </div>
            <div className="equipo-cards">
              {EQUIPO.map((p, i) => (
                <TeamCard key={p.nombre} {...p} delay={i * 0.15} />
              ))}
            </div>
            <div className="equipo-industries">
              {['Infraestructura', 'Minería', 'Energía'].map((ind) => (
                <div className="industry-tag" key={ind}>{ind}</div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Proceso ──────────────────────────────── */}
        <section className="proceso-section" id="proceso">
          <div className="section-inner">
            <div className="proceso-header">
              <div className="section-label" style={{ justifyContent: 'center' }}>Así trabajamos juntos</div>
              <h2 className="section-h2">
                Tu camino,<br /><em>paso a paso</em>
              </h2>
              <p>
                Desde el primer análisis hasta que el proyecto está en operación,
                estamos contigo en cada decisión. Sin que tengas que aprender
                el lenguaje del SEIA para entender qué está pasando.
              </p>
            </div>
            <div className="proceso-steps">
              {PASOS.map((p, i) => (
                <PasoReveal key={p.num} {...p} delay={i * 0.12} />
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Contacto / CTA ───────────────────────── */}
        <section className="impacto-section" id="contacto">
          <div className="section-inner">
            <div className="impacto-inner">

              {/* Columna izquierda — texto + lista */}
              <div className="impacto-left">
                <div className="section-label">Hablemos</div>
                <h2 className="section-h2">
                  ¿Tu proyecto<br />necesita<br /><em>avanzar</em>?
                </h2>
                <p>
                  Lo que prevenimos juntos vale más que cualquier multa o paralización.
                  Cuéntanos en qué etapa está tu proyecto y te decimos cómo podemos ayudarte.
                </p>

                <div className="impacto-card">
                  <div className="impacto-card-title">Lo que evitamos juntos</div>
                  <ul className="impacto-items">
                    {RIESGOS.map(r => (
                      <li key={r}><IconCheck />{r}</li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/56900000000?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios%20de%20consultor%C3%ADa%20ambiental."
                    className="btn-outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconWhatsApp /> Cotiza con Nosotros
                  </a>
                </div>
              </div>

              {/* Columna derecha — formulario */}
              <div className="impacto-form-col">
                <div className="impacto-form-header">
                  <div className="section-label">Formulario de contacto</div>
                  <h3 className="impacto-form-title">
                    Cuéntanos sobre<br />tu proyecto
                  </h3>
                  <p className="impacto-form-sub">
                    Respondemos en menos de 24 horas hábiles.
                  </p>
                </div>
                <ContactForm />
              </div>

            </div>
          </div>
        </section>

        {/* ── Botón flotante WhatsApp ───────────────── */}
        <a
          href="https://wa.me/56900000000?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios."
          className="wsp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <IconWhatsApp />
        </a>

        {/* ── Footer ───────────────────────────────── */}
        <footer className="footer">
          <div className="footer-logo">1.5 <span>Consultores</span></div>
          <div className="footer-copy">© 2026 1.5 Consultores — Consultoría Ambiental Estratégica · Chile</div>
          <div className="footer-links">
            <a href="#servicios">Servicios</a>
            <a href="#equipo"   >Equipo</a>
            <a href="#contacto" >Contacto</a>
          </div>
        </footer>

      </div>{/* end landing-content */}
    </>
  )
}

/* ══════════════════════════════════════════════════
   SUB-COMPONENTES
══════════════════════════════════════════════════ */

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

function ServicioCardReveal({ num, title, plain, desc, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <div ref={ref} className={`servicio-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="servicio-num">{num}</div>
      <h3>{title}</h3>
      <div className="servicio-plain">{plain}</div>
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

/* ── Acordeón SEIA interactivo ───────────────────── */
function AccordionSEIA({ items }) {
  const [openIdx, setOpenIdx] = useState(null)
  const toggle = (i) => setOpenIdx(openIdx === i ? null : i)

  return (
    <div className="accordion-seia">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        return (
          <div key={item.label} className={`accordion-item-seia ${isOpen ? 'open' : ''}`}>
            <button className="accordion-header-seia" onClick={() => toggle(i)}>
              <span className="accordion-rank-seia">{String(i + 1).padStart(2, '0')}</span>
              <div className="accordion-header-center">
                <span className="accordion-title-seia">{item.label}</span>
                <div className="accordion-mini-bar">
                  <div className="accordion-mini-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
              <span className="accordion-pct-seia">{item.pct}%</span>
              <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 5l5 5 5-5"/>
                </svg>
              </span>
            </button>
            <div className="accordion-body-seia" style={{ maxHeight: isOpen ? '260px' : '0' }}>
              <div className="accordion-inner">
                <div className="accordion-problem">
                  <span className="accordion-tag problem-tag">El problema</span>
                  <p>{item.desc}</p>
                </div>
                <div className="accordion-solution">
                  <span className="accordion-tag solution-tag">Cómo lo prevenimos</span>
                  <p>{item.solution}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Barra animada SEIA (no usada en sección, se mantiene) ── */
function BarReveal({ pct, label, desc, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [count, setCount]     = useState(0)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Contador animado sincronizado con la barra */
  useEffect(() => {
    if (!visible) return
    const DURATION = 1300
    const id = setTimeout(() => {
      const start = performance.now()
      const tick  = (now) => {
        const t      = Math.min((now - start) / DURATION, 1)
        const eased  = 1 - Math.pow(1 - t, 3) // ease-out cubic
        setCount(Math.round(eased * pct))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay * 1000)
    return () => clearTimeout(id)
  }, [visible, pct, delay])

  return (
    <div ref={ref} className={`seia-factor ${visible ? 'visible' : ''}`}>
      <div className="seia-factor-header">
        <span className="seia-factor-label">{label}</span>
        <span className="seia-factor-pct">{count}%</span>
      </div>
      <div className="seia-bar-track">
        <div
          className="seia-bar-fill"
          style={{ '--target-pct': `${pct}%`, transitionDelay: `${delay}s` }}
        />
      </div>
      <p className="seia-factor-desc">{desc}</p>
    </div>
  )
}

/* ── Card de equipo ──────────────────────────────── */
function TeamCard({ nombre, iniciales, email, delay }) {
  const [ref, visible] = useRevealHook()
  return (
    <div ref={ref} className={`team-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="team-avatar">{iniciales}</div>
      <div className="team-name">{nombre}</div>
      <a href={`mailto:${email}`} className="team-email">{email}</a>
    </div>
  )
}
