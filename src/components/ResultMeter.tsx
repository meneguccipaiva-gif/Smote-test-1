import { fill, profileVars } from '../engine/answers'
import type { Profile } from '../types'

type Props = {
  title: string
  body: string
  cta: string
  profile: Profile
  onNext: () => void
}

export function ResultMeter({ title, body, cta, profile, onNext }: Props) {
  const vars = profileVars(profile)

  return (
    <section className="screen">
      <div className="screen-body center-copy">
        <p className="kicker">Seu resultado</p>
        <p className="score" aria-hidden="true">
          {profile.percentual}%
        </p>
        <div
          className="meter"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={profile.percentual}
          aria-label="Nível calculado a partir das suas respostas"
        >
          <span style={{ width: `${profile.percentual}%` }} />
        </div>
        <h1>{fill(title, vars)}</h1>
        <p className="body">{fill(body, vars)}</p>
      </div>
      <div className="dock">
        <button type="button" className="btn" onClick={onNext}>
          {cta}
        </button>
      </div>
    </section>
  )
}
