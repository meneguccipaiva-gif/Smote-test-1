import { useEffect, useRef, useState } from 'react'
import type { Option } from '../types'

type Question = {
  id: string
  title: string
  options: Option[]
}

type Props = {
  lines: string[]
  question: Question
  answer?: string
  onAnswer: (value: string) => void
  onDone: () => void
}

export function Loader({ lines, question, answer, onAnswer, onDone }: Props) {
  const lastIndex = Math.max(0, lines.length - 1)
  const [filled, setFilled] = useState(0)
  const [paused, setPaused] = useState(false)
  const [picked, setPicked] = useState(answer ?? '')
  const [released, setReleased] = useState(Boolean(answer))
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    if (paused) return
    if (filled >= lines.length) {
      const timer = window.setTimeout(() => onDoneRef.current(), 500)
      return () => window.clearTimeout(timer)
    }
    if (filled === lastIndex && !released) {
      const timer = window.setTimeout(() => setPaused(true), 40)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setFilled((current) => current + 1), 1100)
    return () => window.clearTimeout(timer)
  }, [filled, lastIndex, lines.length, paused, released])

  function confirm() {
    if (!picked) return
    onAnswer(picked)
    setReleased(true)
    setPaused(false)
  }

  return (
    <section className="screen">
      <div className="screen-body loader">
        <p className="kicker">Montando o seu plano</p>
        <ul className="loader-list">
          {lines.map((line, index) => {
            const done = index < filled
            const waiting = index === lastIndex && !released
            const filling = index === filled && !paused && filled < lines.length && !waiting
            return (
              <li key={line} className={done ? 'is-done' : undefined}>
                <p>{line.replace(/\.\.\.$/, '')}</p>
                <div className={done || filling ? 'loader-bar is-on' : 'loader-bar'}>
                  <span />
                </div>
              </li>
            )
          })}
        </ul>
        {paused && (
          <div className="loader-question">
            <h1>{question.title}</h1>
            <div className="stack">
              {question.options.map((option) => {
                const isSelected = picked === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={isSelected ? 'choice is-selected' : 'choice'}
                    aria-pressed={isSelected}
                    onClick={() => setPicked(option.value)}
                  >
                    <span className="choice-label">{option.label}</span>
                    <span className="choice-mark" aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      {paused && (
        <div className="dock">
          <button type="button" className="btn" disabled={!picked} onClick={confirm}>
            Continuar
          </button>
        </div>
      )}
    </section>
  )
}
