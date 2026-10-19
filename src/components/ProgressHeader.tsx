type Props = {
  canBack: boolean
  onBack: () => void
  progress: number | null
}

export function ProgressHeader({ canBack, onBack, progress }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-row">
        {canBack ? (
          <button type="button" className="back" onClick={onBack} aria-label="Voltar">
            <span aria-hidden="true">←</span>
          </button>
        ) : (
          <span className="back is-reserved" aria-hidden="true" />
        )}
        <img className="brand-logo" src="/brand/clube-antenados.png" alt="Clube de Antenados" />
        <span className="back is-reserved" aria-hidden="true" />
      </div>
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
