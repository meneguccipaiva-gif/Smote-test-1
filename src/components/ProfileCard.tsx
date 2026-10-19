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
        <p className="reading-card">
          <strong>{profile.nivel}</strong>
          {profile.leitura}
        </p>
        <div className="summary-card">
          <dl className="summary">
            {profile.card.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <img className="summary-photo" src={image} alt="" />
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
