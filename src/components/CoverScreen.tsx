import type { IconName } from '../types'
import { Icon } from './Icon'

type Seal = {
  icon: IconName
  label: string
}

type Props = {
  promise: string
  emphasis?: string
  cta: string
  video: string
  poster?: string
  kicker?: string
  subtitle?: string
  fine?: string
  seals?: Seal[]
  onStart: () => void
}

export function CoverScreen({
  promise,
  emphasis,
  cta,
  video,
  poster,
  kicker,
  subtitle,
  fine,
  seals,
  onStart,
}: Props) {
  return (
    <section className="screen cover-screen">
      <div className="screen-body cover-body">
        <img
          className="cover-brand"
          src="/brand/clube-antenados.png"
          alt={kicker || 'Clube de Antenados'}
        />
        <div className="cover-video-frame">
          <video
            className="cover-video-inline"
            src={video}
            poster={poster}
            muted
            autoPlay
            loop
            playsInline
          />
        </div>
        <h1 className="cover-promise">{renderPromise(promise, emphasis)}</h1>
        {subtitle && <p className="subtitle cover-subtitle">{renderSubtitle(subtitle)}</p>}
        {seals && seals.length > 0 && (
          <ul className="cover-seals">
            {seals.map((seal) => (
              <li key={seal.label}>
                <span className="cover-seal-icon">
                  <Icon name={seal.icon} size={32} />
                </span>
                <span>{seal.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="dock cover-dock">
        <button type="button" className="btn btn-cover" onClick={onStart}>
          {cta}
        </button>
        {fine && <p className="fine cover-fine">{renderFine(fine)}</p>}
      </div>
    </section>
  )
}

function renderPromise(text: string, emphasis?: string) {
  if (!emphasis) return text
  const index = text.indexOf(emphasis)
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <span className="cover-promise-accent">{emphasis}</span>
      {text.slice(index + emphasis.length)}
    </>
  )
}

function renderSubtitle(text: string) {
  const marker = 'WhatsApp'
  const index = text.indexOf(marker)
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <strong>{marker}</strong>
      {text.slice(index + marker.length)}
    </>
  )
}

function renderFine(text: string) {
  const parts = text.split(/(?<=\.)\s+/)
  if (parts.length < 2) return text
  return (
    <>
      {parts[0]}
      <br />
      {parts.slice(1).join(' ')}
    </>
  )
}
