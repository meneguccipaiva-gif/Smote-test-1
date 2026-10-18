import { useState } from 'react'
import type { Option } from '../types'

type Props = {
  title: string
  subtitle?: string
  options: Option[]
  value?: string[]
  initial?: string[]
  onContinue: (value: string[]) => void
}

export function MultiChoice({ title, subtitle, options, value, initial, onContinue }: Props) {
  const [selected, setSelected] = useState<string[]>(value ?? initial ?? [])

  function toggle(option: string) {
    setSelected((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        <div className="stack" role="group" aria-label={title}>
          {options.map((option) => {
            const isSelected = selected.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                className={isSelected ? 'choice is-selected' : 'choice'}
                aria-pressed={isSelected}
                onClick={() => toggle(option.value)}
              >
                <span className={isSelected ? 'box is-on' : 'box'} aria-hidden="true">
                  {isSelected ? '✓' : ''}
                </span>
                <span className="choice-label">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="dock">
        <button type="button" className="btn" disabled={selected.length === 0} onClick={() => onContinue(selected)}>
          Continuar
        </button>
      </div>
    </section>
  )
}
