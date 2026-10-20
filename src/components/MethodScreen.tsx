import { Title } from './Title'

type Step = {
  title: string
  text: string
}

type Props = {
  title: string
  emphasis?: string
  kicker?: string
  intro: string
  image?: string
  steps: Step[]
  cta: string
  onNext: () => void
}

export function MethodScreen({
  title,
  emphasis,
  kicker = 'O método',
  intro,
  image,
  steps,
  cta,
  onNext,
}: Props) {
  return (
    <section className="screen">
      <div className="screen-body is-scrollable">
        {image && <img className="hero" src={image} alt="" />}
        <p className="kicker">{kicker}</p>
        <Title text={title} emphasis={emphasis} />
        <p className="subtitle">{intro}</p>
        <ol className="steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="dock">
        <button type="button" className="btn" onClick={onNext}>
          {cta}
        </button>
      </div>
    </section>
  )
}
