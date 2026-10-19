import { Icon } from './Icon'
import { Title } from './Title'
import type { IconName } from '../types'

type Props = {
  icon: IconName
  kicker?: string
  title?: string
  emphasis?: string
  paragraphs: string[]
  image?: string
  onNext: () => void
}

export function Interstitial({ icon, kicker, title, emphasis, paragraphs, image, onNext }: Props) {
  const [lead, ...rest] = paragraphs

  return (
    <section className="screen">
      <div className="screen-body">
        {image ? (
          <div className="story-frame">
            <img className="story-photo" src={image} alt="" />
          </div>
        ) : (
          <span className="hero-icon">
            <Icon name={icon} size={48} />
          </span>
        )}
        {kicker && <p className="subtitle">{kicker}</p>}
        {title && <Title text={title} emphasis={emphasis} />}
        {lead && <p className="story-box">{lead}</p>}
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
