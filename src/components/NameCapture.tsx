import { useState } from 'react'
import { formatFirstName } from '../engine/answers'
import { isValidPhone, maskPhone, onlyDigits } from '../engine/phone'
import { Icon } from './Icon'
import { Title } from './Title'

type Fields = 'name' | 'phone' | 'both'

type Props = {
  title: string
  emphasis?: string
  subtitle: string
  cta: string
  fields?: Fields
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
  fields = 'both',
  name: initialName,
  phone: initialPhone,
  onContinue,
  onValidationError,
}: Props) {
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ? maskPhone(initialPhone) : '')
  const [error, setError] = useState('')
  const clean = formatFirstName(name)
  const askName = fields === 'name' || fields === 'both'
  const askPhone = fields === 'phone' || fields === 'both'
  const nameOk = !askName || NAME_PATTERN.test(clean)
  const phoneOk = !askPhone || isValidPhone(phone)
  const savedName = formatFirstName(initialName ?? '')

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
    const nome = askName ? clean : savedName
    const whatsapp = askPhone ? onlyDigits(phone) : onlyDigits(initialPhone ?? '')
    onContinue(nome, whatsapp)
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <Title text={title} emphasis={emphasis} />
        <p className="subtitle">{subtitle}</p>
        {askName && (
          <label className="field">
            <span className="field-label">Primeiro nome</span>
            <input
              value={name}
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint={askPhone ? 'next' : 'done'}
              maxLength={40}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !askPhone) submit()
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
        {askPhone && (
          <>
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
          </>
        )}
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
