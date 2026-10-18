import { blindagem } from './blindagem'
import { cerebro } from './cerebro'
import { memorias } from './memorias'
import type { QuizDefinition } from '../types'

export const quizzes: QuizDefinition[] = [blindagem, cerebro, memorias]

export function quizBySlug(slug: string | undefined) {
  return quizzes.find((quiz) => quiz.path === slug)
}
