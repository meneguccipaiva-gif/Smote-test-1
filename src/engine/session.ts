import type { Answers, SessionState } from '../types'

const empty = (): SessionState => ({
  step: 0,
  answers: {},
  waitlist: false,
  giftOpen: false,
  submitted: false,
})

function key(quizId: string) {
  return `clube-antenados:${quizId}`
}

export function loadSession(quizId: string, screenCount: number): SessionState {
  try {
    const raw = sessionStorage.getItem(key(quizId))
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Partial<SessionState>
    const step = typeof parsed.step === 'number' ? parsed.step : 0
    return {
      step: Math.min(Math.max(0, step), Math.max(0, screenCount - 1)),
      answers: parsed.answers && typeof parsed.answers === 'object' ? (parsed.answers as Answers) : {},
      waitlist: Boolean(parsed.waitlist),
      giftOpen: Boolean(parsed.giftOpen),
      submitted: Boolean(parsed.submitted),
    }
  } catch {
    return empty()
  }
}

export function saveSession(quizId: string, state: SessionState) {
  sessionStorage.setItem(key(quizId), JSON.stringify(state))
}
