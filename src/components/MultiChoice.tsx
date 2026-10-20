import { useState, type ReactNode } from 'react'
import { Icon } from './Icon'
import { Title } from './Title'
import type { Option } from '../types'

type Props = {
  title: string
  emphasis?: string
  subtitle?: string
  subtitleMark?: string
  layout?: 'rows' | 'chips' | 'tiles'
  skipLabel?: string
  selectAllLabel?: string
  options: Option[]
  value?: string[]
  initial?: string[]
  onContinue: (value: string[]) => void
}

export function MultiChoice({
  title,
  emphasis,
  subtitle,
  subtitleMark,
  layout = 'rows',
  skipLabel,
  selectAllLabel,
  options,
  value,
  initial,
  onContinue,
}: Props) {
  const [selected, setSelected] = useState<string[]>(value ?? initial ?? [])
  const allSelected = options.length > 0 && options.every((option) => selected.includes(option.value))

  function toggle(option: string) {
    setSelected((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  function toggleAll() {
    setSelected(allSelected ? [] : options.map((option) => option.value))
  }

  return (
    <section className="screen">
      <div className="screen-body">
        <Title text={title} emphasis={emphasis} />
        {subtitle && <p className="subtitle">{renderSubtitle(subtitle, subtitleMark)}</p>}
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
        {selectAllLabel && (
          <button
            type="button"
            className={allSelected ? 'photo-select-all is-selected' : 'photo-select-all'}
            aria-pressed={allSelected}
            onClick={toggleAll}
          >
            <span>{selectAllLabel}</span>
            <span aria-hidden="true">{allSelected ? '✓' : '+'}</span>
          </button>
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

function renderSubtitle(text: string, mark?: string): ReactNode {
  if (!mark) return text
  const index = text.indexOf(mark)
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <strong className="subtitle-mark">{mark}</strong>
      {text.slice(index + mark.length)}
    </>
  )
}
