import { useEffect, useRef, useState } from 'react'
import { PRICE } from '../content/price'

type Props = {
  open: boolean
  onOpen: () => void
  onNext: () => void
}

export function GiftReveal({ open, onOpen, onNext }: Props) {
  const [opening, setOpening] = useState(false)
  const onOpenRef = useRef(onOpen)

  useEffect(() => {
    onOpenRef.current = onOpen
  })

  useEffect(() => {
    if (!opening) return
    const timer = window.setTimeout(() => onOpenRef.current(), 560)
    return () => window.clearTimeout(timer)
  }, [opening])

  return (
    <section className="screen">
      <div className="screen-body center-copy">
        <h1>{open ? 'Seu desconto foi liberado' : 'Tem um presente para você'}</h1>
        <p className="subtitle">
          {open
            ? 'A condição promocional deste diagnóstico já está aplicada.'
            : 'Toque na caixa abaixo para abrir seu presente exclusivo.'}
        </p>
        {open ? (
          <div className="gift-badge" aria-live="polite">
            <strong>{PRICE.percent}%</strong>
            <span>de desconto liberado</span>
          </div>
        ) : (
          <button type="button" className="gift-box" onClick={() => setOpening(true)} disabled={opening}>
            <GiftBox open={opening} />
            <span>Abrir presente</span>
          </button>
        )}
      </div>
      {open && (
        <div className="dock">
          <button type="button" className="btn" onClick={onNext}>
            Resgatar meu plano com desconto
          </button>
        </div>
      )}
    </section>
  )
}

function GiftBox({ open }: { open: boolean }) {
  return (
    <svg className={open ? 'gift-art is-open' : 'gift-art'} viewBox="0 0 160 160" aria-hidden="true">
      <g className="gift-base">
        <rect x="28" y="78" width="104" height="62" rx="10" fill="#10B981" />
        <rect x="70" y="78" width="20" height="62" fill="#059669" />
      </g>
      <g className="gift-lid">
        <rect x="22" y="64" width="116" height="22" rx="6" fill="#34D399" />
        <path d="M80 66c-16 0-30-8-30-22 0-10 8-16 18-10 7 4 12 18 12 32Z" fill="#059669" />
        <path d="M80 66c16 0 30-8 30-22 0-10-8-16-18-10-7 4-12 18-12 32Z" fill="#34D399" />
        <rect x="72" y="42" width="16" height="24" rx="4" fill="#047857" />
      </g>
    </svg>
  )
}
