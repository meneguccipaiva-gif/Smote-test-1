import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PRICE } from '../content/price'

type Props = {
  open: boolean
  onOpen: () => void
  onNext: () => void
  video?: string
  poster?: string
  productTitle?: string
  productBody?: string
  cta?: string
}

type Phase = 'idle' | 'opening' | 'handoff' | 'shown'

const LID_MS = 560
const FADE_MS = 520

export function GiftReveal({
  open,
  onOpen,
  onNext,
  video,
  poster,
  productTitle,
  productBody,
  cta = 'Resgatar meu plano com desconto',
}: Props) {
  const [phase, setPhase] = useState<Phase>(open ? 'shown' : 'idle')
  const onOpenRef = useRef(onOpen)
  const percentRef = useRef<HTMLElement>(null)
  const captionRef = useRef<HTMLElement>(null)
  const showGift = phase === 'idle' || phase === 'opening' || phase === 'handoff'
  const showBadge = phase === 'handoff' || phase === 'shown'

  useEffect(() => {
    onOpenRef.current = onOpen
  })

  useLayoutEffect(() => {
    if (!showBadge) return
    const percent = percentRef.current
    const caption = captionRef.current
    if (!percent || !caption) return

    function fit() {
      if (!percent || !caption) return
      const target = caption.offsetWidth
      let low = 24
      let high = 180
      for (let pass = 0; pass < 14; pass += 1) {
        const mid = (low + high) / 2
        percent.style.fontSize = `${mid}px`
        if (percent.offsetWidth < target) low = mid
        else high = mid
      }
      percent.style.fontSize = `${low}px`
    }

    fit()
    let cancel = false
    document.fonts.ready.then(() => {
      if (!cancel) fit()
    })
    return () => {
      cancel = true
    }
  }, [showBadge])

  useEffect(() => {
    if (phase !== 'opening') return
    const timer = window.setTimeout(() => setPhase('handoff'), LID_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'handoff') return
    const timer = window.setTimeout(() => {
      onOpenRef.current()
      setPhase('shown')
    }, FADE_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  return (
    <section className="screen gift-screen">
      <div className="screen-body center-copy">
        <div className="gift-stage">
          {showGift && (
            <div className={phase === 'handoff' ? 'gift-layer is-out' : 'gift-layer'}>
              <h1>Tem um presente para você</h1>
              <p className="subtitle">Toque na caixa abaixo para abrir seu presente exclusivo.</p>
              <button
                type="button"
                className="gift-box"
                onClick={() => setPhase('opening')}
                disabled={phase !== 'idle'}
              >
                <GiftBox open={phase !== 'idle'} />
                <span>Abrir presente</span>
              </button>
            </div>
          )}
          {showBadge && (
            <div className={phase === 'handoff' ? 'gift-layer is-in' : 'gift-layer'}>
              <h1>Seu desconto foi liberado</h1>
              <p className="subtitle">
                {productTitle ?? 'A condição promocional deste diagnóstico já está aplicada.'}
              </p>
              <div
                className={phase === 'handoff' ? 'gift-badge is-in' : 'gift-badge'}
                aria-live="polite"
              >
                <strong ref={percentRef}>{PRICE.percent}%</strong>
                <span ref={captionRef}>de desconto liberado</span>
              </div>
              {productBody && <p className="gift-product">{productBody}</p>}
              {video && (
                <div className="gift-video-frame">
                  <video
                    className="gift-video-inline"
                    src={video}
                    poster={poster}
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showBadge && (
        <div className={phase === 'handoff' ? 'dock is-in' : 'dock'}>
          <button type="button" className="btn" onClick={onNext}>
            {cta}
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
