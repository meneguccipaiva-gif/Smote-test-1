import { useState } from 'react'
import { Icon } from './Icon'
import { Title } from './Title'
import type { Option } from '../types'

type Props = {
  title: string
  emphasis?: string
  subtitle?: string
  layout?: 'rows' | 'chips' | 'tiles'
  skipLabel?: string
  options: Option[]
  value?: string[]
  initial?: string[]
  onContinue: (value: string[]) => void
}

export function MultiChoice({
  title,
  emphasis,
  subtitle,
  layout = 'rows',
  skipLabel,
  options,
  value,
  initial,
  onContinue,
}: Props) {
  const [selected, setSelected] = useState<string[]>(value ?? initial ?? [])

  function toggle(option: string) {
    setSelected((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <Title text={title} emphasis={emphasis} />
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {layout === 'tiles' ? (
          <div className="photo-grid" role="group" aria-label={title}>
            {options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  className={isSelected ? 'photo-card is-selected' : 'photo-card'}
                  aria-pressed={isSelected}
                  onClick={() => toggle(option.value)}
                >
                  {option.image ? (
                    <>
                      <span className="photo-face is-cover">
                        <img src={option.image} alt="" />
                      </span>
                      <span className="photo-caption">
                        <span>{option.label}</span>
                        <span aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                      </span>
                    </>
                  ) : (
                    <span className="photo-plain">
                      {option.icon && <Icon name={option.icon} size={24} />}
                      <span>{option.label}</span>
                      <span aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <div className={layout === 'chips' ? 'chip-cloud' : 'stack'} role="group" aria-label={title}>
            {options.map((option) => {
              const isSelected = selected.includes(option.value)
              if (layout === 'chips') {
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={isSelected ? 'chip is-selected' : 'chip'}
                    aria-pressed={isSelected}
                    onClick={() => toggle(option.value)}
                  >
                    <span>{option.label}</span>
                    <span aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                  </button>
                )
              }
              return (
                <button
                  key={option.value}
                  type="button"
                  className={isSelected ? 'choice-row is-selected' : 'choice-row'}
                  aria-pressed={isSelected}
                  onClick={() => toggle(option.value)}
                >
                  {option.icon && (
                    <span className="choice-emoji">
                      <Icon name={option.icon} size={28} />
                    </span>
                  )}
                  <span className="choice-label">{option.label}</span>
                  <span className={isSelected ? 'tick' : 'plus'} aria-hidden="true">
                    {isSelected ? '✓' : '+'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className="dock">
        <button type="button" className="btn" disabled={selected.length === 0} onClick={() => onContinue(selected)}>
          Continuar
        </button>
        {skipLabel && (
          <button type="button" className="skip-link" onClick={() => onContinue([])}>
            {skipLabel}
          </button>
        )}
      </div>
    </section>
  )
}
