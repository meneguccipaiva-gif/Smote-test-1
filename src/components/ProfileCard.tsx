import type { Profile } from '../types'

type Props = {
  image: string
  cta: string
  profile: Profile
  onNext: () => void
}

const levels = ['Início', 'Parcial', 'Segurança']

export function ProfileCard({ image, cta, profile, onNext }: Props) {
  return (
    <section className="screen">
      <div className="screen-body">
        <h1>O seu perfil</h1>
        <div className="level" aria-label={`${profile.percentual}% de ${profile.nivel}`}>
          <div className="level-track">
            <span className="level-knob" style={{ left: `${profile.percentual}%` }} />
          </div>
          <div className="level-labels">
            {levels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        <div className="profile-proof">
          <img src={image} alt="" />
        </div>
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
      </div>
      <div className="dock">
        <button type="button" className="btn" onClick={onNext}>
          {cta}
        </button>
      </div>
    </section>
  )
}
