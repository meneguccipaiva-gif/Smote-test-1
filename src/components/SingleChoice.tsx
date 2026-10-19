import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { Title } from './Title'
import type { Option } from '../types'

type Props = {
  title: string
  emphasis?: string
  subtitle?: string
  note?: string
  options: Option[]
  value?: string
  onSelect: (value: string) => void
  onNext: () => void
}

export function SingleChoice({ title, emphasis, subtitle, note, options, value, onSelect, onNext }: Props) {
  const [selected, setSelected] = useState(value ?? '')
  const timer = useRef<number | null>(null)
  const pictured = options.some((option) => option.image)

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current)
    }
  }, [])

  function choose(next: string) {
    if (timer.current != null) return
    setSelected(next)
    onSelect(next)
    timer.current = window.setTimeout(onNext, 500)
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <Title text={title} emphasis={emphasis} />
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {pictured ? (
          <div className="photo-grid">
            {options.map((option) => (
              <PhotoCard
                key={option.value}
                option={option}
                selected={selected === option.value}
                fill={options.every((item) => item.image)}
                onChoose={choose}
              />
            ))}
          </div>
        ) : (
          <div className="stack">
            {options.map((option) => {
              const isSelected = selected === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  className={isSelected ? 'plain-choice is-selected' : 'plain-choice'}
                  aria-pressed={isSelected}
                  onClick={() => choose(option.value)}
                >
                  {option.icon && (
                    <span className="choice-emoji">
                      <Icon name={option.icon} size={28} />
                    </span>
                  )}
                  <span className="choice-label">{option.label}</span>
                  <span className="choice-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      {note && <p className="legal">{note}</p>}
    </section>
  )
}

function PhotoCard({
  option,
  selected,
  fill,
  onChoose,
}: {
  option: Option
  selected: boolean
  fill: boolean
  onChoose: (value: string) => void
}) {
  const wide = !option.image
  return (
    <button
      type="button"
      className={['photo-card', wide ? 'is-wide' : '', selected ? 'is-selected' : ''].filter(Boolean).join(' ')}
      aria-pressed={selected}
      onClick={() => onChoose(option.value)}
    >
      {option.image ? (
        <>
          <span className={fill ? 'photo-face is-cover' : 'photo-face'}>
            <img src={option.image} alt="" />
          </span>
          <span className="photo-caption">
            <span>{option.label}</span>
            <span aria-hidden="true">→</span>
          </span>
        </>
      ) : (
        <span className="photo-plain">
          {option.icon && <Icon name={option.icon} size={24} />}
          <span>{option.label}</span>
          <span aria-hidden="true">→</span>
        </span>
      )}
    </button>
  )
}
