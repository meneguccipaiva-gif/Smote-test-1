import { Link } from 'react-router-dom'
import { quizzes } from '../content'

export function Home() {
  return (
    <div className="frame">
      <main className="column">
        <div className="screen">
          <div className="screen-body">
            <p className="kicker">Clube de Antenados</p>
            <h1>Diagnósticos para testar interesse</h1>
            <p className="subtitle">Três quizzes, o mesmo cuidado visual, cada um com a sua promessa.</p>
            <div className="stack">
              {quizzes.map((quiz) => (
                <Link key={quiz.id} className="choice home-link" to={`/${quiz.path}`}>
                  <span>
                    <strong>{quiz.name}</strong>
                    <span className="home-promise">{quiz.promise}</span>
                  </span>
                  <span className="choice-mark" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
