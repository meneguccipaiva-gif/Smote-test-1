import { useEffect, useRef, useState } from 'react'
import { asString, fill, orderByAge, profileVars } from '../engine/answers'
import { brl, PRICE } from '../content/price'
import { Icon } from './Icon'
import type { Answers, CompareContent, OfferContent, Profile } from '../types'

type Props = {
  compare: CompareContent
  offer: OfferContent
  profile: Profile
  answers: Answers
  onBuy: () => void
}

const seals = [
  { icon: 'lock' as const, text: 'Pagamento 100% seguro' },
  { icon: 'phone' as const, text: 'Acesso direto pelo WhatsApp ou e-mail. Sem precisar criar conta.' },
  { icon: 'bolt' as const, text: 'Liberação só depois da confirmação do pagamento' },
]

export function OfferPage({ compare, offer, profile, answers, onBuy }: Props) {
  const vars = profileVars(profile)
  const title = diagnosisTitle(offer.diagnosisTitle, profile.primeiro_nome, vars)
  const testimonials = orderByAge(offer.testimonials, asString(answers, 'faixa_etaria'))
  const priceRef = useRef<HTMLElement>(null)
  const [priceSeen, setPriceSeen] = useState(false)

  useEffect(() => {
    const node = priceRef.current
    if (!node || priceSeen) return
    let delayTimer = 0
    const observer = new IntersectionObserver(
      (entries) => {
        const ready = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 1)
        if (!ready) return
        observer.disconnect()
        delayTimer = window.setTimeout(() => setPriceSeen(true), 450)
      },
      { threshold: 1, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      window.clearTimeout(delayTimer)
    }
  }, [priceSeen])

  return (
    <section className="screen">
      <div className="screen-body offer is-scrollable">
        <section>
          <h1>{compare.title}</h1>
          <div className="compare">
            <article className="is-now">
              <img src={compare.beforeImage} alt="" />
              <h2>{compare.nowLabel}</h2>
              <p className="compare-value">{fill(compare.nowValue, vars)}</p>
              <div className="compare-meter">
                <span style={{ width: '32%' }} />
              </div>
              <p className="compare-detail">{fill(compare.nowDetail, vars)}</p>
            </article>
            <article className="is-after">
              <img src={compare.afterImage} alt="" />
              <h2>{compare.goalLabel}</h2>
              <p className="compare-value">{fill(compare.goalValue, vars)}</p>
              <div className="compare-meter is-full">
                <span />
              </div>
              <p className="compare-detail">{fill(compare.goalDetail, vars)}</p>
            </article>
          </div>
        </section>

        <section>
          <p className="kicker">Seu diagnóstico</p>
          <h1>{title}</h1>
          <p className="subtitle">{fill(offer.diagnosisSubtitle, vars)}</p>
          <p className="focus-line">{profile.linhaOferta || profile.foco}</p>
        </section>

        {offer.video && (
          <div className="offer-video-frame">
            <video
              className="offer-video-inline"
              src={offer.video}
              poster={offer.videoPoster}
              muted
              autoPlay
              loop
              playsInline
            />
          </div>
        )}

        <section className="price-card" ref={priceRef}>
          <p className="kicker">Condição especial deste diagnóstico</p>
          <p className="price-from">De {brl(PRICE.from)}</p>
          <p className="price-now">{brl(PRICE.to)}</p>
          <p className="body">Pagamento único. Sem mensalidades.</p>
          <p className="save">Economia imediata de {brl(PRICE.save)}</p>
        </section>

        <section className="offer-card">
          <h2>{offer.highlight}</h2>
          <p className="lead">{offer.offerLead}</p>
          <p className="body">{offer.offerCopy}</p>
        </section>

        <section>
          <h2>O que você recebe</h2>
          <div className="stack">
            {offer.deliverables.map((item) => (
              <article key={item.title} className="deliverable">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="guarantee">
          <h2>{offer.guaranteeTitle}</h2>
          <p className="body">{offer.guaranteeText}</p>
        </section>

        <section>
          <p className="stars" aria-label={`Avaliação ${offer.rating}`}>
            <Icon name="star" size={22} />
            <Icon name="star" size={22} />
            <Icon name="star" size={22} />
            <Icon name="star" size={22} />
            <Icon name="star" size={22} />
            <span>{offer.rating}</span>
          </p>
          <p className="body">{offer.socialLine}</p>
          <div className="stack">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="quote">
                <p>{item.text}</p>
                <footer>
                  {item.name}, {item.age} anos
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="seals">
          <h2>Compra sem complicação</h2>
          <ul>
            {seals.map((seal) => (
              <li key={seal.text}>
                <Icon name={seal.icon} size={28} />
                <span>{seal.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {priceSeen && (
        <div className="dock dock-fade-in">
          <button type="button" className="btn" onClick={onBuy}>
            {offer.cta}
          </button>
          <p className="fine">{offer.ctaSub}</p>
        </div>
      )}
    </section>
  )
}

function diagnosisTitle(template: string, name: string, vars: Record<string, string | number>) {
  const filled = fill(template, vars)
  if (name) return filled
  return filled.replace(/,\s*!/, '!')
}
