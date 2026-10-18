type Props = {
  canBack: boolean
  onBack: () => void
  progress: number | null
}

export function ProgressHeader({ canBack, onBack, progress }: Props) {
  return (
    <header className="topbar">
      {canBack ? (
        <button type="button" className="back" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Voltar
        </button>
      ) : (
        <span className="back is-reserved" aria-hidden="true">
          Voltar
        </span>
      )}
      {progress != null && (
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Progresso do diagnóstico"
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </header>
  )
}
