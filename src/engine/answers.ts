import type { Answers, Profile } from '../types'

export function asString(answers: Answers, id: string) {
  const value = answers[id]
  return typeof value === 'string' ? value : ''
}

export function asArray(answers: Answers, id: string) {
  const value = answers[id]
  return Array.isArray(value) ? value : []
}

export function formatFirstName(value: string) {
  const clean = value.trim().replace(/\s+/g, ' ')
  if (!clean) return ''
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}

export function firstName(answers: Answers) {
  return formatFirstName(asString(answers, 'primeiro_nome'))
}

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{([a-z0-9_]+)\}/gi, (_, key: string) => {
    const value = vars[key]
    return value == null ? '' : String(value)
  })
}

export function profileVars(profile: Profile) {
  return {
    primeiro_nome: profile.primeiro_nome,
    percentual: profile.percentual,
    nivel: profile.nivel,
    desafio: profile.desafio,
    foco: profile.foco,
  }
}

const BAND_MID: Record<string, number> = {
  '40-49': 45,
  '50-59': 55,
  '60-69': 65,
  '70+': 75,
}

export function orderByAge<T extends { age: number }>(items: T[], band: string) {
  const mid = BAND_MID[band]
  if (mid == null) return items
  return [...items].sort((a, b) => Math.abs(a.age - mid) - Math.abs(b.age - mid) || a.age - b.age)
}
