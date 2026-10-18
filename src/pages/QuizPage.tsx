import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QuizRunner } from '../components/QuizRunner'
import { quizBySlug } from '../content'

export function QuizPage() {
  const { slug } = useParams()
  const quiz = quizBySlug(slug)

  useEffect(() => {
    document.title = quiz ? `${quiz.name} · Clube de Antenados` : 'Clube de Antenados'
  }, [quiz])

  if (!quiz) {
    return (
      <div className="frame">
        <main className="column">
          <div className="screen">
            <div className="screen-body">
              <h1>Não encontramos este diagnóstico.</h1>
              <p className="subtitle">Volte para a lista e escolha um dos três.</p>
              <Link className="btn" to="/">
                Ver os diagnósticos
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return <QuizRunner key={quiz.id} quiz={quiz} />
}
