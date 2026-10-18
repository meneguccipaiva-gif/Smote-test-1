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
        <img className="hero" src={image} alt="" />
        <p className="kicker">Seu perfil</p>
        <h1>{profile.nivel}</h1>
        <div className="level" aria-label={`${profile.percentual}% de ${profile.nivel}`}>
          <div className="level-track">
            <span style={{ width: `${profile.percentual}%` }} />
          </div>
          <div className="level-labels">
            {levels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        <p className="reading">{profile.leitura}</p>
        <dl className="summary">
          {profile.card.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="dock">
        <button type="button" className="btn" onClick={onNext}>
          {cta}
        </button>
      </div>
    </section>
  )
}
