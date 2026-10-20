import { useState } from 'react'
import { formatFirstName } from '../engine/answers'
import { isValidPhone, maskPhone, onlyDigits } from '../engine/phone'
import { Icon } from './Icon'
import { Title } from './Title'

type Props = {
  title: string
  emphasis?: string
  subtitle: string
  cta: string
  name?: string
  phone?: string
  onContinue: (name: string, whatsapp: string) => void
  onValidationError?: () => void
}

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)?$/

export function NameCapture({
  title,
  emphasis,
  subtitle,
  cta,
  name: initialName,
  phone: initialPhone,
  onContinue,
  onValidationError,
}: Props) {
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ? maskPhone(initialPhone) : '')
  const [error, setError] = useState('')
  const clean = formatFirstName(name)
  const nameOk = NAME_PATTERN.test(clean)
  const phoneOk = isValidPhone(phone)

  function submit() {
    if (!nameOk) {
      setError('Escreva seu primeiro nome, só com letras.')
      onValidationError?.()
      return
    }
    if (!phoneOk) {
      setError('Digite um WhatsApp com DDD.')
      onValidationError?.()
      return
    }
    onContinue(clean, onlyDigits(phone))
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <Title text={title} emphasis={emphasis} />
        <p className="subtitle">{subtitle}</p>
        <label className="field">
          <span className="field-label">Primeiro nome</span>
          <input
            value={name}
            autoComplete="given-name"
            autoCapitalize="words"
            enterKeyHint="next"
            maxLength={40}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
          />
        </label>
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
        <aside className="reassure reassure-lock">
          <p className="reassure-title">
            <Icon name="lock" size={18} />
            Seu WhatsApp serve só para enviar o material
          </p>
          <p>
            Sem ligação, sem grupo e sem propaganda. Seus dados não são vendidos. Usamos este número
            exclusivamente para entregar o seu guia.
          </p>
        </aside>
        <aside className="reassure reassure-brand-box">
          <div className="reassure-brand">
            <img src="/brand/clube-antenados.png" alt="" />
            <span>Clube de Antenados</span>
          </div>
          <p>Somos uma empresa de soluções de educação para pessoas maduras.</p>
        </aside>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="dock">
        <button type="button" className="btn" disabled={!nameOk || !phoneOk} onClick={submit}>
          {cta}
        </button>
      </div>
    </section>
  )
}
