import { fill, profileVars } from '../engine/answers'
import { Title } from './Title'
import type { Profile } from '../types'

type Props = {
  title: string
  emphasis?: string
  body: string
  cta: string
  image: string
  profile: Profile
  showSummary?: boolean
  onNext: () => void
}

export function ResultMeter({
  title,
  emphasis,
  body,
  cta,
  image,
  profile,
  showSummary = false,
  onNext,
}: Props) {
  const vars = profileVars(profile)

  return (
    <section className="screen">
      <div className="screen-body is-scrollable">
        <div className="result-photo">
          <img src={image} alt="" />
        </div>
        <Title text={fill(title, vars)} emphasis={emphasis} />
        <div
          className="level"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={profile.percentual}
          aria-label="Nível calculado a partir das suas respostas"
        >
          <div className="level-track">
            <span className="level-knob" style={{ left: `${profile.percentual}%` }} />
          </div>
        </div>
        <p className="reading-card">{fill(body, vars)}</p>
        {showSummary && profile.card.length > 0 && (
          <div className="summary-card summary-card-full">
            <dl className="summary">
              {profile.card.map((row) => (
                <div key={row.label} className={row.highlight ? 'is-highlight' : undefined}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
      <div className="dock">
        <button type="button" className="btn" onClick={onNext}>
          {cta}
        </button>
      </div>
    </section>
  )
}
