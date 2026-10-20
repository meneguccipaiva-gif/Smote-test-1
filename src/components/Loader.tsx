import { useEffect, useMemo, useRef, useState } from 'react'
import type { Option } from '../types'

type Question = {
  id: string
  title: string
  options: Option[]
}

type Proof = {
  name: string
  text: string
}

type Props = {
  lines: string[]
  question: Question
  answer?: string
  proof?: Proof
  onAnswer: (value: string) => void
  onDone: () => void
}

const BAR_MS = 4000
const WEIGHTS = [0.14, 0.33, 0.18, 0.35]

function barDelays(count: number) {
  if (count <= 0) return []
  const weights = Array.from({ length: count }, (_, index) => WEIGHTS[index % WEIGHTS.length])
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map((weight) => Math.max(280, Math.round((weight / total) * BAR_MS)))
}

export function Loader({ lines, question, answer, proof, onAnswer, onDone }: Props) {
  const lastIndex = Math.max(0, lines.length - 1)
  const delays = useMemo(() => barDelays(lines.length), [lines.length])
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
    const timer = window.setTimeout(() => setFilled((current) => current + 1), delays[filled] ?? 800)
    return () => window.clearTimeout(timer)
  }, [delays, filled, lastIndex, lines.length, paused, released])

  function confirm() {
    if (!picked) return
    onAnswer(picked)
    setReleased(true)
    setPaused(false)
  }

  return (
    <section className="screen">
      <div className="screen-body loader">
        <h1>Criando o seu plano personalizado...</h1>
        <ul className="loader-list">
          {lines.map((line, index) => {
            const done = index < filled
            const waiting = index === lastIndex && !released
            const filling = index === filled && !paused && filled < lines.length && !waiting
            return (
              <li key={line} className={done ? 'is-done' : undefined}>
                <p>{line.replace(/\.\.\.$/, '')}</p>
                <div
                  className={done || filling ? 'loader-bar is-on' : 'loader-bar'}
                  style={{ ['--bar-ms' as string]: `${delays[index] ?? 800}ms` }}
                >
                  <span />
                </div>
              </li>
            )
          })}
        </ul>
        {proof && (
          <blockquote className="proof-card">
            <p>{proof.text}</p>
            <footer>{proof.name}</footer>
          </blockquote>
        )}
      </div>
      {paused && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="loader-question-title">
            <h1 id="loader-question-title">{question.title}</h1>
            <div className={question.options.length === 2 ? 'choice-pair' : 'stack'}>
              {question.options.map((option) => {
                const isSelected = picked === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={isSelected ? 'plain-choice is-selected' : 'plain-choice'}
                    aria-pressed={isSelected}
                    onClick={() => setPicked(option.value)}
                  >
                    <span className="choice-label">{option.label}</span>
                    {question.options.length !== 2 && (
                      <span className="choice-arrow" aria-hidden="true">
                        →
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <button type="button" className="btn" disabled={!picked} onClick={confirm}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
