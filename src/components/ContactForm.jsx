import { useState } from 'react'
import './ContactForm.css'

// ─── Web3Forms ───────────────────────────────────────────────
// 1. Ve a https://web3forms.com
// 2. Ingresa chernandez@1punto5c.com → recibirás un Access Key por email
// 3. Reemplaza el valor de ACCESS_KEY aquí abajo
const ACCESS_KEY = 'f5a4684b-f35a-411c-9156-ad723b4926f2'

const SERVICIOS_OPCIONES = [
  'Estudios de Impacto Ambiental (EIA / DIA)',
  'Permisos Ambientales y Sectoriales',
  'Integración Estratégica 360°',
  'Sistemas de Gestión Ambiental',
  'Monitoreo y Seguimiento RCA',
  'Auditorías y Due Diligence Ambiental',
  'Recursos Hídricos e Hidrología',
  'Participación Ciudadana',
  'Evaluación Ambiental Estratégica (EAE)',
  'No sé por dónde empezar / Necesito orientación',
]

export default function ContactForm() {
  const [fields, setFields] = useState({
    nombre: '',
    correo: '',
    empresa: '',
    servicio: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [submitType, setSubmitType] = useState('')

  const handleChange = e => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isValid = fields.nombre && fields.correo && fields.empresa && fields.servicio

  const handleSubmit = async (type) => {
    if (!isValid) return
    setSubmitType(type)
    setStatus('loading')

    const subject = type === 'reunion'
      ? `Solicitud de Reunión de Asesoría — ${fields.empresa}`
      : `Solicitud de Contacto Comercial — ${fields.empresa}`

    const body = {
      access_key: ACCESS_KEY,
      subject,
      from_name: fields.nombre,
      email: fields.correo,
      cc: 'kseiltgens@1punto5c.com',        // copia a Kurt
      replyto: fields.correo,
      empresa: fields.empresa,
      servicio: fields.servicio,
      tipo_contacto: type === 'reunion' ? 'Reunión de Asesoría' : 'Contacto Comercial',
      botcheck: '',
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setFields({ nombre: '', correo: '', empresa: '', servicio: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="cf-success">
        <div className="cf-success-icon">✓</div>
        <h3>¡Mensaje enviado!</h3>
        <p>
          {submitType === 'reunion'
            ? 'Hemos recibido tu solicitud de reunión. Te contactaremos en menos de 24 horas para coordinar.'
            : 'Hemos recibido tu solicitud. Un ejecutivo te escribirá a la brevedad.'}
        </p>
        <button className="cf-reset" onClick={() => setStatus('idle')}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form className="cf-form" onSubmit={e => e.preventDefault()} noValidate>
      {/* Honeypot anti-spam */}
      <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex="-1" />

      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-nombre">Nombre completo</label>
        <input
          id="cf-nombre"
          className="cf-input"
          type="text"
          name="nombre"
          placeholder="Carolina Martínez"
          value={fields.nombre}
          onChange={handleChange}
          autoComplete="name"
        />
      </div>

      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-correo">Correo corporativo</label>
        <input
          id="cf-correo"
          className="cf-input"
          type="email"
          name="correo"
          placeholder="cmartinez@empresa.cl"
          value={fields.correo}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-empresa">Empresa</label>
        <input
          id="cf-empresa"
          className="cf-input"
          type="text"
          name="empresa"
          placeholder="Minera Pacífico S.A."
          value={fields.empresa}
          onChange={handleChange}
          autoComplete="organization"
        />
      </div>

      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-servicio">¿En qué te podemos ayudar?</label>
        <div className="cf-select-wrap">
          <select
            id="cf-servicio"
            className="cf-select"
            name="servicio"
            value={fields.servicio}
            onChange={handleChange}
          >
            <option value="" disabled>Selecciona una opción...</option>
            {SERVICIOS_OPCIONES.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
          <span className="cf-select-arrow">▾</span>
        </div>
      </div>

      {status === 'error' && (
        <p className="cf-error-msg">
          Ocurrió un error al enviar. Inténtalo de nuevo o escríbenos directamente.
        </p>
      )}

      <div className="cf-actions">
        <button
          type="button"
          className="cf-btn-primary"
          disabled={!isValid || status === 'loading'}
          onClick={() => handleSubmit('reunion')}
        >
          {status === 'loading' && submitType === 'reunion'
            ? <span className="cf-spinner" /> : null}
          Agendar Reunión de Asesoría
        </button>
        <button
          type="button"
          className="cf-btn-outline"
          disabled={!isValid || status === 'loading'}
          onClick={() => handleSubmit('comercial')}
        >
          {status === 'loading' && submitType === 'comercial'
            ? <span className="cf-spinner" /> : null}
          Solicitar Contacto Comercial
        </button>
      </div>

      <p className="cf-disclaimer">
        Tu información es confidencial. Solo la usan Carolina y Kurt para responder tu consulta.
      </p>
    </form>
  )
}
