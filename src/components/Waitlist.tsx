import { useState } from 'react'
import { isValidPhone, maskPhone, onlyDigits } from '../engine/phone'

type Props = {
  name: string
  phone: string
  submitted: boolean
  onSubmit: (name: string, whatsapp: string) => Promise<boolean>
}

export function Waitlist({ name, phone, submitted, onSubmit }: Props) {
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const ready = name.trim().length >= 2 && isValidPhone(phone)
  const who = name.trim()

  async function submit() {
    if (!ready) {
      setError('Não encontramos o nome e o WhatsApp desta sessão.')
      return
    }
    setSending(true)
    setError('')
    const ok = await onSubmit(who, onlyDigits(phone))
    setSending(false)
    if (!ok) setError('Não foi possível enviar agora. Tente de novo.')
  }

  if (submitted) {
    return (
      <section className="screen">
        <div className="screen-body center-copy">
          <p className="kicker">Lista de espera</p>
          <h1>Você entrou na lista.</h1>
          <p className="body">
            As vagas desta condição esgotaram. Quando abrir a próxima turma, o aviso chega no WhatsApp
            {who ? ` de ${who}` : ''}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <p className="kicker">Vagas esgotadas</p>
        <h1>As vagas desta condição especial esgotaram</h1>
        <p className="subtitle">
          {`A próxima turma avisa no WhatsApp que você já informou${who ? `, no nome de ${who}` : ''}${ready ? ` (${maskPhone(phone)})` : ''}.`}
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="dock">
        <button type="button" className="btn" disabled={sending || !ready} onClick={() => void submit()}>
          {sending ? 'Enviando...' : 'Entrar na lista de espera'}
        </button>
      </div>
    </section>
  )
}
