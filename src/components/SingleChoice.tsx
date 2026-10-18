import { useState } from 'react'
import { Icon } from './Icon'
import type { Option } from '../types'

type Props = {
  title: string
  subtitle?: string
  note?: string
  layout?: 'stack' | 'devices'
  options: Option[]
  value?: string
  onSelect: (value: string) => void
  onNext: () => void
}

export function SingleChoice({ title, subtitle, note, layout = 'stack', options, value, onSelect, onNext }: Props) {
  const [selected, setSelected] = useState(value ?? '')
  const pictured = layout === 'devices' ? options.filter((option) => option.image) : []
  const rest = layout === 'devices' ? options.filter((option) => !option.image) : options

  function choose(next: string) {
    setSelected(next)
    onSelect(next)
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {pictured.length > 0 && (
          <div className="device-grid">
            {pictured.map((option) => (
              <DeviceCard
                key={option.value}
                option={option}
                selected={selected === option.value}
                onChoose={choose}
              />
            ))}
          </div>
        )}
        <div className="stack">
          {rest.map((option) => {
            const isSelected = selected === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={isSelected ? 'choice is-selected' : 'choice'}
                aria-pressed={isSelected}
                onClick={() => choose(option.value)}
              >
                {option.icon && (
                  <span className="choice-icon">
                    <Icon name={option.icon} />
                  </span>
                )}
                <span className="choice-label">{option.label}</span>
                <span className="choice-mark" aria-hidden="true">
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>
        {note && <p className="legal">{note}</p>}
      </div>
      <div className="dock">
        <button type="button" className="btn" disabled={!selected} onClick={onNext}>
          Continuar
        </button>
      </div>
    </section>
  )
}

function DeviceCard({
  option,
  selected,
  onChoose,
}: {
  option: Option
  selected: boolean
  onChoose: (value: string) => void
}) {
  return (
    <button
      type="button"
      className={selected ? 'device-card is-selected' : 'device-card'}
      aria-pressed={selected}
      onClick={() => onChoose(option.value)}
    >
      <img src={option.image} alt="" />
      <span>{option.label}</span>
    </button>
  )
}
