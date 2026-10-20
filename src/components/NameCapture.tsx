import { useState } from 'react'
import { formatFirstName } from '../engine/answers'
import { isValidPhone, maskPhone, onlyDigits } from '../engine/phone'
import { Icon } from './Icon'
import { Title } from './Title'

export type ContactFields = 'name' | 'phone' | 'email' | 'both'

type Props = {
  title: string
  emphasis?: string
  subtitle: string
  cta: string
  fields?: ContactFields
  allowChannelSwitch?: boolean
  name?: string
  phone?: string
  email?: string
  onContinue: (name: string, whatsapp: string, email: string) => void
  onValidationError?: () => void
}

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)?$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NameCapture({
  title,
  emphasis,
  subtitle,
  cta,
  fields = 'both',
  allowChannelSwitch = false,
  name: initialName,
  phone: initialPhone,
  email: initialEmail,
  onContinue,
  onValidationError,
}: Props) {
  const [mode, setMode] = useState<ContactFields>(fields)
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ? maskPhone(initialPhone) : '')
  const [email, setEmail] = useState(initialEmail ?? '')
  const [error, setError] = useState('')
  const clean = formatFirstName(name)
  const askName = mode === 'name' || mode === 'both'
  const askPhone = mode === 'phone' || mode === 'both'
  const askEmail = mode === 'email'
  const nameOk = !askName || NAME_PATTERN.test(clean)
  const phoneOk = !askPhone || isValidPhone(phone)
  const emailOk = !askEmail || EMAIL_PATTERN.test(email.trim())
  const savedName = formatFirstName(initialName ?? '')
  const canSwitch = allowChannelSwitch && (mode === 'phone' || mode === 'email')

  function submit() {
    if (askName && !NAME_PATTERN.test(clean)) {
      setError('Escreva seu primeiro nome, só com letras.')
      onValidationError?.()
      return
    }
    if (askPhone && !isValidPhone(phone)) {
      setError('Digite um WhatsApp com DDD.')
      onValidationError?.()
      return
    }
    if (askEmail && !EMAIL_PATTERN.test(email.trim())) {
      setError('Digite um e-mail válido.')
      onValidationError?.()
      return
    }
    const nome = askName ? clean : savedName
    const whatsapp = askPhone ? onlyDigits(phone) : onlyDigits(initialPhone ?? '')
    const mail = askEmail ? email.trim().toLowerCase() : ''
    onContinue(nome, whatsapp, mail)
  }

  function switchChannel() {
    setError('')
    setMode((current) => (current === 'email' ? 'phone' : 'email'))
  }

  const contactOk = askEmail ? emailOk : phoneOk
  const switchLabel =
    mode === 'email' ? 'Prefiro que mande para o WhatsApp' : 'Prefiro que mande para o e-mail'
  const shownTitle = !canSwitch
    ? title
    : mode === 'email'
      ? 'Para qual e-mail enviamos o seu guia?'
      : 'Para qual WhatsApp enviamos o seu guia?'
  const shownSubtitle = !canSwitch
    ? subtitle
    : mode === 'email'
      ? 'Usamos este e-mail só para entregar o Guia Memórias Vivas e a vídeo-aula. Sem propaganda.'
      : 'Usamos este número só para entregar o Guia Memórias Vivas e a vídeo-aula. Sem ligação e sem propaganda.'
  const shownCta = !canSwitch
    ? cta
    : mode === 'email'
      ? 'Receber meu guia no e-mail'
      : 'Receber meu guia no WhatsApp'

  return (
    <section className="screen">
      <div className="screen-body">
        <Title text={shownTitle} emphasis={emphasis} />
        <p className="subtitle">{shownSubtitle}</p>
        {askName && (
          <label className="field">
            <span className="field-label">Primeiro nome</span>
            <input
              value={name}
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint={askPhone || askEmail ? 'next' : 'done'}
              maxLength={40}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !askPhone && !askEmail) submit()
              }}
            />
          </label>
        )}
        {askPhone && (
          <label className="field">
            <span className="field-label">WhatsApp</span>
            <input
              value={phone}
              inputMode="numeric"
              autoComplete="tel"
              enterKeyHint="done"
              placeholder="(11) 98888-7777"
              aria-invalid={Boolean(error) && !phoneOk}
              onChange={(event) => {
                setPhone(maskPhone(event.target.value))
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit()
              }}
            />
          </label>
        )}
        {askEmail && (
          <label className="field">
            <span className="field-label">E-mail</span>
            <input
              value={email}
              type="email"
              inputMode="email"
              autoComplete="email"
              enterKeyHint="done"
              placeholder="seuemail@exemplo.com"
              aria-invalid={Boolean(error) && !emailOk}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit()
              }}
            />
          </label>
        )}
        {(askPhone || askEmail) && (
          <>
            <aside className="reassure reassure-lock">
              <p className="reassure-title">
                <Icon name="lock" size={18} />
                {askEmail
                  ? 'Seu e-mail serve só para enviar o material'
                  : 'Seu WhatsApp serve só para enviar o material'}
              </p>
              <p>
                {askEmail
                  ? 'Sem newsletter e sem propaganda. Usamos este e-mail exclusivamente para entregar o seu guia.'
                  : 'Sem ligação, sem grupo e sem propaganda. Seus dados não são vendidos. Usamos este número exclusivamente para entregar o seu guia.'}
              </p>
            </aside>
            <aside className="reassure reassure-brand-box">
              <div className="reassure-brand">
                <img src="/brand/clube-antenados.png" alt="" />
                <span>Clube de Antenados</span>
              </div>
              <p>Somos uma empresa de soluções de educação para pessoas maduras.</p>
            </aside>
            {canSwitch && (
              <button type="button" className="skip-link channel-switch" onClick={switchChannel}>
                {switchLabel}
              </button>
            )}
          </>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="dock">
        <button
          type="button"
          className="btn"
          disabled={!nameOk || !contactOk}
          onClick={submit}
        >
          {shownCta}
        </button>
      </div>
    </section>
  )
}
