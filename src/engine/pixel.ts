type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  loaded: boolean
  version: string
  push: Fbq
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

type QuizRef = {
  id: string
  name: string
}

type TrackOptions = {
  custom?: boolean
}

const pixelId = import.meta.env.VITE_META_PIXEL_ID

function storageKey(quizId: string) {
  return `clube-antenados:pixel:${quizId}`
}

function alreadyFired(quizId: string, event: string) {
  try {
    const raw = sessionStorage.getItem(storageKey(quizId))
    const fired = raw ? (JSON.parse(raw) as string[]) : []
    return fired.includes(event)
  } catch {
    return false
  }
}

function remember(quizId: string, event: string) {
  try {
    const raw = sessionStorage.getItem(storageKey(quizId))
    const fired = raw ? (JSON.parse(raw) as string[]) : []
    if (!fired.includes(event)) fired.push(event)
    sessionStorage.setItem(storageKey(quizId), JSON.stringify(fired))
  } catch {
    // A aba sem storage ainda envia o evento desta visita.
  }
}

export function installPixel() {
  if (!pixelId || window.fbq) return

  const fbq = function (this: Fbq, ...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args)
    else fbq.queue.push(args)
  } as Fbq

  window.fbq = fbq
  if (!window._fbq) window._fbq = fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(script, first)
  window.fbq('init', pixelId)
}

export function trackPageView() {
  if (!pixelId) return
  window.fbq?.('track', 'PageView')
}

export function quizEventParams(quiz: QuizRef, faixa?: string) {
  return {
    content_ids: [quiz.id],
    content_name: quiz.name,
    content_category: 'smoke-test',
    ...(faixa ? { faixa_etaria: faixa } : {}),
  }
}

export function trackQuiz(
  quizId: string,
  event: string,
  params: Record<string, unknown>,
  options: TrackOptions = {},
) {
  if (!pixelId || alreadyFired(quizId, event)) return
  remember(quizId, event)
  window.fbq?.(options.custom ? 'trackCustom' : 'track', event, params)
}
