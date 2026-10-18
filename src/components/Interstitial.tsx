import { Icon } from './Icon'
import type { IconName } from '../types'

type Props = {
  icon: IconName
  kicker?: string
  title?: string
  paragraphs: string[]
  image?: string
  onNext: () => void
}

export function Interstitial({ icon, kicker, title, paragraphs, image, onNext }: Props) {
  const [lead, ...rest] = paragraphs

  return (
    <section className="screen">
      <div className="screen-body center-copy">
        {image ? (
          <img className="hero" src={image} alt="" />
        ) : (
          <span className="hero-icon">
            <Icon name={icon} size={56} />
          </span>
        )}
        {kicker && <p className="kicker">{kicker}</p>}
        {title && <h1>{title}</h1>}
        {lead && <blockquote>{lead}</blockquote>}
        {rest.map((paragraph) => (
          <p key={paragraph} className="body">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="dock">
        <button type="button" className="btn" onClick={onNext}>
          Continuar
        </button>
      </div>
    </section>
  )
}
