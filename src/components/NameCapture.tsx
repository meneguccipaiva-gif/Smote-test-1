import { useState } from 'react'
import { formatFirstName } from '../engine/answers'
import { isValidPhone, maskPhone, onlyDigits } from '../engine/phone'

type Props = {
  title: string
  subtitle: string
  cta: string
  name?: string
  phone?: string
  onContinue: (name: string, whatsapp: string) => void
}

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)?$/

export function NameCapture({ title, subtitle, cta, name: initialName, phone: initialPhone, onContinue }: Props) {
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ? maskPhone(initialPhone) : '')
  const [error, setError] = useState('')
  const clean = formatFirstName(name)
  const nameOk = NAME_PATTERN.test(clean)
  const phoneOk = isValidPhone(phone)

  function submit() {
    if (!nameOk) {
      setError('Escreva seu primeiro nome, só com letras.')
      return
    }
    if (!phoneOk) {
      setError('Digite um WhatsApp com DDD.')
      return
    }
    onContinue(clean, onlyDigits(phone))
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <h1>{title}</h1>
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
